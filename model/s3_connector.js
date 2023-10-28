// 常用套件
require("dotenv").config();
// 三方套件
const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
});


function sendToS3(file_id, file){
    const s3 = new AWS.S3(); // 必須要在 config update 之後才建立

    console.log("file: ", file)
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file_id,
        Body: file,
        ContentType: 'image/jpeg',
    }
    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                reject('上傳失敗:', err);
            } else {
                resolve('上傳成功，S3 物件 URL:', data.Location);
            }
        });
    })
}

module.exports.sendToS3 = sendToS3;