const nodeFetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");

const proxy = require("../config.json").proxy;
const proxy_auth = require("../config.json").proxy_auth;

async function fetch(url) {
  var headers = {
    "Proxy-Authorization-Key": proxy_auth,
    "Requested-URI": url,
    "Accept": "application/json"
  }
  return await nodeFetch(proxy, { timeout: 5 * 1000, size: 4000000, headers: headers });
}


async function getData(url) {
  try {
    const response = await fetch(url);
    return await response.buffer();
  } catch (error) {
    throw error;
  }
}

async function getDataPipe(url) {
  const response = await fetch(url);
  return response.body;
}

module.exports = { getData: getData, getDataPipe: getDataPipe };
