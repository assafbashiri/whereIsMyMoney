const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio, updateInvestment } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const { mergeSavings } = require('./utils/utilsFunctions');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const buyMoreSavingsInvestmentWizard = new Scenes.WizardScene(
  'buy-more-savings-investment-wizard',
  async (ctx) => {
    ctx.reply('ENTER AMOUNT');
    return ctx.wizard.next();
},
  async (ctx) => {
    const amount = ctx.message.text
    if (isNaN(amount) || parseFloat(amount) <= 0) {

      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.newInvestment = {...ctx.session.data.investment, amount:parseFloat(amount)};
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
    const investment = await mergeSavings(ctx.session.data.investment, ctx.session.data.newInvestment);
    console.log("investment");
    console.log(investment);
    const res = await updateInvestment(ctx.from.id, ctx.session.data.portfolio, investment);
    ctx.reply(res);
    return ctx.scene.leave();
  }
  );

  buyMoreSavingsInvestmentWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { buyMoreSavingsInvestmentWizard };