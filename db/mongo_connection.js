const MongoClient = require( 'mongodb' ).MongoClient;
const config = require('./config').mongo_config;

let _db;

module.exports = {
  connectToServer: async () => {
    try {
      _db = await MongoClient.connect(config.database_url,{ useNewUrlParser: true,
        useUnifiedTopology: true}, config.options);
    } catch (error) {
      throw error;
    }
  },
  getDb: function() {
    return _db;
  }
};




