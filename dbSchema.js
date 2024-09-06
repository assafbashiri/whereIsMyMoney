const stockSchema = new mongoose.Schema({
  investmentId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  investmentType: { type: String, default: 'stock' },
  investmentDate: { type: Date, required: true },
  currency: { type: String, required: true },
  stockSymbol: { type: String, required: true },
  numberOfShares: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  dividendPayments: { type: Number, default: 0 }
});

const StockInvestment = mongoose.model('StockInvestment', stockSchema);

const cryptoSchema = new mongoose.Schema({
  investmentId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  investmentType: { type: String, default: 'crypto' },
  investmentDate: { type: Date, required: true },
  currency: { type: String, required: true },
  cryptoSymbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true }
});

const CryptoInvestment = mongoose.model('CryptoInvestment', cryptoSchema);


const savingsSchema = new mongoose.Schema({
  investmentId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  investmentType: { type: String, default: 'savings' },
  investmentDate: { type: Date, required: true },
  currency: { type: String, required: true },
  bankName: { type: String, required: true },
  interestRate: { type: Number, required: true },
  interestCompoundingFrequency: { type: String, enum: ['daily', 'monthly', 'annually'], required: true },
  initialAmount: { type: Number, required: true }
});

const SavingsInvestment = mongoose.model('SavingsInvestment', savingsSchema);
