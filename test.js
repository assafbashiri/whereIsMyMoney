const i18next = require('i18next');
const en = require('./locales/en.json');
const he = require('./locales/he.json');
// delete require.cache[require.resolve('./locales/en.json')];
// delete require.cache[require.resolve('./locales/he.json')];
i18next.init({
  debug: true,
  lng: 'he', // default language
  fallbackLng: 'en',
  resources: {
    en: {
      welcome:"abc"
    },
    he: {
      welcome:"שלום"
    }
  },
  interpolation: {
    escapeValue: false // not needed for node.js
  }
}, (err, t) => {
  if (err) return console.error('Initialization error:', err);
  console.log('Current language:', i18next.language);
  console.log('Translation keys:', Object.keys(en));
  console.log('Welcome message:', t('welcome')); // Should print translation for 'welcome'
});

// Change language and test
i18next.changeLanguage('he', (err, t) => {
  if (err) return console.error('Change language error:', err);
  console.log('Language after change:', i18next.language);
  console.log('Welcome message in Hebrew:', t('welcome')); // Should print Hebrew translation
});
