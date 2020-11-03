/**
 * @jest-environment node
 */

import getProductById from '../handlers/getProductById';

const mockData = {
  "id": "909af13e-cfa5-4025-9daf-402697dd7bb9",
  "count": 1,
  "description": "Myrtaceae",
  "price": 83,
  "title": "Oryx gazella callotis",
  "image": "https://images.unsplash.com/photo-1572096440536-480da44a35de?w=400"
}

describe('getProductsById', () => {
  it('should return correct product', async () => {
    const response = await getProductById({
      pathParameters: { productId: '909af13e-cfa5-4025-9daf-402697dd7bb9' }
    })
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockData),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  })
})
