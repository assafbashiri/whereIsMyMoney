const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const buyMoreCryptoInvestmentWizard = new Scenes.WizardScene(
  'buy-more-crypto-investment-wizard',
  (ctx) => {
    ctx.reply('ENTER QUANTITY');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const quantity = ctx.message.text;
  // Validate the quantity input
  if (isNaN(quantity) || parseFloat(quantity) <= 0) {
    await ctx.reply('Invalid quantity. Please enter a valid positive number.');
    return ctx.wizard.back(); // Return to the previous step to ask for quantity again
  }
    ctx.session.data.investment = {...ctx.session.data.investment, quantity: parseFloat(quantity)};
    ctx.reply('ENTER PURCHASE PRICE');
    return ctx.wizard.next();
},
  async (ctx) => {
    const price = ctx.message.text
    if (isNaN(price) || parseFloat(price) <= 0) {
      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
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
    const investment = {...ctx.session.data.investment, type:"crypto"};
    const res = await  addInvestmentToPortfolio(ctx.session.data.portfolio, investment);
    ctx.reply(res);
    return ctx.scene.leave(); 
  }
  );

  buyMoreCryptoInvestmentWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { buyMoreCryptoInvestmentWizard };