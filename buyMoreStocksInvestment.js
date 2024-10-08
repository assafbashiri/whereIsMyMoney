const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio, updateInvestment } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const { mergeInvestments } = require('./utils/utilsFunctions');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const buyMoreStocksInvestmentWizard = new Scenes.WizardScene(
  'buy-more-stocks-investment-wizard',
  (ctx) => {
    ctx.reply('ENTER QUANTITY');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let quantity = ctx.message.text;

  // Validate the quantity input
  if (isNaN(quantity) || parseFloat(quantity) <= 0) {
    await ctx.reply('Invalid quantity. Please enter a valid positive number.');
    return ctx.wizard.back(); // Return to the previous step to ask for quantity again
  }
    ctx.session.data.newInvestment = {...ctx.session.data.investment, quantity: parseFloat(quantity)};
    ctx.reply('ENTER PURCHASE PRICE');
    return ctx.wizard.next();
},
  async (ctx) => {
    let price = ctx.message.text
    if (isNaN(price) || parseFloat(price) <= 0) {
      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.newInvestment = {...ctx.session.data.investment, price:parseFloat(price)};
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
    ctx.session.data.newInvestment = {...ctx.session.data.newInvestment, date:date};
    const investment = await mergeInvestments(ctx.session.data.investment, ctx.session.data.newInvestment);
    const res = await updateInvestment(ctx.from.id, ctx.session.data.portfolio, investment);
    ctx.reply(res);
    return ctx.scene.leave();
  }
  );

  buyMoreStocksInvestmentWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { buyMoreStocksInvestmentWizard };