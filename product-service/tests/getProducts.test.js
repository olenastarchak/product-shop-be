/**
 * @jest-environment node
 */

import getProducts from '../handlers/getProducts.js';

describe('getProducts', () => {
  it('should return an array of products', async () => {
    const response = await getProducts()
    const productsList = JSON.parse(response.body)
    expect(productsList).toBeDefined()
    expect(Array.isArray(productsList)).toBe(true)
  })
})
