import { describe, expect, test } from '@jest/globals'
import rwini, { expr } from '../src'
import { createSource } from '../src/source'

describe('object "rwini" works', () => {
  test('simple test', () => {
    expect(rwini().process(createSource('[abc]'))).toEqual({
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
    rwini({ disableCore: true })
      .use(expr)
      .process(createSource('parent.readUnitMemory("a",type="b")'))
  })
})
