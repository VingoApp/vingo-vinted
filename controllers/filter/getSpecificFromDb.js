const Filter = require('../../models/filter');

async function getSpecificFromDb(comboId) {
    if (!comboId.length) return console.error('❌ Missing arguments');
    let comboIdArray = comboId.split(', ');

    let filter = await Filter.find({
        'comboId': { $in: comboIdArray}
    }).sort({ expireDate: -1 }).catch(e => {
        console.log(e)
        return e
    })
    return filter;
}

module.exports = getSpecificFromDb;