import { describe, expect, test } from '@jest/globals'
import { parse } from '../src/rwini'
import rwini from '../src'
import { Position } from '../src/parser'

describe('object "rwini" works', () => {
  test('simple test', () => {
    expect(rwini().process({
      filename: undefined,
      fullpath: undefined,
      content: '[abc]',
      length: 5,
      locate: function (offset: number): Position {
        throw new Error('Function not implemented.')
      }
    })).toEqual({
      nodeType: 'rwini',
      blocks: [
        {
          nodeType: 'section',
          body: [],
          head: 'abc',
          location: {
            end: {
              column: 6,
              line: 1,
              offset: 5,
            },
            start: {
              column: 1,
              line: 1,
              offset: 0,
            }
          }
        }
      ]
    })
  })
})