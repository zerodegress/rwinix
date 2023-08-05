import { describe, test } from '@jest/globals'
import { parse } from '../src/rwini'

describe('parse ini correctly', () => {
  test('simple ini', () => {
    parse('[name]\nabc:def')
  })
})
