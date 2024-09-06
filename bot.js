const { Telegraf,Scenes, session } = require('telegraf')
const {i18next} = require('./translation');
const path = require('path');
const { message } = require('telegraf/filters')
const { addUser, getPortfolios, createPortfolio } = require('./db'); // Import the function from db.js
const { createPortfolioWizard } = require('./Portfolio/createPortfolio');
const { getPortfolioWizard } = require('./Portfolio/getPortfolios');
const { addInvestmentWizard } = require('./addInvestment');
const { addStocksInvestmentWizard } = require('./addStocksInvestment');
const { uploadCSVWizard } = require('./uploadFromCSV');
const { addCryptoInvestmentWizard } = require('./addCryptoInvestment');
const { addSavingsInvestmentWizard } = require('./addSavingsInvestment');
const { sellStocksInvestmantWizard } = require('./sellStocksInvestment');
const { sellSavingsInvestmantWizard } = require('./sellSavingsInvestment');
const { buyMoreStocksInvestmentWizard } = require('./buyMoreStocksInvestment');
const { buyMoreSavingsInvestmentWizard } = require('./buyMoreSavingsInvestment');
const { buyMoreCryptoInvestmentWizard } = require('./buyMoreCryptoInvestment');
const { deletePortfolioWizard } = require('./deletePortfolio');
const { allMyMoneyWizard } = require('./allMyMoney');
const { viewInvestmentsWizard } = require('./viewIvestments');
const { portfolios } = require('./Portfolio/getPortfolios');



const bot = new Telegraf("7083354200:AAH-5r9fidnG-7-aLAZrAMyDkoRU4k7nAoY", {polling: true}) //development
// const bot = new Telegraf("7255246199:AAGnXM8ltw3iwj62BPuiL3KegsOJW9EpcyM", {polling: true}) //production
const stage = new Scenes.Stage([getPortfolioWizard, createPortfolioWizard, addInvestmentWizard, 
  addCryptoInvestmentWizard, addSavingsInvestmentWizard, addStocksInvestmentWizard,  viewInvestmentsWizard, 
  sellStocksInvestmantWizard, buyMoreStocksInvestmentWizard, buyMoreSavingsInvestmentWizard, buyMoreCryptoInvestmentWizard,
  allMyMoneyWizard, sellSavingsInvestmantWizard, uploadCSVWizard, deletePortfolioWizard]);

  
// Register the session middleware
bot.use(session());
bot.use(stage.middleware());
// Handle any button press
bot.start( async (ctx) => {
  const user = await addUser(ctx.from.id)
  ctx.reply(i18next.t('welcome'));
  if (user) {
    // If the user is not in the database, save them
    // First interaction with any button
    ctx.reply('to learn more about the bot, type /help or /start again to get started');
    return;
  }
  ctx.reply('Welcome! Please choose an option:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'create portfolio', callback_data: 'create portfolio' }],
        [{ text: 'view portfolios', callback_data: 'view portfolios' }],
        [{ text: 'all my money', callback_data: 'all my money' }]
      ]
    }
  })
});

bot.action('/help', async (ctx) => {
  ctx.reply('This bot is designed to help you manage your investments. You can create a new portfolio, add investments to it, and view the total value of your investments. To get started, type /start');
});

bot.action('create portfolio', async (ctx) => {
  ctx.scene.enter('create-portfolio-wizard')
});

bot.action('view portfolios', async (ctx) => {
  await ctx.answerCbQuery();
  // await ctx.editMessageText('Portfolio creation initiated. Please follow further instructions.');
  // await ctx.editMessageReplyMarkup({
  //   inline_keyboard: [
  //     [{ text: 'view portfolios', callback_data: 'view portfolios' }]
  //   ] })
  ctx.scene.enter('get-portfolio-wizard')
});

bot.action('all my money', async (ctx) => {
  ctx.scene.enter('all-my-money-wizard')
});

stage.command('quit', (ctx) => {
  console.log('Quitting');
  ctx.reply('You have exited the current wizard. You are back at the starting point.');
  ctx.scene.leave(); // Exits the current scene
  ctx.session = null; // Optional: Clear the session if needed
});

// Command to start the wizard
bot.command('create', (ctx) => ctx.scene.enter('create-portfolio-wizard'));
bot.command('pull', (ctx) => ctx.scene.enter('get-portfolio-wizard'));
bot.command('all', (ctx) => {ctx.scene.enter('all-my-money-wizard')});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


module.exports = bot;