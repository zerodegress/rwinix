import { parse as parseRwini} from './peggy/rwiniParser'
import { ASTNode, Parser } from './parser'
import { Plugin } from './plugin'

export type RwiniASTNodeType =
  | 'rwini'
  | 'comment_block'
  | 'comment_line'
  | 'section'
  | 'section_item'
  | 'attribute'

export type RwiniASTNode<Type extends RwiniASTNodeType = RwiniASTNodeType> = ASTNode<Type>

export interface RwiniSource extends RwiniASTNode<'rwini'> {
  blocks: (CommentBlock | CommentLine | Section)[]
}

export interface CommentBlock extends RwiniASTNode<'comment_block'> {
  content: string
}

export interface CommentLine extends RwiniASTNode<'comment_line'> {
  content: string
}

export interface Section extends RwiniASTNode<'section'> {
  head: string
  body: SectionItem
  comment?: CommentLine
}

export interface SectionItem extends RwiniASTNode<'section_item'> {
  attr?: Attribute
  comment?: CommentLine
}

export interface Attribute extends RwiniASTNode<'attribute'> {
  key: string
  value: string
}

export interface AttributeStandard extends RwiniASTNode<'attribute'> {
  key: string
  value: string
}

export type RwiniParserOptions = {
  // TODO
}

export type RwiniParser = Parser<RwiniASTNodeType, RwiniSource, RwiniParserOptions>

export const parse: RwiniParser = parseRwini

export type CorePluginOptions = {
  disableCore: boolean
  peggy: RwiniParserOptions
}

export const core: Plugin<CorePluginOptions, undefined, RwiniSource, string> = options => {
  return (input, source) => {
    if(options?.disableCore) {
      return {
        nodeType: 'rwini',
        blocks: [] as (CommentBlock | CommentLine | Section)[]
      } as RwiniSource
    }
    return parse(source.content, options?.peggy)
  }
}
