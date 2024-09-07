Investment Tracker Telegram Bot

Overview

This Telegram bot helps you track and manage your investments across various categories, including stocks, cryptocurrencies, bonds, savings, and cash. With support for multiple currencies (Israeli Shekel, US Dollar, Euro), the bot allows users to manage their investments and portfolios effortlessly. You can easily insert investments, view your portfolios, and calculate the total value of all your assets at any time.

Features

Multiple Investment Types: Track investments in stocks, crypto, bonds, savings, and cash.
Portfolio Management: Organize your investments into multiple portfolios.
Multi-Currency Support: Enter investments in Israeli Shekel (ILS), US Dollar (USD), or Euro (EUR).
Total Asset Calculation: Get a breakdown of your assets and their total value at any time.
User-Friendly Commands: Use simple Telegram commands to interact with your portfolio.
Installation

Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/investment-tracker-bot.git
cd investment-tracker-bot
Install dependencies:
bash
Copy code
pip install -r requirements.txt
Create a .env file in the root directory and add your Telegram bot token:
bash
Copy code
BOT_TOKEN=your-telegram-bot-token
Run the bot:
bash
Copy code
python bot.py
Usage

Once the bot is running, use the following commands to manage your investments:

/start: Initialize the bot and start managing your portfolios.
/add_investment [portfolio_name] [investment_type] [amount] [currency]: Add a new investment to a portfolio.
/view_portfolio [portfolio_name]: View all investments in a specific portfolio.
/total: Get the total value of all your investments across all portfolios.
Example usage:

bash
Copy code
/add_investment "Retirement" "Stock" 5000 ILS
/view_portfolio "Retirement"
/total
Future Enhancements

Support for more currencies.
Automated market price updates for stocks and crypto.
Graphical reports of portfolio performance over time.
License

This project is licensed under the MIT License.
