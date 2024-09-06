const { Telegraf,Scenes } = require('telegraf')
const { createPortfolio } = require('../db'); // Import the function from db.js

const createPortfolioWizard = new Scenes.WizardScene(
  'create-portfolio-wizard',
(ctx) => {
  ctx.reply('Please provide the portfolio name.');
  return ctx.wizard.next();
},
(ctx) => {
  var portfolioName = ctx.message.text;
  ctx.wizard.state.contactData = {name: portfolioName};
  ctx.reply('Please provide the portfolio description.');
return ctx.wizard.next();
},
async (ctx) => {
  var description = ctx.message.text;
  ctx.wizard.state.contactData = {...ctx.wizard.state.contactData, description};
  const portfolio = {
    user_id: ctx.from.id,
    name: ctx.wizard.state.contactData.name,
    description: ctx.wizard.state.contactData.description,
    investments: []
  }
  createPortfolio(ctx.from.id, ctx.wizard.state.contactData.name, ctx.wizard.state.contactData.description);
  await ctx.reply('Portfolio created successfully');
  return ctx.scene.leave();
}
);

createPortfolioWizard.command("cancel", (ctx)=>ctx.scene.leave());

// Create the stage and register the wizard
// const stage = new Scenes.Stage([createPortfolioWizard]);

module.exports = { createPortfolioWizard };