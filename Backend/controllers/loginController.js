// controllers/loginController.js
const axios = require('axios');
require('dotenv').config(); // Ensure dotenv is loaded here too for direct access

// Retrieve SAP configuration from environment variables
const sapLoginUrl = process.env.SAP_LOGIN_URL;
const sapUsername = process.env.SAP_USERNAME;
const sapPassword = process.env.SAP_PASSWORD;

exports.employeeLogin = async (req, res) => {
    // Extract personal number and password from the request body
    const { persno, password } = req.body;

    // Basic validation
    if (!persno || !password) {
        return res.status(400).json({ message: 'Personal number and password are required in the request body.' });
    }

    // Construct the SOAP XML request body
    const soapRequestXml = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:ZhrEmpLogin>
                    <Password>${password}</Password>
                    <Persno>${persno}</Persno>
                </urn:ZhrEmpLogin>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    // Configure the Axios request
    const config = {
        headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            // IMPORTANT: Confirm this SOAPAction header from your SAP WSDL
            'SOAPAction': 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_HR_EMP:ZhrEmpLoginRequest',
        },
        // **CRUCIAL for SAP:** HTTP Basic Authentication
        auth: {
            username: sapUsername,
            password: sapPassword,
        },
    };

    try {
        // Make the POST request to the SAP SOAP endpoint
        const response = await axios.post(sapLoginUrl, soapRequestXml, config);

        const sapResponseData = response.data; // The raw XML response from SAP
        console.log('SAP RAW Response:', sapResponseData); // Log the full response for debugging

        // A simple check for "Success" in the SOAP response.
        // For more robust parsing, consider using an XML parsing library like 'xml2js'.
        if (sapResponseData.includes('<Status>Success</Status>')) {
            res.status(200).json({ status: 'Success', message: 'Employee logged in successfully.' });
        } else {
            // If SAP didn't return 'Success', respond with a failure status
            // Include the raw SAP response for better debugging on the client side
            res.status(401).json({
                status: 'Failed',
                message: 'Invalid credentials or SAP login failed (check SAP response).',
                sapResponse: sapResponseData // Provide the actual SAP response for client analysis
            });
        }

    } catch (error) {
        console.error('Error calling SAP RFC:', error.message);

        // Enhanced error logging for network/Axios specific issues
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('SAP Error Response Data:', error.response.data);
            console.error('SAP Error Response Status:', error.response.status);
            console.error('SAP Error Response Headers:', error.response.headers);
            // Pass the SAP's error response back to the client if available
            res.status(error.response.status).json({
                message: `SAP Service responded with status ${error.response.status}`,
                sapError: error.response.data, // This will be the XML error from SAP
                axiosError: error.message
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from SAP:', error.request);
            res.status(500).json({
                message: 'No response received from SAP service.',
                axiosError: error.message
            });
        } else {
            // Something else happened while setting up the request that triggered an Error
            console.error('Error setting up Axios request:', error.message);
            res.status(500).json({
                message: 'Internal server error during request setup.',
                axiosError: error.message
            });
        }
    }
};