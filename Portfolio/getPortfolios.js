const { Telegraf,Scenes } = require('telegraf')
const { getPortfolios } = require('../db'); // Import the function from db.js
const { generateKeyboard } = require('../utils/generateKeyboard');
const {prtfolioMenu} = require('../utils/protfolioMenu');
const { getPrice } = require('../getStocks');

const getPortfolioWizard = new Scenes.WizardScene(
  'get-portfolio-wizard',
  async (ctx) => {
    ctx.session.data = {};
    console.log("get-portfolio-wizard")
    try {
      const portfolios = await getPortfolios(ctx.from.id);
      ctx.session.data.portfolios = portfolios;
      const keyboard = generateKeyboard(portfolios, "protfolio");

      await ctx.reply('Select a portfolio:', {
        reply_markup: keyboard
      });
      if (!portfolios.length){
        ctx.reply('out of portfolios');
        return ctx.scene.leave();
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      await ctx.reply('Failed to fetch portfolios.');
    }
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.data.portfolio = ctx.callbackQuery.data;
    const name = ctx.session.data.portfolios.find(portfolio => portfolio._id.toString() === ctx.session.data.portfolio).name;
    await ctx.reply(`${name}`, {
      reply_markup: {inline_keyboard: [
        [{ text: 'VIEW', callback_data: 'view' }],
        [{ text: 'ADD', callback_data: 'add' }],
        [{ text: 'REMOVE INVESTMENT', callback_data: 'remove investment' }],
        [{ text: 'DELETE', callback_data: 'delete' }],
        [{ text: 'UPLOAD CSV', callback_data: 'upload csv' }]
      ]}
    });
return ctx.wizard.next();
  },
  async (ctx) => {
    return ctx.scene.leave();
  }
);

// Handle button presses
getPortfolioWizard.action('view', (ctx) => {
  console.log(ctx.session.data.portfolio)
  return ctx.scene.enter('view-investments-wizard')
});

getPortfolioWizard.action('upload csv', (ctx) => {
  console.log(ctx.session.data.portfolio)
  return ctx.scene.enter('upload-csv-wizard')
});

getPortfolioWizard.action('remove investment', (ctx) => {
  console.log(ctx.session.data.portfolio)
  return ctx.scene.enter('remove-investments-wizard')
});


getPortfolioWizard.action('add', (ctx) => {
  return ctx.scene.enter('add-investment-wizard')
});

getPortfolioWizard.action('delete', (ctx) => {
  return ctx.scene.enter('delete-investment-wizard')
});



getPortfolioWizard.command("cancel", (ctx)=>ctx.scene.leave());

module.exports = { getPortfolioWizard };


// Command to list all portfolios
// const portfolios = async (ctx) => {
//   try {
//     const portfolios = await getPortfolios(ctx.from.id);
//     const keyboard = generateKeyboard(portfolios, "protfolio");
//     createAction(portfolios);
//     await ctx.reply('Select a portfolio:', {
//       reply_markup: keyboard
//     });
//   } catch (error) {
//     console.error('Error fetching portfolios:', error);
//     await ctx.reply('Failed to fetch portfolios.');
//   }
// };

// const createAction = async (list) =>{
//   list.map(portfolio => {
//     console.log("creating")
//     console.log(portfolio)
//     const id = portfolio._id.toString();
//     console.log(id)
//     bot.action(id, async (ctx) => {
//       await ctx.answerCbQuery();
//       await ctx.reply('You chose portfolio: ' + portfolio.portfolio_name);
//     });
//   }
//   )
// }

// module.exports = { portfolios };