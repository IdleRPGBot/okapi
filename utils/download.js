const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");

const proxy = require("../config.json").proxy;

var getData = async url => {
  try {
    const response = await fetch(url, {
      timeout: 5 * 1000,
      size: 4000000,
      agent: proxy ? new HttpsProxyAgent(proxy) : undefined
    });
    if (!response.ok) throw Error(`The server returned ${response.status}`);
    return await response.buffer();
  } catch (error) {
    throw error;
  }
};

module.exports.getData = getData;
