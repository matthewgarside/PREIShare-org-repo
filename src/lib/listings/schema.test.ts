import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createListingSchema,
  updateListingSchema,
} from './schema'

const validListing = {
  title: '  Cedar Grove Home  ',
  summary: '  Renovation opportunity  ',
  property_type: 'single_family',
  address_line1: '  12 Cedar Grove Lane  ',
  city: '  Austin  ',
  region: ' TX ',
  postal_code: ' 78704 ',
  country: ' USA ',
  asking_price: 485000,
  currency: ' USD ',
  status: 'draft',
}

describe('listing schemas', () => {
  it('accepts a valid listing and trims text fields', () => {
    const result = createListingSchema.safeParse(validListing)

    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.title, 'Cedar Grove Home')
      assert.equal(result.data.address_line1, '12 Cedar Grove Lane')
      assert.equal(result.data.asking_price, 485000)
    }
  })

  it('rejects a listing with a negative asking price', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      asking_price: -1,
    })

    assert.equal(result.success, false)
  })

  it('rejects an update that contains only the listing id', () => {
    const result = updateListingSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
    })

    assert.equal(result.success, false)
  })
})
