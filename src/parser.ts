export interface Position {
  line: number
  column: number
  offset: number
}

export interface Range {
  start: Position
  end: Position
}

export interface ASTNode<NodeType extends string = string> {
  nodeType: NodeType
  location: Range
}

export interface Parser<
  NodeType extends string,
  Root extends ASTNode<NodeType> = ASTNode<NodeType>,
  Options extends object = Record<string, never>
> {
  (input: string, options?: Options): Root
}
