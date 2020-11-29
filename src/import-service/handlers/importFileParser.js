const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { S3_BUCKET, SQS_URL } = process.env;

const importFileParser = async (e) => {
  console.log('Lambda function has been invoked with event: ', e);

  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const streams = [];
    const sqs = new AWS.SQS()

    for (const record of e.Records) {
      const { key } = record.s3.object;
      const stream = new Promise((resolve, reject) => {
        const s3Stream = s3.getObject({
          Bucket: S3_BUCKET,
          Key: key,
        }).createReadStream();
        console.log(`Parsing file ${key}`)

        s3Stream.pipe(csv())
          .on('data', data => {
            console.log('CSV data:', data)
            if (data.price) data.price = Number(data.price)
            if (data.count) data.count = Number(data.count)
            sqs.sendMessage({
              QueueUrl: SQS_URL,
              MessageGroupId: key,
              MessageBody: JSON.stringify(data)
            }, (err, res) => {
              console.log('SQS message payload: ', data)
              if (err) {
                console.log('Error ocurred during sending: ', err)
              } else {
                console.log('Message has been sent, SQS response: ', res)
              }
            })
          })
          .on('error', error => {
            console.log('Error:', error);
            reject(error);
          })
          .on('end', async () => {
            console.log(`Moving from ${S3_BUCKET}/${key}`);
            const newKey = key.replace('uploaded', 'parsed');
            await s3.copyObject({
              Bucket: S3_BUCKET,
              CopySource: `${S3_BUCKET}/${key}`,
              Key: newKey,
            }).promise();
            await s3.deleteObject({
              Bucket: S3_BUCKET,
              Key: key,
            }).promise();
            console.log(`Moved to ${S3_BUCKET}/${newKey}`);
            resolve(`${S3_BUCKET}/${newKey}`);
          });
      });
      streams.push(stream);
    }

    const results = await Promise.allSettled(streams);
    console.log('function finished, results:', results);
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.log('function failed, error:', error);
    return {
      statusCode: 500,
      body: error,
    };
  }
};

module.exports = importFileParser;
