const UserAgent = require("user-agents");
const cookie = require("cookie");
const { HttpProxyAgent } = require('http-proxy-agent');
const fs = require('fs');
const axios = require('axios')
const parseVintedURL = require('./parseUrl.js');

const PROXY_LIST = fs.readFileSync('proxy.txt', 'utf-8').split('\n').filter(Boolean).map(proxy => { 
  return 'https://'+proxy.split(':')[0]+':'+proxy.split(':')[1].replace('\r', '') 
});

const REQUESTS_PER_PROXY = 5;

// Select a new proxy from the list
let currentProxyIndex = 0;
let requestsSinceLastProxyChange = 0;
function getNextProxy() {
    if (requestsSinceLastProxyChange >= REQUESTS_PER_PROXY) {
        currentProxyIndex = (currentProxyIndex + 1) % PROXY_LIST.length;
        requestsSinceLastProxyChange = 0;
    }
    const nextProxy = PROXY_LIST[currentProxyIndex];
    requestsSinceLastProxyChange++;
    return new HttpProxyAgent(nextProxy);
}


//fetches a Vinted cookie to authenticate the requests
const fetchCookie = async (proxy, domain = "be") => {

    const controller = new AbortController();
    let response = await axios.get(`https://vinted.${domain}`, {
        signal: controller.signal,
        headers: {
            'User-Agent': new UserAgent().toString(),
        },
        agent: proxy
    }).catch((err) => {
        console.log(err)
        controller.abort();
        return false
    })
    if (!response || !response.headers) return false;
    const sessionCookie = response?.headers['set-cookie']?.join(', ');
    controller.abort();
    return cookie.parse(sessionCookie)['secure, _vinted_fr_session'];
};

// Search endpoint
async function vintedSearch (url) {
    const proxyAgent = getNextProxy();
    const c = await fetchCookie(proxyAgent);
    if (!c) return []
    const controller = new AbortController();
    let querystring = parseVintedURL(url)?.querystring
    console.log('🔍 Searching for : ', querystring)
    if (!querystring) return []
    let response = await axios.get(`https://www.vinted.be/api/v2/catalog/items?${querystring}`, {
        agent: proxyAgent,
        headers: {
            Cookie: "_vinted_fr_session=" + c,
            accept: "application/json, text/plain, */*",
            'User-Agent': 'vinted-ios Vinted/22.6.1 (lt.manodrabuziai.fr; build:21794; iOS 15.2.0) iPhone10,6',
            'short-bundle-version': '22.6.1',
            'x-app-version': '22.6.1',
            'x-device-model': 'iPhone10,6',
        },
        withCredentials: true,
        timeout: 10000,
    })
    .catch((err) => {
        console.log(err.response?.status, err.response?.statusText)
        controller.abort();
        return err
    });
    console.log('------------------------------')
    console.log(response.response?.status || response.status, response.response?.statusText || response.statusText)
    console.log('🧨 Used proxy : ', proxyAgent.proxy.href)
    console.log('🍪 Used cookie : ', c.length)
    console.log('✨ Found ' + response.data?.items?.length + ' items')
    console.log('------------------------------')
    controller.abort();
    return response.data
};

module.exports = vintedSearch;
