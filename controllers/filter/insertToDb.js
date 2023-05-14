const Filter = require('../../models/filter');

async function insertToDb(comboId, itemId, url, thumbnail, sellerName, sellerPp, sellerId, brand, size, title, price, service_fee, expireDate) {
    if (!comboId || !itemId || !url || !sellerName || !brand || !size || !title || !price || !expireDate) return console.error('❌ Missing arguments');
    const filter = new Filter({
        comboId: comboId,
        itemId: itemId,
        url: url,
        thumbnail: thumbnail,
        sellerName: sellerName,
        sellerPp: sellerPp,
        sellerId: sellerId,
        brand: brand,
        size: size,
        title: title,
        price: price,
        service_fee: service_fee,
        expireDate: expireDate,
    });
    try {
        await filter.save();
        console.log('✨ Saved to DB');
    } catch (err) {
        return false
    }
}

module.exports = insertToDb;