const { Telegraf,Scenes } = require('telegraf')
const { addInvestmentToPortfolio } = require('./db'); // Import the function from db.js
const { generateKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');


const addInvestmentWizard = new Scenes.WizardScene(
  'add-investment-wizard',
  (ctx) => {
    ctx.reply('CHOOSE INVESTMENT TYPE:', {  reply_markup: 
      {inline_keyboard: [ 
        [{ text: 'STOCKS', callback_data: 'stocks' }], 
        [{ text: 'CRYPTO', callback_data: 'crypto' }], 
        [{ text: 'SAVINGS', callback_data: 'savings' }] 
      ]}});
    return ctx.wizard.next();
  },
  (ctx) => {
    const type = ctx.callbackQuery.data
    if(type == "stocks"){ 
      return ctx.scene.enter('add-stocks-investment-wizard')
    }else if(type == "crypto"){
      return ctx.scene.enter('add-crypto-investment-wizard')
    }else if(type == "savings"){
      return ctx.scene.enter('add-savings-investment-wizard')
    }
  }  
  );

addInvestmentWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { addInvestmentWizard };