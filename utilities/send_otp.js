require('dotenv').config();
const AWS = require('aws-sdk')

class SendOTP {
    async sendOtp(number, text) {
        var params = {
            Message: text,
            PhoneNumber: '+' + number,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'Frysto OTP'
                }
            }
        };
    
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    
        publishTextPromise.then(
            function (data) {
                return JSON.stringify({ MessageID: data.MessageId });
            }).catch(
                function (err) {
                    return JSON.stringify({ Error: err });
                });
    }
}

module.exports = SendOTP;