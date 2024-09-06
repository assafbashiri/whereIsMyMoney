const { Telegraf,Scenes, session } = require('telegraf')
const { message } = require('telegraf/filters')
const {getPrice} = require('../getStocks');
// Function to generate the keyboard
const generateKeyboard = (list, name) => {
  if (!list.length) {
    return {
      inline_keyboard: [[{ text: `No ${name} found`, callback_data: 'none' }]]
    };
  }
  return {

    inline_keyboard: list.map(portfolio => 
        [{ text: portfolio.name, callback_data: portfolio._id.toString() }]
    )
  };
};

// function getSym(currency){

// switch (currency) {
//     case "USD":
//         console.log("United States Dollar");
//         break;
//     case "ILS":
//         console.log("Israeli New Shekel");
//         break;
//     case "EUR":
//         console.log("Euro");
//         break;
//     default:
//         console.log("Currency not recognized");
// }
// }

const generateInvestmentKeyboard = async (list, name) => {
  if (!list.length) {
    return {
      inline_keyboard: [[{ text: `No ${name} found`, callback_data: 'none' }]]
    };
  }
  let total_usd = 0;
  let total_ils = 0;
  let total_eur = 0;
  let inline_keyboard = [];

for (const investment of list) {
    if (investment.type == "stocks") {
        const price = await getPrice(investment);
        if (!isNaN(price)) {
            if (investment.currency == "USD") {
                total_usd += price * investment.quantity;
            } else if (investment.currency == "ILS") {
                total_ils += price * investment.quantity;
            } else if (investment.currency == "EUR") {
                total_eur += price * investment.quantity;
            }
        }
        const text1 = `${investment.ticker} ${investment.quantity} = ${price * investment.quantity} ${investment.currency}`;
        inline_keyboard.push([{ text: text1, callback_data: investment._id.toString() }]);
    } else if (investment.type == "crypto") {
        const price = await getPrice(investment);
        if (!isNaN(price)) {
            if (investment.currency == "USD") {
                total_usd += price * investment.quantity;
            } else if (investment.currency == "ILS") {
                total_ils += price * investment.quantity;
            } else if (investment.currency == "EUR") {
                total_eur += price * investment.quantity;
            }
        }
        const text1 = `${investment.symbol} ${investment.quantity} = $${price * investment.quantity}  ${investment.currency}`;
        inline_keyboard.push([{ text: text1, callback_data: investment._id.toString() }]);
    } else if (investment.type == "savings") {
        const amount = await getPrice(investment);
        if (!isNaN(amount)) {
            if (investment.currency == "USD") {
                total_usd += investment.amount;
            } else if (investment.currency == "ILS") {
                total_ils += investment.amount;
            } else if (investment.currency == "EUR") {
                total_eur += investment.amount;
            }
        }
        const text1 = `${investment.name}: ${amount.toFixed(2)} ${investment.currency}`;
        inline_keyboard.push([{ text: text1, callback_data: investment._id.toString() }]);
    }
}
  inline_keyboard.push([{ text: `TOTAL USD: ${total_usd.toFixed(2)}`, callback_data: 'total' }]);
  inline_keyboard.push([{ text: `TOTAL ILS: ${total_ils.toFixed(2)}`, callback_data: 'total' }]);
  inline_keyboard.push([{ text: `TOTAL EUR: ${total_eur.toFixed(2)}`, callback_data: 'total' }]);

  return { inline_keyboard };
};

module.exports = { generateKeyboard, generateInvestmentKeyboard };