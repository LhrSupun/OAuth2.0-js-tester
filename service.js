const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const accessTokenUrl = process.env.ACCESS_TOKEN_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = process.env.SCOPE;

function getToken() {
    const buff = Buffer.from(`${clientId}:${clientSecret}`);
    const authHeader = `Basic ${buff.toString('base64')}`;

    const options = {
        url: accessTokenUrl,
        method: 'POST',
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'client_credentials',
            scope: scope
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                try {
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

module.exports = getToken;