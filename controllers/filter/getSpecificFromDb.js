const Filter = require('../../models/filter');

async function getSpecificFromDb(comboId) {
    if (!comboId.length) return console.error('❌ Missing arguments');
    let comboIdArray = comboId.split(', ');
    console.log(comboIdArray)
    try {
        const filter = await Filter.find({
            'comboId': { $in: comboIdArray}
        }).sort({expireDate: -1})
        return filter;
    } catch (err) {
        return false
    }
}

module.exports = getSpecificFromDb;