const { Telegraf,Scenes, session } = require('telegraf')
const { message } = require('telegraf/filters')


const prtfolioMenu = (prtofolioId) =>
{inline_keyboard: [
    [{ text: 'VIEW', callback_data: 'portfolios' }],
    [{ text: 'ADD', callback_data: 'portfolios' }],
    [{ text: 'REMOVE', callback_data: 'portfolios' }],
    [{ text: 'DELETE', callback_data: 'portfolios' }]
  ]}
;

module.exports = { prtfolioMenu };
