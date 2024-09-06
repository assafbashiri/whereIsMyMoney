const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');
const { processCSV, downloadFile } = require('./utils/parseCSV')
const fs = require('fs');
const path = require('path');

const bot = new Telegraf("7083354200:AAH-5r9fidnG-7-aLAZrAMyDkoRU4k7nAoY", {polling: true})

const uploadCSVWizard = new Scenes.WizardScene(
  'upload-csv-wizard',
  (ctx) => {
    console.log(ctx.session.data.portfolio)
    ctx.reply('CHOOSE FILE');
  }
  );
  uploadCSVWizard.on('document', async (ctx) => {
  
    if (ctx.message.document.mime_type !== 'text/csv') {
      return ctx.reply('Please upload a CSV file.');
      return ctx.wizard.back();
    }
    const fileId = ctx.message.document.file_id;
    const file = await bot.telegram.getFile(fileId);
    const filePath = path.join(__dirname, 'temp.csv');
    await downloadFile(file, filePath);
  
    console.log('4'*100);
    try {
  
      // Process the CSV file
      const records = await processCSV(filePath);
      if (records) {
        ctx.reply('CSV file processed successfully!');
        console.log(records); // Print records or handle them as needed
      } else {
        ctx.reply('Failed to process CSV file.');
      }
      records.forEach(async (record) => {
        investment = {
          ticker: record.Symbol,
          quantity: parseFloat(record.Quantity),
          currency: record.Currency,
          price: parseFloat(record['Cost Price']),
          date: formatDateToString(new Date()),
          type: "stocks"
        }
        // Add each record to the portfolio
        await addInvestmentToPortfolio(ctx.session.data.portfolio, investment);
      });
  
      // Clean up
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error handling document:', error);
      ctx.reply('An error occurred while processing your file.');
    }
    ctx.reply('Done');
    ctx.scene.leave();
  });

  uploadCSVWizard.command("cancel", (ctx)=>ctx.scene.leave());
  function formatDateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
module.exports = { uploadCSVWizard };