const request = require('request'); // For making HTTP requests
function getToken(accessTokenUrl, clientId, clientSecret, scope) {
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