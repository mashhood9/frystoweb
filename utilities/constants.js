// Development
const MONGO_DB_NAME = 'frysto'
const MONGO_LOGGER_DB_NAME = 'app_log'
const MONGO_DB_CONNECTION_URL = ''
const AUTH_MONGO_DB_NAME = 'admin'

// Token Variables
const TOKEN_EXPIRY_TIME = '1h'

// Crpto Module - Encryption
const ENCRYPTION_TYPE = 'aes-128-cbc'
const ENCRYPTION_PASSWORD = 'tsIndia@123'


module.exports = {
    MONGO_DB_NAME,
    MONGO_LOGGER_DB_NAME,
    MONGO_DB_CONNECTION_URL,
    AUTH_MONGO_DB_NAME,
    TOKEN_EXPIRY_TIME,
    ENCRYPTION_TYPE,
    ENCRYPTION_PASSWORD
} 