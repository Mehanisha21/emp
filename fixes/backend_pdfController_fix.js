const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();
const nodemailer = require('nodemailer');

const sapPayslipPDFURL = process.env.SAP_PAYSLIP_PDF_URL;
const sapUsername = process.env.SAP_USERNAME;
const sapPassword = process.env.SAP_PASSWORD;

// Main controller (use for either download or email route)
exports.getEmployeePayslipPDF = async (req, res) => {
  try {
    // Get personnel number from session/user or query/body for API
    const pernr = (req.user && req.user.pernr) || req.query.pernr || req.body.pernr;
    const email = req.body?.email || req.query?.email; // Correctly check for 'email' field

    if (!pernr) {
      return res.status(400).json({ message: 'Personnel number not available.' });
    }

    // Construct SOAP XML request
    const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZhrFmEmpSlippdf>
          <Pernr>${pernr}</Pernr>
        </urn:ZhrFmEmpSlippdf>
      </soapenv:Body>
    </soapenv:Envelope>`;

    // SAP SOAP POST call
    const response = await axios.post(
      sapPayslipPDFURL,
      soapRequest,
      {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_HR_EMP_SLIP_PDF:ZhrFmEmpSlippdfRequest',
        },
        auth: {
          username: sapUsername,
          password: sapPassword,
        },
      }
    );

    // Use promise-based XML parsing with async/await
    const parseStringPromise = require('util').promisify(xml2js.parseString);
    const result = await parseStringPromise(response.data, { explicitArray: false, ignoreAttrs: true });

    // Extract base64 PDF string
    const base64PDF =
      result['soapenv:Envelope']?.['soapenv:Body']?.['urn:ZhrFmEmpSlippdfResponse']?.XPdf ||
      result['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZhrFmEmpSlippdfResponse']?.XPdf ||
      null;

    if (!base64PDF) {
      return res.status(404).json({ message: 'Payslip PDF not found for this employee.' });
    }

    const pdfBuffer = Buffer.from(base64PDF, 'base64');

    if (email) {
      // Setup mail transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Payslip for Employee ID ${pernr}`,
        text: `Dear Employee,

Please find attached your official payslip.

If you have any questions or require further clarification, feel free to reach out to the HR department.

Best regards,
HR Department`,
        attachments: [{
          filename: `Payslip_${pernr}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      };

      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: `Payslip PDF sent to ${email} successfully.` });
      } catch (mailErr) {
        console.error('Error sending payslip by email:', mailErr);
        return res.status(500).json({ message: 'PDF fetched but failed to send email', details: mailErr.message || mailErr });
      }
    } else {
      // No email: send PDF for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="payslip_${pernr}.pdf"`);
      res.send(pdfBuffer);
    }

  } catch (error) {
    console.error('Error in getEmployeePayslipPDF:', error.message || error);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'Error from SAP service',
        details: error.response.data,
      });
    }
    res.status(500).json({ message: 'Internal server error.', details: error.message || error });
  }
};
