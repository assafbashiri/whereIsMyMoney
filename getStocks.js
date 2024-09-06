const axios = require('axios');
const moment = require('moment');
const { getIdBySymbol } = require('./utils/parseCSV');
const {i18next} = require('./translation');

const ALPHA_VANTAGE_API_KEY = "YLA2OQ1SRNBHPFKV"; // Replace with your Alpha Vantage API key
const COINGECKO_API_KEY = "CG-y4s9mNsCLM6ak4VEXiKda5zB";
const polygonKey = "RWDvdYv7B8ddXqKEa3ofTkHYPGjjmbOd";
const TWELVE = "bf36306478a64037ba177eff37064cc7"


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getStockPrice(ticker, date = moment('2023-07-25').format('YYYY-MM-DD')) {
  await sleep(8 * 1000);
  
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1); 
  const formattedDate = moment(yesterday).format('YYYY-MM-DD');
  
  try {
    // const url = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/${currentDate}/${currentDate}?apiKey=${polygonKey}`;
    const response = await axios.get(`https://api.twelvedata.com/time_series?end_date=${formattedDate}&outputsize=1&symbol=${ticker}&interval=1day&apikey=bf36306478a64037ba177eff37064cc7`);
    console.log("response")
    console.log(response.data.values)

    const timeSeries = response.data.values[0].close;
    const stockPrice = parseFloat(timeSeries);
    // return stockPrice;
    if (isNaN(stockPrice)) {
      return "not available";
    }
    return stockPrice;
  } catch (error) {
    console.log("error");
    console.log(ticker);
    console.error('Error fetching stock price:', error.message);
    // throw error;
    return "uavalable"
  }
}

/**
 * Fetches the stock price for a given ticker and date.
 * @param {string} ticker - The stock ticker symbol.
 * @param {string} date - The date for the stock price in YYYY-MM-DD format.
 * @returns {Promise<number>} - The stock price on the given date.
 */
async function getBackupStockPrice(ticker, date = moment('2023-07-25').format('YYYY-MM-DD')) {
  console.log("getStockPrice")
  console.log(ticker)
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1); 
  const formattedDate = moment(yesterday).format('YYYY-MM-DD');
  console.log("formattedDate")
  console.log(formattedDate)
  
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: ticker,
        outputsize: 'full',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });
    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries || !timeSeries[formattedDate]) {
      throw new Error(`No data available for ${ticker} on ${formattedDate}`);
    }

    const stockPrice = parseFloat(timeSeries[formattedDate]['4. close']);
    // return stockPrice;
    if (isNaN(stockPrice)) {
      return "not available";
    }
    return stockPrice;
  } catch (error) {
    console.error('Error fetching stock price:', error.message);
    // throw error;
    return "uavalable"
  }
}

async function getCryptoPrice(symbol, date = moment('2023-07-25').format('YYYY-MM-DD')) {
  const coinId = getIdBySymbol(symbol);
  const url = `https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/today`
  try {
    const response = await axios.get(url);
    const data = response.data;
    const price = data[0].close;
    return price;
  } catch (error) {
    console.error('Error fetching crypto price:', error.message);
    throw error;
  }
}
async function getSavingsPrice(investment) {
  const principal = investment.amount;
  const rate = investment.rate / 100; // Convert percentage to a decimal
  const startDate = new Date(investment.date);
  const currentDate = new Date();
  const years = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365);
  const total = principal * (1 + rate * years);
  return total;
}

async function getPrice(investment){
  if (investment.type == "stocks") {
    return getStockPrice(investment.ticker);
  } else if (investment.type == 'crypto') {
    return getCryptoPrice(investment.symbol, "USD");
  } else if (investment.type == 'savings') {
      return getSavingsPrice(investment);
  } else {
    throw new Error('Invalid type. Must be either "stocks" or "crypto", or "savings"');
  }

}

module.exports = { getPrice, getSavingsPrice };
const key = "YLA2OQ1SRNBHPFKV"