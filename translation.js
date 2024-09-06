const i18next = require('i18next');
const he = require('./utils/locales/he.js');
const en = require('./utils/locales/en.js');

i18next.init({
  lng: 'he',
  resources: {
    en,
    he
  }
});
module.exports = { i18next };