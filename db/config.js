const { MONGO_DB_CONNECTION_URL, MONGO_DB_NAME, AUTH_MONGO_DB_NAME } = require('../utilities/constants');

let mongo_config = {
   // database_url: MONGO_DB_CONNECTION_URL || 'mongodb://localhost:27017/frysto',
    database_url:"mongodb+srv://frysto:frysto@cluster0.sexsl.mongodb.net/frysto?retryWrites=true&w=majority",
    database: MONGO_DB_NAME || 'frysto',
    options: {
        poolSize: 25,
        authSource: AUTH_MONGO_DB_NAME,
        connectTimeoutMS: 3000
    },
    collections: {
        users: "users",
        user_counters: "user_counters",
        merchant_counters: "merchant_counters",
        users_role: "user_role_master",
        address: "address",
        merchant: "merchant",
        delivery_boy: "delivery_boy",
        category_type: "category_type",
        master_list: "master_list",
        product_list:"product_list",
        merchant_user:"merchant_user",
        merchant_data_detail:"merchant_data_detail",
        order_list:"order_list",
        return_order_list:"return_order_list",
        master_product_list:"master_product_list"

    }
}

module.exports = { mongo_config }
