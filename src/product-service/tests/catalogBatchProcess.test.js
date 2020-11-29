/**
 * @jest-environment node
 */

import catalogBatchProcess from '../handlers/catalogBatchProcess';
import AWSMock from 'aws-sdk-mock';

const validProduct = {
  count: 1,
  description: "Test description",
  price: 10,
  title: "Test title"
}
const invalidProduct = { ...validProduct, price: 'string' }

AWSMock.mock('SNS', 'publish', 'message has been published to SNS')

jest.mock('../models/product', () => ({
  createProduct: product => ({ ...product, id: 'test-id-12345' })
}))

describe('catalogBatchProcess', () => {

  it('should console.log error when product is not valid', async () => {

    const consoleLogSpy = jest.spyOn(console, "log")
    await catalogBatchProcess(
      { Records: [{ body: JSON.stringify(invalidProduct) }] },
      { awsRequestId: 'test-id-12345' }
    )
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Invalid product, not created: ',
      {"count": 1, "description": "Test description", "image": "https://images.unsplash.com/photo-1604695324248-d8f54a5ae30e?w=400", "price": "string", "title": "Test title"}
    )
  })

  it("should console.log success message when product is valid", async () => {

    const consoleLogSpy = jest.spyOn(console, "log")
    await catalogBatchProcess(
      { Records: [{ body: JSON.stringify(validProduct) }] },
      { awsRequestId: 'test-id-12345' }
    )

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Product created: ',
      {"count": 1, "description": "Test description", "image": "https://images.unsplash.com/photo-1604695324248-d8f54a5ae30e?w=400", "price": 10, "title": "Test title"}
    )
  })

})
