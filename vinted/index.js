const { search } = require('./search');
const { parseVintedURL } = require('./parseUrl');
const comboList = require('../comboList.json');
const fs = require('fs');
const vintedSearch = require('./search');

function main() {
    for (let i = 0; i < comboList.length; i++) {
        let fetchedArticles = [];
        let combo = comboList[i];
        setInterval(() => {
            vintedSearch(combo.url).then((articles) => {
                articles = articles.items;
                if (articles.length > 0) {
                    articles.forEach(article => {
                        if (!fetchedArticles.includes(article.id)) {
                            console.log('🎉 New article found : ', article.id)
                            fetchedArticles.push(article.id)
                        }
                    })
                }
            })
        }, 5000);
    }
}

module.exports = main;