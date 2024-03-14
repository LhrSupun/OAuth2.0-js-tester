const express = require('express');
const getToken = require('./service');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

/* 
{
    "token_type": "Bearer",
    "expires_in": 3599,
    "ext_expires_in": 3599,
    "access_token": ""
}
*/

const getTokenGenerator = () => {
    let response = null;
    let expires_in = 0;
    const generateToken = async () => {
        const now = Math.floor(Date.now() / 1000); // in seconds
        // minutes
        if (!response || now >= expires_in) {
            const accessTokenUrl = process.env.ACCESS_TOKEN_URL;
            const clientId = process.env.CLIENT_ID;
            const clientSecret = process.env.CLIENT_SECRET;
            const scope = process.env.SCOPE;

            try {
                const token = await getToken(accessTokenUrl, clientId, clientSecret, scope);
                response = token;
                expires_in = now + token.expires_in;
                console.log(`new token generated. Expires in ${expires_in} seconds`);
                return response;
            } catch (error) {
                console.error("Error while fetching access token:", error);
                throw error;
            }
        } else {
            console.log(`using existing token. Expires in ${expires_in - now} seconds`);
            return response;
        }

    }
    return generateToken;
}

const genT = getTokenGenerator();

app.get('/', (req, res) => {
    res.send('working');
});

app.get('/get-token', async (req, res) => {
    try {
        const token = await genT();
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching token');
    }
});


app.listen(3000, () => console.log('Server listening on port 3000'))