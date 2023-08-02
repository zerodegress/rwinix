import { Position } from "./parser"
import path from 'path-browserify'

export interface Source<Content extends unknown = string> {
  filename?: string
  fullpath?: string
  content: Content
  length: number
  locate(offset: number): Position
}

export function createSource<
  Content extends unknown = string
>(content: Content, options?: {
  fullpath?: string
  length?: number
  locate?(offset: number): Position
}): Source<Content> {
  return {
    filename: options?.fullpath && path.basename(options.fullpath),
    fullpath: options?.fullpath,
    content,
    length: options?.length 
      || (typeof content == 'string' && content.length) 
      || 0,
    locate: options?.locate 
      || (typeof content == 'string' && ((offset) => {
        const slice = content.slice(0, offset)
        const line = (slice.match(/\n/)?.length || 0) + 1
        const column = slice.length + 1
        return {
          line,
          column,
          offset,
        }
      }))
      || (() => ({
        line: 0,
        column: 0,
        offset: 0,
      }))
  }
}