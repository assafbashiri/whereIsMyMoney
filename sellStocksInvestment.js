const { Telegraf,Scenes, Markup } = require('telegraf')
const { sellStocksInvestmentFromPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const sellStocksInvestmantWizard = new Scenes.WizardScene(
  'sell-investment-wizard',
  (ctx) => {
    ctx.reply('HOW MUCH DO YOU WANT TO SELL?');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const quantity = ctx.message.text;
    // Validate the quantity input
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      await ctx.reply('Invalid quantity. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, quantity: parseFloat(quantity)};
    ctx.reply('ENTER SELL PRICE');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const price = ctx.message.text
    if (isNaN(price) || parseFloat(price) <= 0) {
      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, price:price};
    await ctx.reply('ENTER DATE OF SALE (YYYY-MM-DD)');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const date = ctx.message.text
    //validate the date is valid
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.log("The date is not in the correct format (YYYY-MM-DD).");
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
  }
    const investment = {...ctx.session.data.investment, date:date};
    const profit = await sellStocksInvestmentFromPortfolio(ctx.session.data.portfolio, investment);
    await ctx.reply(`'INVESTMENT SOLD'\nprofit: $${profit}`, Markup.inlineKeyboard([
      Markup.button.callback('BACK', 'back')
    ]));
  }
);
module.exports = { sellStocksInvestmantWizard };