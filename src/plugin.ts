import { Source } from './source'
import { ASTNode, Parser } from './parser'

export interface Transformer<
  Input extends (ASTNode | unknown) = ASTNode, 
  Output extends (ASTNode | unknown) = ASTNode,
  SourceContent extends unknown = string,
> {
  (tree: Input, source: Source<SourceContent>): Output
}

export interface Plugin<
  Options extends object = {}, 
  Input extends (ASTNode | unknown) = ASTNode, 
  Output extends (ASTNode | unknown) = ASTNode,
  SourceContent extends unknown = string,
> {
  (options?: Options): Transformer<Input, Output, SourceContent>
}