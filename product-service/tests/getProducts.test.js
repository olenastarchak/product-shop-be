/**
 * @jest-environment node
 */

import getProducts from '../handlers/getProducts.js';
import productList from '../productList.json';

describe('getProducts', () => {
  it('should return an array of products', async () => {
    const response = await getProducts();
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify(productList),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  });
})