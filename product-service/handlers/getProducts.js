import { getProductList } from "../models/product";

const getProducts = async (e) => {
  try {
    console.log('Lambda function has been invoked with event: ', e);
    const productList = await getProductList();

    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(productList)
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

export default getProducts;
