const jwt = require('jsonwebtoken');
const axios = require('axios');
async function sendNotifs(comboList) {
    console.log(comboList)
    await axios.post(process.env.API_URL + '/filters/notify', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt.sign(process.env.JWT_SECRET, process.env.JWT_SECRET)
        },
        body: { comboList }
    }).catch(e => {
        console.error(e)
        return e
    })
}

module.exports = sendNotifs;