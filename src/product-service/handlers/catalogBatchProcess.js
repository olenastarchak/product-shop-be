import AWS from 'aws-sdk';
import { createProduct } from '../models/product';
const { SNS_ARN } = process.env;

const catalogBatchProcess = async (event, context) => {

  console.log('catalogBatchProcess Lambda function has been invoked with event:', event);

  const sns = new AWS.SNS();
  const products = event.Records.map(i=>JSON.parse(i.body));
  const promises = [];
  for (const product of products) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const isImageReceived = !!product.image;
        if (!isImageReceived) {
          product.image = 'https://images.unsplash.com/photo-1604695324248-d8f54a5ae30e?w=400'
        }
        const {
          title,
          description,
          price,
          image,
          count
        } = product;

        // check that product data is valid
        if (typeof(title) !== 'string'
          || typeof(description) !== 'string'
          || typeof(price) !== 'number'
          || typeof(image) !== 'string'
          || !Number.isInteger(count)
          || count <= 0) {
          console.log('Invalid product, not created: ', product);
          reject();
          return
        }

        await createProduct(product);
        console.log('Product created: ', product);
        resolve();
      } catch (error) {
        console.log('Failed to create product: ', product);
        console.log('Error during DB query execution: ', error);
        reject();
      }
    })
    promises.push(promise);
  }
  const results = await Promise.allSettled(promises);
  const isImportFailed = results.some(i=>i.status === 'rejected');
  console.log('isImportFailed: ', isImportFailed);
  const messageArray = results.map((result, i) => ({
    ...result,
    ...products[i]
  }));
  const message = `Results of the products import:\r\n${messageArray.map(JSON.stringify).join('\r\n')}`;
  await new Promise((resolve, reject) => {
    sns.publish({
      Subject: `${isImportFailed ? 'Some product(s) has failed to import' : 'Successful products import'} | awsRequestId: ${context.awsRequestId}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        isImportFailed: {
          DataType: 'String',
          StringValue: `${isImportFailed}`
        }
      },
      Message: message
    }, (err, res) => {
      if (err) {
        console.log('Error during SNS message sending: ', err);
        reject(err);
      } else {
        console.log('SNS message has been sent, payload: ', messageArray);
        console.log('SNS response: ', res);
        resolve(res);
      }
    })
  })
  console.log('catalogBatchProcess Lambda function finished');
}

export default catalogBatchProcess;
