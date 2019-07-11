const DataStore = require('nedb')
const envPath = require('../../config/environment')

module.exports = new DataStore({
  filename: envPath.dbPath,
  autoload: true
})
