import axios from 'axios'

const getProductById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const { data: productList } = await axios.get('https://my-json-bucket.s3-eu-west-1.amazonaws.com/productList.json');
    const product = productList.find(product => product.id === productId);

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
