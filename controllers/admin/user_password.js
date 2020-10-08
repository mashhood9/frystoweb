let mongoClient = require('../../db/mongo_connection');
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const ChangePasswordController = require('../../controllers/user/change_password_controller');
const ResetPasswordController = require('../auth/reset_pwd_controller');
const AdminUserController = require('./index');
const BaseModel = require('../../utilities/base_model');
const validatorSchema = require('../../models/credentials_schema');

class AdminUserStatusController extends BaseModel {
    constructor(payload) {
        super();
        this.payload = payload;
        this.db = mongoClient.getDb().db();
    }

    // Change Password By Admin
    async changePasswordByAdmin(user_obj) {
        try {
            let admin_controller = new AdminUserController();
            if (admin_controller.checkIfUserIsAdmin()) {
                let collection = await this.db.collection(collections.user);
                let result = await collection.findOne({ 
                    user_id: user_obj.id, 
                    is_deleted: false
                }, 
                {  projection: {
                        user_id: 1,
                        email: 1,
                        _id: 0
                    }
                });

                if (result) {
                    let updatePwd = new ChangePasswordController();
                    return await updatePwd.updatePassword(user_obj.id, user_obj.new_password);                                        
                }
                else {
                    throw new CustomError('No User Found', 404, 'changePasswordByAdmin');
                };
            }
            else {
                throw new CustomError('Invalid User Access', 400, 'changePasswordByAdmin');
            }
        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'changePasswordByAdmin');
        }
    }

    // Send Reset Password Link By Admin
    async resetPasswordByAdmin(user_id) {
        try {
            let admin_controller = new AdminUserController();

            if (admin_controller.checkIfUserIsAdmin()) {
                let collection = await this.db.collection(collections.user);
                let result = await collection.findOne({ 
                    user_id : user_id, 
                    is_deleted: false,
                    is_email_verified : true
                }, 
                {  projection: {
                        user_id: 1,
                        email: 1,
                        _id: 0
                    }
                });
                
                if (result) {
                    let resetPwd = new ResetPasswordController(this.payload);
                    let user_obj = this.validateModelSchema({email: result.email}, validatorSchema.forgot_password());
                    await resetPwd.generateResetPwdToken(user_obj);
                    return { message: 'Resent password link sent successfully' };                   
                }
                else {
                    throw new CustomError('No User Found', 404, 'resetPasswordByAdmin');
                };
            }
            else {
                throw new CustomError('Invalid User Access', 400, 'resetPasswordByAdmin');
            }

        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'resetPasswordByAdmin');
        }
    }
}

module.exports = AdminUserStatusController;

