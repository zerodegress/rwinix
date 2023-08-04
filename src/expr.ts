import { ASTNode, Parser } from './parser'
import { parse as parseExpr } from './peggy/exprParser'
import { Plugin } from './plugin'

export type ExprASTNodeType =
  | 'identifier'
  | 'literal_string'
  | 'literal_number'
  | 'literal_null'
  | 'literal_boolean'
  | 'func_call'
  | 'obj_member'
  | 'arr_index'
  | 'param'
  | 'expr_mod'
  | 'expr_div'
  | 'expr_mul'
  | 'expr_sub'
  | 'expr_add'
  | 'expr_lt'
  | 'expr_le'
  | 'expr_gt'
  | 'expr_ge'
  | 'expr_ne'
  | 'expr_eq'
  | 'expr_and'
  | 'expr_or'
  | 'expr_not'
  | 'expr_assign'
  | 'expr_add_assign'
  | 'expr_sub_assign'
  | 'expr_mul_assign'
  | 'expr_div_assign'

export interface ExprASTNode<NodeType extends ExprASTNodeType = ExprASTNodeType> extends ASTNode<NodeType> { }

export type Expr =
  | ExprAssign
  | ExprAddAssign
  | ExprSubAssign
  | ExprMulAssign
  | ExprDivAssign
  | ExprAdd
  | ExprSub
  | ExprMul
  | ExprDiv
  | ExprMod
  | ExprEq
  | ExprNe
  | ExprLe
  | ExprLt
  | ExprGt
  | ExprGe
  | FuncCall
  | ArrIndex
  | Identifier
  | LiteralBoolean
  | LiteralNull
  | LiteralNumber
  | LiteralString

export interface ExprAssign<Type extends | 'expr_assign'
  | 'expr_add_assign'
  | 'expr_sub_assign'
  | 'expr_mul_assign'
  | 'expr_div_assign' = 'expr_assign'
> extends ExprASTNode<Type> {
  left: Expr
  right: Expr
}

export interface ExprAddAssign extends ExprAssign<'expr_add_assign'> { }

export interface ExprSubAssign extends ExprAssign<'expr_sub_assign'> { }

export interface ExprMulAssign extends ExprAssign<'expr_mul_assign'> { }

export interface ExprDivAssign extends ExprAssign<'expr_div_assign'> { }

export interface ExprEq<Type extends 'expr_ne' | 'expr_eq' = 'expr_eq'> extends ExprASTNode<Type> {
  left: Expr
  right: Expr
}

export interface ExprNe extends ExprEq<'expr_ne'> { }

export interface ExprCompare<Type extends
  | 'expr_lt'
  | 'expr_le'
  | 'expr_gt'
  | 'expr_ge'
> extends ExprASTNode<Type> {
  left: Expr
  right: Expr
}

export interface ExprLt extends ExprCompare<'expr_lt'> { }

export interface ExprLe extends ExprCompare<'expr_le'> { }

export interface ExprGt extends ExprCompare<'expr_gt'> { }

export interface ExprGe extends ExprCompare<'expr_ge'> { }

export interface ExprCompute<Type extends
  | 'expr_div'
  | 'expr_mul'
  | 'expr_sub'
  | 'expr_add'
  | 'expr_mod'
> extends ExprASTNode<Type> {
  values: Expr[]
}

export interface ExprAdd extends ExprCompute<'expr_add'> { }

export interface ExprSub extends ExprCompute<'expr_sub'> { }

export interface ExprMul extends ExprCompute<'expr_mul'> { }

export interface ExprDiv extends ExprCompute<'expr_div'> { }

export interface ExprMod extends ExprCompute<'expr_mod'> { }

export interface FuncCall extends ExprASTNode<'func_call'> {
  func: ExprASTNode
  params: Param[]
}

export interface Param extends ExprASTNode<'param'> {
  key?: string
  value: Expr
}

export interface ObjMember extends ExprASTNode<'obj_member'> {
  obj: Expr
  member: Expr
}

export interface ArrIndex extends ExprASTNode<'arr_index'> {
  arr: Expr
  index: Expr
}

export interface Identifier extends ExprASTNode<'identifier'> {
  value: string
}

export interface Literal<Type extends
  | 'literal_string'
  | 'literal_number'
  | 'literal_null'
  | 'literal_boolean'
> extends ExprASTNode<Type> {
  value: string
}

export interface LiteralString extends Literal<'literal_string'> { }

export interface LiteralNumber extends Literal<'literal_number'> { }

export interface LiteralNull extends Literal<'literal_null'> { }

export interface LiteralBoolean extends Literal<'literal_boolean'> { }

export type ExprParserOptions = {

}

export type ExprParser = Parser<ExprASTNodeType, Expr, ExprParserOptions>

export const parse: ExprParser = parseExpr

export type ExprPluginOptions = {
  peggy: ExprParserOptions
}

export const expr: Plugin<ExprPluginOptions, undefined, Expr, string> = (options) => {
  return (input, source) => {
    return parse(source.content, options?.peggy)
  }
}
