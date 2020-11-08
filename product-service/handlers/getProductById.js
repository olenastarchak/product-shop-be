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
    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export default getProductById;
