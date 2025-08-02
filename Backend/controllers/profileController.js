const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config(); // Load environment variables from .env

const sapProfileURL = process.env.SAP_PROFILE_URL;
const sapUsername = process.env.SAP_USERNAME;
const sapPassword = process.env.SAP_PASSWORD;

// Function to fetch employee profile from SAP
exports.getEmployeeProfile = async (req, res) => {
    try {
        // You might want to get Pernr (personnel number) from query parameters or request body
        // For this example, let's assume a hardcoded value or pass it via req.query
        const pernr = req.query.pernr || '00000001'; // Defaulting to the one from your example

        // Construct the SOAP request XML
        const soapRequest = `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
            <soap-env:Header/>
            <soap-env:Body>
                <n0:ZhrFmEmpProfile xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
                    <Pernr>${pernr}</Pernr>
                </n0:ZhrFmEmpProfile>
            </soap-env:Body>
        </soap-env:Envelope>`;

        const response = await axios.post(
            sapProfileURL,
            soapRequest,
            {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_HR_EMP_PROFILE:ZhrFmEmpProfileRequest', // Important for SAP SOAP
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
                const profileData = result['soap-env:Envelope']['soap-env:Body']['n0:ZhrFmEmpProfileResponse']['EtProftab'];

                if (profileData) {
                    res.status(200).json({
                        success: true,
                        profile: profileData,
                    });
                } else {
                    res.status(404).json({ message: 'Employee profile not found' });
                }
            } catch (parseError) {
                console.error('Error extracting profile data from parsed XML:', parseError);
                res.status(500).json({ message: 'Failed to extract profile data' });
            }
        });

    } catch (error) {
        console.error('Error fetching employee profile from SAP:', error.message);
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