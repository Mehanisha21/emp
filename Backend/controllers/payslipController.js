const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config(); // Load environment variables

const sapPayslipURL = process.env.SAP_PAYSLIP_URL;
const sapUsername = process.env.SAP_USERNAME;
const sapPassword = process.env.SAP_PASSWORD;

// Function to fetch employee payslip data from SAP
exports.getEmployeePayslip = async (req, res) => {
    try {
        const pernr = req.query.pernr || '00000001'; // Defaulting to '00000001'

        // Construct the SOAP request XML for ZhrFmEmpPayslip
        const soapRequest = `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
            <soap-env:Header/>
            <soap-env:Body>
                <urn:ZhrFmEmpPayslip>
                    <Pernr>${pernr}</Pernr>
                </urn:ZhrFmEmpPayslip>
            </soap-env:Body>
        </soap-env:Envelope>`;

        const response = await axios.post(
            sapPayslipURL,
            soapRequest,
            {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_HR_EMP_PAYSLIP:ZhrFmEmpPayslipRequest', // IMPORTANT
                },
                auth: {
                    username: sapUsername,
                    password: sapPassword,
                },
            }
        );

        // Parse the SOAP XML response
        xml2js.parseString(response.data, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return res.status(500).json({ message: 'Error parsing SAP response' });
            }

            try {
                // Navigate through the parsed XML to extract the relevant data
                // Note: 'item' will be an array if there are multiple payslip records (e.g., for different periods)
                const payslipData = result['soap-env:Envelope']['soap-env:Body']['n0:ZhrFmEmpPayslipResponse']['EtPayslip']['item'];

                if (payslipData) {
                    res.status(200).json({
                        success: true,
                        payslipRecords: Array.isArray(payslipData) ? payslipData : [payslipData], // Ensure it's always an array
                    });
                } else {
                    res.status(404).json({ message: 'Employee payslip records not found' });
                }
            } catch (parseError) {
                console.error('Error extracting payslip data from parsed XML:', parseError);
                res.status(500).json({ message: 'Failed to extract payslip data' });
            }
        });

    } catch (error) {
        console.error('Error fetching employee payslip from SAP:', error.message);
        if (error.response) {
            console.error('SAP Response Status:', error.response.status);
            console.error('SAP Response Data:', error.response.data);
            return res.status(error.response.status).json({
                message: 'Error from SAP service',
                details: error.response.data,
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};