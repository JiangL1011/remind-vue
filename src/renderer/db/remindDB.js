const DataStore = require('nedb')
const envPath = require('../../config/environment')
const path = require('path')

module.exports = new DataStore({
  filename: path.join(envPath, 'src/renderer/db/data/appData'),
  autoload: true
})
