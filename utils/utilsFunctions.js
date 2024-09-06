const { getSavingsPrice } = require('../getStocks');

function mergeInvestments(investment1, investment2) {

  // Calculate the total cost of each investment
  const totalCost1 = investment1.quantity * investment1.price;
  const totalCost2 = investment2.quantity * investment2.price;
  // Calculate the total quantity
  const totalQuantity = investment1.quantity + investment2.quantity;
  // Calculate the weighted average price
  const weightedAveragePrice = (totalCost1 + totalCost2) / totalQuantity;
  // Create a new investment object with the merged data
  const mergedInvestment = {
    ...investment1,
    quantity: totalQuantity,
    price: weightedAveragePrice, // New average price per unit
    // Include other fields as needed
  };

  return mergedInvestment;
}

async function mergeSavings(investment1, investment2) {
  // Check if both investments have the same rate
  if (investment1.rate !== investment2.rate) {
    throw new Error('Both investments must have the same rate for this merge operation');
  }


  // Calculate the combined accumulated value using the common rate
  const totalValue1 = await getSavingsPrice(investment1);
  console.log(totalValue1)
  const totalValue2 = await getSavingsPrice(investment2);
  console.log(totalValue2)
  const combinedValue = totalValue1 + totalValue2;
  console.log(combinedValue)

  // Create a new merged investment object
  const mergedInvestment = {
    ...investment1,
    amount: combinedValue,
    date: new Date() // Set the current date as the new date
  };
  console.log(mergedInvestment)

  return mergedInvestment;
}


module.exports = { mergeInvestments, mergeSavings };