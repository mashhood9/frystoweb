'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
// models to other modules
const http = require('http');
let express = require('express'),
  bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


let routes = require('./routes/index');
global.appRootDirectory = __dirname;
// CORS
const cors = require('cors');
const mongoUtil = require('./db/mongo_connection');
mongoUtil.connectToServer().then(async () => {
  global.CustomError = require('./utilities/custom_error');
  try {
    //Initializing the server...
    let app = express();
    app.use(cors());

    //rest API requirements
    app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
    app.use(express.json({ limit: '20mb' }));
    app.use(bodyParser.json());
    app.use(fileUpload({}));
    var options = {
      explorer: true
    };
    
    app.use('/api/v1', routes);
    
    var httpServer = http.createServer(app);
    httpServer.listen(process.env.PORT || 3000, () => {
      console.log("Server started running on you: ", process.env.PORT);
    });

    process.on('uncaughtException', (err) => {
      console.log(err);
    });
    module.exports = app;

  } catch (error) {
    throw error;
  }
}, err => {
 throw err;
}).catch(err => {
  throw err;
});

