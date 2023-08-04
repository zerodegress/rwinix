import { Source } from './source'
import { ASTNode } from './parser'

export interface Transformer<
  Input = ASTNode,
  Output = ASTNode,
  SourceContent = string,
> {
  (input: Input, source: Source<SourceContent>): Output
}

export interface Plugin<
  Options extends object = Record<string, never>,
  Input = ASTNode,
  Output = ASTNode,
  SourceContent = string,
> {
  (options?: Options): Transformer<Input, Output, SourceContent>
}
