const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config(); // Load environment variables

const sapLeaveURL = process.env.SAP_LEAVE_URL;
const sapUsername = process.env.SAP_USERNAME;
const sapPassword = process.env.SAP_PASSWORD;

// Function to fetch employee leave data from SAP
exports.getEmployeeLeave = async (req, res) => {
    try {
        const pernr = req.query.pernr || '00000001'; // Defaulting to '00000001'

        // Construct the SOAP request XML for ZhrFmEmployeeLeave
        const soapRequest = `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
            <soap-env:Header/>
            <soap-env:Body>
                <n0:ZhrFmEmployeeLeave xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
                    <Pernr>${pernr}</Pernr>
                </n0:ZhrFmEmployeeLeave>
            </soap-env:Body>
        </soap-env:Envelope>`;

        const response = await axios.post(
            sapLeaveURL,
            soapRequest,
            {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_HR_EMP_LEAVE:ZhrFmEmployeeLeaveRequest', // IMPORTANT
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
                // Note: 'item' will be an array if there are multiple leave records
                const leaveData = result['soap-env:Envelope']['soap-env:Body']['n0:ZhrFmEmployeeLeaveResponse']['EtLeavetab']['item'];

                if (leaveData) {
                    res.status(200).json({
                        success: true,
                        leaveRecords: Array.isArray(leaveData) ? leaveData : [leaveData], // Ensure it's always an array
                    });
                } else {
                    res.status(404).json({ message: 'Employee leave records not found' });
                }
            } catch (parseError) {
                console.error('Error extracting leave data from parsed XML:', parseError);
                res.status(500).json({ message: 'Failed to extract leave data' });
            }
        });

    } catch (error) {
        console.error('Error fetching employee leave from SAP:', error.message);
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