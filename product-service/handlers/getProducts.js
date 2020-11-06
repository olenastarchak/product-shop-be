import axios from 'axios'

const getProducts = async () => {
  try {
    const { data: productList } = await axios.get('https://my-json-bucket.s3-eu-west-1.amazonaws.com/productList.json');

    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200,
      body: JSON.stringify(productList)
    }
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
