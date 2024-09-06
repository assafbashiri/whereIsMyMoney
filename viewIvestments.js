const { Telegraf,Scenes, Markup } = require('telegraf')
const { generateKeyboard, generateInvestmentKeyboard } = require('./utils/generateKeyboard');
const {prtfolioMenu} = require('./utils/protfolioMenu');
const { getAllInvestmentsFromPortfolio, getInvestmentFromPortfolio } = require('./db');
const {getPrice} = require('./getStocks');


const viewInvestmentsWizard = new Scenes.WizardScene(
  'view-investments-wizard',
  async (ctx) => {
    try {
      const investments = await getAllInvestmentsFromPortfolio(ctx.from.id, ctx.session.data.portfolio);
      if (investments.length > 0) {
        const time = Math.ceil(investments.length / 8)
        ctx.reply(`this process will take ${time} minutes, thank you for your time.`);
        }
      const keyboard = await generateInvestmentKeyboard(investments, "investments");
      keyboard.inline_keyboard.push([{ text: 'BACK', callback_data: 'back' }]);
      ctx.session.data.investments = investments;
      await ctx.reply('Select a investments:', {
        reply_markup: keyboard
      });
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      await ctx.reply('Failed to fetch portfolios.');
    }
      console.log(ctx.session.data.portfolio)
    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log("a")
    ctx.session.data.investment = await getInvestmentFromPortfolio(ctx.from.id, ctx.session.data.portfolio, ctx.callbackQuery.data);
    await ctx.reply(ctx.session.data.investment.name, {
      reply_markup: {inline_keyboard: [
        [{ text: 'VIEW', callback_data: 'view investment' }],
        [{ text: 'BUY MORE', callback_data: 'buy more' }],
        [{ text: 'SELL', callback_data: 'sell' }],
        [{ text: 'BACK', callback_data: 'back' }]
      ]}
    });
return ctx.wizard.next();
  }
);

viewInvestmentsWizard.action('view investment', async (ctx) => {
  const investment = ctx.session.data.investment;
  console.log(investment)
  const price = await getPrice(investment);
  await ctx.reply(`${ctx.session.data.investment.name}: $${price}`, Markup.inlineKeyboard([
    Markup.button.callback('BACK', 'back')
  ]));
});

viewInvestmentsWizard.action('buy more', async (ctx) => {
  const type = ctx.session.data.investment.type;
  if(type == "stocks"){
    return ctx.scene.enter("buy-more-stocks-investment-wizard");
  }else if(type == "crypto"){
  ctx.scene.enter("buy-more-crypto-investment-wizard");
  }else{
    ctx.scene.enter("buy-more-savings-investment-wizard");
  }
});

viewInvestmentsWizard.action('sell', async (ctx) => {
  const investment = ctx.session.data.investment;
  console.log(investment)
  console.log(ctx.session.data.portfolio)
  if (investment.type == "savings") {
    return ctx.scene.enter('sell-savings-investment-wizard');
  }
  else if (investment.type == "stocks") {
  return ctx.scene.enter('sell-investment-wizard');
  }else{
    return ctx.scene.enter('sell-investment-wizard');
  }
});

viewInvestmentsWizard.action('back', async (ctx) => {
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


viewInvestmentsWizard.command("cancel", (ctx)=>ctx.scene.leave());
module.exports = { viewInvestmentsWizard };