const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SMTP_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sender = {
    "name":"Luyện thi GPLX",
    "email":"noreply@luyenthiUIT.com"
}

const sendEmailVerifyCode = (email, name, subject, code, callbackData, callbackError) =>{
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    let receivers = [{
        "email":email,
        "name":name
    }];

    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = receivers;

    sendSmtpEmail.params = {
        "code":code,
        "subject":subject
    };

    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent = "<html><body><h1>Your verification code is <h1 style=\"color:Tomato;\">{{params.code}}</h1></h1></body></html>";
    
    //sendSmtpEmail.headers = {"ThunderStudio":"Making game is playing game"};
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        callbackData(data);
    }, function(error) {
        callbackError(error);
    });
}

module.exports = {
    apiInstance,
    sendEmailVerifyCode
}