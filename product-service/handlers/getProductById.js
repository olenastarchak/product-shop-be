import { getProduct } from "../models/product";

const getProductById = async (e) => {
  try {
    console.log('Lambda function has been invoked with event: ', e);
    const productId = e.pathParameters.productId;
    console.log('productId: ', productId);
    const product = await getProduct(productId);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: product ? 200 : 404,
      body: product ? JSON.stringify(product) : 'Product not found',
    };
  } catch (error) {
    console.error('Error during database request executing:', error);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

export default getProductById;
