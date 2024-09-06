const { parse } = require('csv-parse/sync');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const TOKEN = "7255246199:AAGnXM8ltw3iwj62BPuiL3KegsOJW9EpcyM"
const data = JSON.parse(fs.readFileSync('utils/coins.json', 'utf8')); // Load JSON data from file
async function processCSV(filePath) {
  try {
    console.log('2'*100);
    const fileContent = fs.readFileSync(filePath);
    const records = parse(fileContent, {
      columns: true, // If your CSV has headers, use 'true'
      skip_empty_lines: true
    });
    return records;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    return null;
  }
}

async function downloadFile(file, filePath) {
  console.log('000000000000000000000000000000000000000000000000000000000000000');
  try {
    
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;

    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });
    console.log('response', response.data);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      response.data.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    console.log("11111111111111111111111111111")
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

function getIdBySymbol(symbol) {
  const item = data.find(entry => entry.symbol.toUpperCase() === symbol.toUpperCase());
  return item ? item.id : null; // Return ID if found, otherwise return null
}

module.exports = { processCSV, downloadFile, getIdBySymbol };