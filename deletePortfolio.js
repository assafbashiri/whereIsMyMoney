const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio, deletePortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const deletePortfolioWizard = new Scenes.WizardScene(
  'delete-portfolio-wizard',
  async (ctx) => {
    await ctx.reply('AREB YOU SURE?', {
      reply_markup: {inline_keyboard: [
        [{ text: 'YES', callback_data: 'yes' }],
        [{ text: 'NO', callback_data: 'no' }]
      ]}
    });
    return ctx.wizard.next();
  },async (ctx) => {
    // "get-portfolio-wizard"
    const answer = ctx.callbackQuery.data;
    if (answer == "yes") {
      ans = await deletePortfolio(ctx.session.data.portfolio);
      if (ans){
        await ctx.reply("portfolio deleted");
    }}
    ctx.scene.enter('get-portfolio-wizard');
    ctx.scene.leave();
    
  },
  async (ctx) => {
    
      await ctx.reply('CHOOSE CURRENCY', {
        reply_markup: {inline_keyboard: [
          [{ text: 'USD', callback_data: 'USD' }],
          [{ text: 'ILS', callback_data: 'ILS' }],
          [{ text: 'EUR', callback_data: 'EUR' }]
        ]}
      });
      return ctx.wizard.next();
  },
  (ctx) => {
    const currency = ctx.callbackQuery.data;
    ctx.session.data.investment = {...ctx.session.data.investment, currency: currency};
    ctx.reply('ENTER QUANTITY');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const quantity = ctx.message.text;

  // Validate the quantity input
  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    await ctx.reply('Invalid quantity. Please enter a valid positive number.');
    return ctx.wizard.back(); // Return to the previous step to ask for quantity again
  }
    ctx.session.data.investment = {...ctx.session.data.investment, quantity: quantity};
    ctx.reply('ENTER PURCHASE PRICE');
    return ctx.wizard.next();
},
  async (ctx) => {
    const price = ctx.message.text
    if (isNaN(price) || parseFloat(price) <= 0) {
      await ctx.reply('Invalid price. Please enter a valid positive number.');
      return ctx.wizard.back(); // Return to the previous step to ask for quantity again
    }
    ctx.session.data.investment = {...ctx.session.data.investment, price:price};
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
    const investment = {...ctx.session.data.investment, type:"stocks"};
    const res = await  addInvestmentToPortfolio(ctx.session.data.portfolio, investment);
    ctx.reply(res);
    return ctx.scene.leave();
  }
  );

  deletePortfolioWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { deletePortfolioWizard };