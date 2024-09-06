const { Telegraf,Scenes, Markup } = require('telegraf')
const { sellSavingsInvestmentFromPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const sellSavingsInvestmantWizard = new Scenes.WizardScene(
  'sell-savings-investment-wizard',
  (ctx) => {
    ctx.reply('HOW MUCH DO YOU WANT TO SELL?');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const amount = ctx.message.text;
    // Validate the quantity input
    if (isNaN(amount) || parseInt(amount) <= 0) {
      await ctx.reply('Invalid quantity. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, amount: parseFloat(amount)};
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
    const profit = await sellSavingsInvestmentFromPortfolio(ctx.session.data.portfolio, investment);
    await ctx.reply(`'INVESTMENT SOLD'\nprofit: $${profit}`)
    return ctx.scene.leave();
  }
);
module.exports = { sellSavingsInvestmantWizard };