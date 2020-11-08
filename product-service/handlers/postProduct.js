import { createProduct } from "../models/product";

const postProduct = async (e) => {
  console.log('Lambda function has been invoked with event: ', e);
  const product = JSON.parse(e.body);
  console.log('Product: ', product);
  const { title, description, price, image, count } = product;
  if (!image) {
    product.image = 'https://images.unsplash.com/photo-1604695324248-d8f54a5ae30e?w=400'
  }
  const isProductDataValid = typeof title === 'string'
      && typeof description === 'string'
      && typeof price === 'number'
      && typeof count === 'number';

  if (!isProductDataValid) return {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    statusCode: 400,
    body: 'Bad request'
  }

  try {
    const createdProduct = await createProduct(product);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify(createdProduct),
    };
  } catch (error) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export default postProduct;
