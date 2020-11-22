const AWS = require('aws-sdk');
const s3bucket = process.env.S3_BUCKET;

const importProductsFile = async (e) => {
  console.log('Lambda function has been invoked with event: ', e);
  const file = e.queryStringParameters.name;
  const path = `uploaded/${file}`;
  const s3 = new AWS.S3({
    region: 'eu-west-1',
    signatureVersion: 'v4',
  });
  const params = {
    Bucket: s3bucket,
    Key: path,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: url,
    };
  } catch (e) {
    console.log('Can`t get signed url', e);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e,
    };
  }
};

module.exports = importProductsFile;
