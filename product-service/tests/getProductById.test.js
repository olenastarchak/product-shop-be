/**
 * @jest-environment node
 */

import getProductById from '../handlers/getProductById';

describe('getProductsById', () => {
  it('should return object of product', async () => {
    const response = await getProductById({
      pathParameters: { productId: '909af13e-cfa5-4025-9daf-402697dd7bb9' }
    })
    const product = JSON.parse(response.body)
    expect(product).toBeDefined()
    expect(product.title).toBeTruthy()
  })
})
