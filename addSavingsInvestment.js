const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const addSavingsInvestmentWizard = new Scenes.WizardScene(
  'add-savings-investment-wizard',
  (ctx) => {
    ctx.reply('ENTER SAVINGS NAME:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    
    ctx.session.data.investment = {
      name: ctx.message.text.toUpperCase()};
      await ctx.reply('CHOOSE CURRENCY', {
        reply_markup: {inline_keyboard: [
          [{ text: 'USD', callback_data: 'USD' }],
          [{ text: 'ILS', callback_data: 'ILS' }],
          [{ text: 'EUR', callback_data: 'EUR' }]
        ]}
      });
      return ctx.wizard.next();
  },
  async (ctx) => {
    const currency = ctx.callbackQuery.data;
    ctx.session.data.investment = {...ctx.session.data.investment, currency: currency};
    ctx.reply('ENTER AMOUNT');
    return ctx.wizard.next();
},
  async (ctx) => {
    const amount = ctx.message.text
    if (isNaN(amount) || parseFloat(amount) <= 0) {

      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, amount:parseFloat(amount)};
    ctx.reply('ENTER INTRESET RATES (yearly)');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const rate = ctx.message.text
    if (isNaN(rate) || parseFloat(rate) < 0) {
      await ctx.reply('Invalid rate. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, rate:parseFloat(rate)};
    const investment = {...ctx.session.data.investment};
    await ctx.reply('ENTER ISSUED DATE (YYYY-MM-DD)');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const date = ctx.message.text
    //validate the date is valid
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.log("The date is not in the correct format (YYYY-MM-DD).");
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
  }
    ctx.session.data.investment = {...ctx.session.data.investment, date:date};
    const investment = {...ctx.session.data.investment, type:"savings"};
    const res = await  addInvestmentToPortfolio(ctx.session.data.portfolio, investment);
    ctx.reply(res);
    return ctx.scene.leave();
  }
  );

  addSavingsInvestmentWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { addSavingsInvestmentWizard };