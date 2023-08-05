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

export type ExprASTNode<NodeType extends ExprASTNodeType = ExprASTNodeType> = ASTNode<NodeType>

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

export type ExprAddAssign = ExprAssign<'expr_add_assign'>

export type ExprSubAssign = ExprAssign<'expr_sub_assign'>

export type ExprMulAssign = ExprAssign<'expr_mul_assign'>

export type ExprDivAssign = ExprAssign<'expr_div_assign'>

export interface ExprEq<Type extends 'expr_ne' | 'expr_eq' = 'expr_eq'> extends ExprASTNode<Type> {
  left: Expr
  right: Expr
}

export type ExprNe = ExprEq<'expr_ne'>

export interface ExprCompare<Type extends
  | 'expr_lt'
  | 'expr_le'
  | 'expr_gt'
  | 'expr_ge'
> extends ExprASTNode<Type> {
  left: Expr
  right: Expr
}

export type ExprLt = ExprCompare<'expr_lt'>

export type ExprLe = ExprCompare<'expr_le'>

export type ExprGt = ExprCompare<'expr_gt'>

export type ExprGe = ExprCompare<'expr_ge'>

export interface ExprCompute<Type extends
  | 'expr_div'
  | 'expr_mul'
  | 'expr_sub'
  | 'expr_add'
  | 'expr_mod'
> extends ExprASTNode<Type> {
  values: Expr[]
}

export type ExprAdd = ExprCompute<'expr_add'>

export type ExprSub = ExprCompute<'expr_sub'>

export type ExprMul = ExprCompute<'expr_mul'>

export type ExprDiv = ExprCompute<'expr_div'>

export type ExprMod = ExprCompute<'expr_mod'>

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

export type LiteralString = Literal<'literal_string'>

export type LiteralNumber = Literal<'literal_number'>

export type LiteralNull = Literal<'literal_null'>

export type LiteralBoolean = Literal<'literal_boolean'>

export type ExprParserOptions = {
  // TODO
}

export type ExprParser = Parser<ExprASTNodeType, Expr, ExprParserOptions>

export const parse: ExprParser = parseExpr

export type ExprPluginOptions = {
  peggy?: ExprParserOptions
}

export const expr: Plugin<ExprPluginOptions, unknown, Expr, string> = (options) => {
  return (input, source) => {
    return parse(source.content, options?.peggy)
  }
}
