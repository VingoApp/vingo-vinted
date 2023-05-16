const { search } = require('./search');
const { parseVintedURL } = require('./parseUrl');
const comboList = require('../comboList.json');
const fs = require('fs');
const vintedSearch = require('./search');
const insertToDb = require('../controllers/filter/insertToDb');
const sendNotifs = require('../controllers/filter/sendNotifs');

function main() {
    setInterval(async () => {
        let fetchedArticles = [];
        for (let i = 0; i < comboList.length; i++) {
            let combo = comboList[i];
            let new_articles = [];
            vintedSearch(combo.url).then(async (articles) => {
                if (!articles?.items) return;
                articles = articles?.items;
                if (fetchedArticles.length == 0) fetchedArticles = articles.map(article => article.id);
                if (articles.length > 0 && fetchedArticles.length != 0) {
                    articles.forEach(async (article) => {
                        let itemDate = new Date(article.photo?.high_resolution?.timestamp * 1000);
                        if (!fetchedArticles.includes(article.id) && article.is_visible && itemDate && (new Date(itemDate.setMinutes(itemDate.getMinutes() + 2, 5)) > new Date())) {
                            console.log('🎉 New article found : ', article.id, (new Date(itemDate.setMinutes(itemDate.getMinutes() + 2, 5)).getMinutes() > new Date().getMinutes()))
                            fetchedArticles.push(article.id)
                            new_articles.push({ comboId: combo.id, itemId: article.id, url: article.url, thumbnail: article.photo?.url, sellerName: article.user?.login, sellerPp: article.user?.profile_url, sellerId: article.user?.id, brand: article.brand_title, size: article.size_title, title: article.title, price: article.price, service_fee: parseInt(article.service_fee) + 3, expireDate: new Date()});
                            try {
                                await insertToDb(combo.id, article.id, article.url, article.photo?.url, article.user?.login, article.user?.profile_url, article.user?.id, article.brand_title, article.size_title, article.title, article.price, parseInt(article.service_fee)+3, new Date());
                            } catch (err) {
                                return err
                            }

                        }
                    })
                    await sendNotifs(new_articles)
                }
            }).catch(e => {
                return e
            })
        }
    }, 20000);
}

module.exports = main;