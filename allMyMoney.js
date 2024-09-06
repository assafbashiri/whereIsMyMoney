const { Telegraf,Scenes, Markup } = require('telegraf')
const { generateKeyboard, generateInvestmentKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');
const { getAllInvestmentsFromPortfolio, getInvestmentFromPortfolio } = require('./db');
const {getPrice} = require('./getStocks');
const { getAllPortfolios } = require('./db');


const allMyMoneyWizard = new Scenes.WizardScene(
  'all-my-money-wizard',
  async (ctx) => {
    try {
      let investments = [];
      const portfolios = await getAllPortfolios(ctx.from.id);
      for (let i = 0; i < portfolios.length; i++) {
        investments = investments.concat(portfolios[i].investments);
      }
      if (investments.length > 0) {
      const time = Math.ceil(investments.length / 8)
      ctx.reply(`this process will take ${time} minutes, thank you for your time.`);
      }
      const keyboard = await generateInvestmentKeyboard(investments, "investments");
      keyboard.inline_keyboard.push([{ text: 'BACK', callback_data: 'back' }]);
      await ctx.reply('all your money', {
        reply_markup: keyboard
      });
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      await ctx.reply('Failed to fetch portfolios.');
    }
    return ctx.scene.leave();
  }
);

allMyMoneyWizard.action('view investment', async (ctx) => {
  const investment = ctx.session.data.investment;
  console.log(investment)
  const price = await getPrice(investment);
  await ctx.reply(`${ctx.session.data.investment.name}: $${price}`, Markup.inlineKeyboard([
    Markup.button.callback('BACK', 'back')
  ]));
});

allMyMoneyWizard.action('buy more', async (ctx) => {
  const type = ctx.session.data.investment.type;
  if(type == "stocks"){
    return ctx.scene.enter("buy-more-stocks-investment-wizard");
  }else if(type == "crypto"){
  ctx.scene.enter("buy-more-crypto-investment-wizard");
  }else{
    ctx.scene.enter("buy-more-savings-investment-wizard");
  }
});

allMyMoneyWizard.action('sell', async (ctx) => {
  const investment = ctx.session.data.investment;
  console.log(investment)
  console.log(ctx.session.data.portfolio)
  return ctx.scene.enter('sell-investment-wizard');
});

allMyMoneyWizard.action('back', async (ctx) => {
  // Go back to the final step
  await ctx.reply('out of portfolios0');
  await ctx.deleteMessage(); // Optionally delete the previous message
  let step = ctx.scene.session.cursor - 1;
  if (step == 0) {
    await ctx.reply('out of portfolios1');
    return ctx.scene.enter('get-portfolio-wizard')
  }else{
    await ctx.reply('out of portfolios2');
    await ctx.reply(step);
    return ctx.wizard.selectStep(step); // Call the final step again to display the actions
  }
});


allMyMoneyWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { allMyMoneyWizard };