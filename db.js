const { MongoClient, ObjectId } = require('mongodb');
// const { v4: uuidv4 } = require('uuid');

// Connection URL
const username = encodeURIComponent("assaf");
const password = encodeURIComponent("assafBASHIRI458");
const cluster = "cluster0.mongodb.net";
const authSource = "admin";
const authMechanism = "SCRAM-SHA-256";
// let uri =
  // `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
const url = `mongodb+srv://assaf:assafbashiri458@cluster.tordbeb.mongodb.net/`;
const client = new MongoClient(url);
client.connect();
// Database Name
const dbName = 'bot';

async function addInvestmentToPortfolio(portfolioId, investment) {
  try {
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');
    investment._id = new ObjectId();
    const result = await portfolios.updateOne(
      { _id: new ObjectId(portfolioId) },
      {
        $push: { investments: investment }
      }
    );

    console.log('Investment added successfully:', result);
    return result;
  } catch (error) {
    console.log(error)
  }
}

async function sellStocksInvestmentFromPortfolio(portfolioId, investment) {
  try {
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

    // Find the portfolio containing the investment
    const portfolio = await portfolios.findOne({
      _id: new ObjectId(portfolioId)
    });
    console.log(portfolioId)
    if (!portfolio) {
      throw new Error('Portfolio or investment not found');
    }

    // Find the specific investment in the portfolio's investments array
    const existingInvestment = portfolio.investments.find(
      inv => inv._id.equals(investment._id)
    );
    if (!existingInvestment) {
      throw new Error('Investment not found in portfolio');
    }
    if (parseInt(existingInvestment.quantity) < parseInt(investment.quantity)) {
      throw new Error('Not enough quantity to sell');
    }
    const currentPrice = investment.price;
    const purchasePrice = existingInvestment.price; // Assuming you have stored the purchase price
    const profitOrLossPerUnit = currentPrice - purchasePrice;
    const totalProfitOrLoss = profitOrLossPerUnit * investment.quantity;

    console.log(`Profit/Loss for selling ${investment.quantity} units: $${totalProfitOrLoss}`);

    // Update the portfolio by removing or reducing the investment quantity
    if (existingInvestment.quantity === investment.quantity) {
      // Remove the investment if all quantity is sold
      const result = await portfolios.updateOne(
        { _id: new ObjectId(portfolioId) },
        { $pull: { investments: { _id: new ObjectId(investment._id) } } }
      );
      console.log('Investment fully sold and removed:', result);
    } else {
      // Update the quantity if only part of the investment is sold
      const result = await portfolios.updateOne(
        { _id: new ObjectId(portfolioId), "investments._id": new ObjectId(investment._id) },
        { $inc: { "investments.$.quantity": -investment.quantity } }
      );
      console.log('Investment partially sold:', result);
    }

    return totalProfitOrLoss;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function sellSavingsInvestmentFromPortfolio(portfolioId, investment) {
  try {
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

    // Find the portfolio containing the investment
    const portfolio = await portfolios.findOne({
      _id: new ObjectId(portfolioId)
    });
    console.log(portfolioId)
    if (!portfolio) {
      throw new Error('Portfolio or investment not found');
    }

    // Find the specific investment in the portfolio's investments array
    const existingInvestment = portfolio.investments.find(
      inv => inv._id.equals(investment._id)
    );
    if (!existingInvestment) {
      throw new Error('Investment not found in portfolio');
    }
    if (existingInvestment.amount < parseInt(investment.amount)) {
      throw new Error('Not enough quantity to sell');
    }

    // Update the portfolio by removing or reducing the investment quantity
    if (existingInvestment.amount === investment.amount) {
      // Remove the investment if all quantity is sold
      const result = await portfolios.updateOne(
        { _id: new ObjectId(portfolioId) },
        { $pull: { investments: { _id: new ObjectId(investment._id) } } }
      );
      console.log('Investment fully sold and removed:', result);
    } else {
      // Update the quantity if only part of the investment is sold
      const result = await portfolios.updateOne(
        { _id: new ObjectId(portfolioId), "investments._id": new ObjectId(investment._id) },
        { $inc: { "investments.$.amount": -investment.amount } }
      );
      console.log('Investment partially sold:', result);
    }

    return 0;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllInvestmentsFromPortfolio(userId, portfolioId) {
  try {
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

    // Fetch the specific portfolio
    const portfolio = await portfolios.findOne(
      { _id:new  ObjectId(portfolioId), user_id: userId },
      { projection: { investments: 1 } }
    );

    if (!portfolio) {
      console.log('Portfolio not found');
      return [];
    }

    // Return all investments in the portfolio
    console.log('Investments retrieved successfully:', portfolio.investments);
    console.log(portfolio);
    return portfolio.investments;
  } catch (error) {
    console.error('Error retrieving investments:', error);
    return [];
  }
}

async function getAllPortfolios(userId) {
  try {
    const db = client.db(dbName);
    const portfoliosDB = db.collection('portfolios');

    // Fetch all portfolios for the specific user
    const portfolios = await portfoliosDB.find({ user_id: userId }).toArray();

    if (portfolios.length === 0) {
      console.log('No portfolios found');
      return [];
    }

    // Return all portfolios
    return portfolios;
  } catch (error) {
    console.error('Error retrieving portfolios:', error);
    return [];
  }
}

async function getInvestmentFromPortfolio(userId, portfolioId, investmentId) {
  try {
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');
  
    // Fetch the specific portfolio
    const portfolio = await portfolios.findOne(
      { _id: new ObjectId(portfolioId), user_id: userId },
      { projection: { investments: 1 } }
    );

    if (!portfolio) {
      console.log('Portfolio not found');
      return null;
    }

    // Find the specific investment within the portfolio
    const investment = portfolio.investments.find(inv => inv._id.toString() === investmentId);

    if (!investment) {
      console.log('Investment not found');
      return null;
    }

    console.log('Investment retrieved successfully:', investment);
    return investment;
  } catch (error) {
    console.error('Error retrieving investment:', error);
    return null;
  }
}

async function createPortfolio(userId, portfolioName, description) {
  try {
    // await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

    const result = await portfolios.insertOne({
      user_id: userId,
      name: portfolioName,
      description: description,
      investments: []
    });

    console.log('Portfolio created successfully:', result);
  } finally {
    // await client.close();
  }
}


async function getPortfolios(userId) {
  try{
    await client.connect();
    console.log('get portfolios§');
    console.log(userId)
    const database = client.db(dbName); // Replace with your database name
    const portfolios = database.collection('portfolios');
    const resp =  await portfolios.find({user_id:userId}).toArray(); // Fetch all portfolios
    console.log('portfolios:', resp );
    return resp;

  }catch(err){
    console.log(err);
  }
  finally {
    // await client.close();
  }
}


async function addUser(userId) {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const users = db.collection('users');
    const existingUser = await users.findOne({ user_id:userId });
    if (existingUser) {
      console.log('Username or email already exists');
      return;
    }
    const result = await users.insertOne({
      user_id: userId,
    });
    return userId;
    console.log('user added successfully:', userId);
  }catch(err){
    console.log("err");
    console.log(err);
  } finally {
    // await client.close();
  }
}

async function deleteInvestment(userId, portfolioId, investmentId) {
  try {
    // Connect to the database
    const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

    // Update the portfolio by removing the specified investment
    const result = await portfolios.updateOne(
      { user_id: userId, _id: new ObjectId(portfolioId) },
      { $pull: { investments: { _id: new ObjectId(investmentId) } } }
    );

    if (result.modifiedCount === 0) {
      console.log('No investment found with the given criteria.');
    } else {
      console.log('Investment deleted successfully.');
    }

    return result;
  } catch (error) {
    console.error('Error deleting investment:', error);
    throw error;
  }
}

async function deletePortfolio(portfolioId) {
  try {
    const database = client.db('bot');
    const portfolios = database.collection('portfolios');

    // Delete the portfolio by ID
    const result = await portfolios.deleteOne({ _id: portfolioId });

    if (result.deletedCount === 1) {
      console.log(`Successfully deleted portfolio with ID: ${portfolioId}`);
      return true;
    } else {
      console.log(`No portfolio found with ID: ${portfolioId}`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return false;
  } finally {
  }
}

async function updateInvestment(userId, portfolioId, investment) {
  const db = client.db(dbName);
    const portfolios = db.collection('portfolios');

  const {...updateFields } = investment;
  // Ensure there are fields to update
  if (Object.keys(updateFields).length === 0) {
    throw new Error('No fields to update');
  }

  // Construct the update object
  const updateObject = {
    $set: {
      'investments.$[elem]': updateFields
    }
  };

  // Perform the update operation
  const result = await portfolios.updateOne(
    { _id: new  ObjectId(portfolioId)},
      updateObject,
      {
        arrayFilters: [{ 'elem._id':new  ObjectId(investment._id) }], new: true, runValidators: true }
  );

  if (result.nModified === 0) {
    throw new Error('No investment found or no update occurred');
  }
  return result;
}

module.exports = { addUser, addInvestmentToPortfolio, getAllInvestmentsFromPortfolio, 
  sellStocksInvestmentFromPortfolio, getInvestmentFromPortfolio, createPortfolio, 
  getPortfolios, getAllPortfolios, sellSavingsInvestmentFromPortfolio, deleteInvestment, 
  updateInvestment, deletePortfolio };