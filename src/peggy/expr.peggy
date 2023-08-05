{
  options.escapeMap = {
    'n': '\n',
    ...options.escapeMap,
  }
  options.allowAssign = options.allowAssign || false
  options.allowList = options.allowList || false
  options.errors = {
    'expr.invalid': 'Invalid exprresion.',
    'assign.diabled': 'options.allowAssign has been set to false.',
    'expr.list.disabled': 'options.allowList has been set to false',
    ...options.errors,
  }
}

Expr
  = WhiteSpace expr:AssignExpr WhiteSpace {
    return expr
  }
  / .+ {
    error(options.errors['expr.invalid'])
  }

NoWhiteSpaceAroundExpr
  = expr:AssignExpr {
    return expr
  }

ExprList
  = head:AssignExpr tail:(WhiteSpace ',' WhiteSpace @ExprList)* {
    if(tail) {
      if(!options.allowList) {
        return error(options.errors['expr.list.disabled'])
      }
      return {
        nodeType: 'expr_list',
        exprs: [head, ...tail],
        location: location(),
      }
    }
    return head
  }

AssignExpr
  = left:OrExpr right:(WhiteSpace '=' WhiteSpace @AssignExpr) {
    if(!options.allowAssign) {
      error(options.errors['assign.diabled'])
    }
    return {
      nodeType: 'expr_assign',
      left,
      right,
      location: location(),
    }
  }
  / left:OrExpr right:(WhiteSpace '+=' WhiteSpace @AssignExpr) {
    if(!options.allowAssign) {
      error(options.errors['assign.diabled'])
    }
    return {
      nodeType: 'expr_add_assign',
      left,
      right,
      location: location(),
    }
  }
  / left:OrExpr right:(WhiteSpace '-=' WhiteSpace @AssignExpr) {
    if(!options.allowAssign) {
      error(options.errors['assign.diabled'])
    }
    return {
      nodeType: 'expr_sub_assign',
      left,
      right,
      location: location(),
    }
  }
  / left:OrExpr right:(WhiteSpace '*=' WhiteSpace @AssignExpr) {
    if(!options.allowAssign) {
      error(options.errors['assign.diabled'])
    }
    return {
      nodeType: 'expr_mul_assign',
      left,
      right,
      location: location(),
    }
  }
  / left:OrExpr right:(WhiteSpace '/=' WhiteSpace @AssignExpr) {
    if(!options.allowAssign) {
      error(options.errors['assign.diabled'])
    }
    return {
      nodeType: 'expr_div_assign',
      left,
      right,
      location: location(),
    }
  }
  / node:OrExpr {
    return node
  }

OrExpr
  = head:AndExpr tail:(WordSep 'or' WordSep @OrExpr)+ {
    return {
      nodeType: 'expr_or',
      values: [head, ...tail],
      location: location(),
    }
  }
  / node:AndExpr {
    return node
  }

AndExpr
  = head:EqExpr tail:(WordSep 'and' WordSep @AndExpr)+ {
    return {
      nodeType: 'expr_and',
      values: [head, ...tail],
      location: location(),
    }
  }
  / node:EqExpr {
    return node
  }

EqExpr
  = left:CompareExpr right:(WhiteSpace '==' WhiteSpace @EqExpr) {
    return {
      nodeType: 'expr_eq',
      left,
      right,
      location: location(),
    }
  }
  / left:CompareExpr right:(WhiteSpace '!=' WhiteSpace @EqExpr) {
    return {
      nodeType: 'expr_ne',
      left,
      right,
      location: location(),
    }
  }
  / node:CompareExpr {
    return node
  }

CompareExpr
  = left:AddExpr right:(WhiteSpace '>=' WhiteSpace @CompareExpr) {
    return {
      nodeType: 'expr_ge',
      left,
      right,
      location: location(),
    }
  }
  / left:AddExpr right:(WhiteSpace '>' WhiteSpace @CompareExpr) {
    return {
      nodeType: 'expr_gt',
      left,
      right,
      location: location(),
    }
  }
  / left:AddExpr right:(WhiteSpace '<=' WhiteSpace @CompareExpr) {
    return {
      nodeType: 'expr_le',
      left,
      right,
      location: location(),
    }
  }
  / left:AddExpr right:(WhiteSpace '<' WhiteSpace @CompareExpr) {
    return {
      nodeType: 'expr_lt',
      left,
      right,
      location: location(),
    }
  }
  / node:AddExpr {
    return node
  }

AddExpr
  = head:MulExpr tail:(WhiteSpace '+' WhiteSpace @AddExpr)+ {
    return {
      nodeType: 'expr_add',
      values: [head, ...tail],
      location: location(),
    }
  }
  / head:MulExpr tail:(WhiteSpace '-' WhiteSpace @AddExpr)+ {
    return {
      nodeType: 'expr_sub',
      values: [head, ...tail],
      location: location(),
    }
  }
  / node:MulExpr {
    return node
  }

MulExpr
  = head:SingleExpr tail:(WhiteSpace '*' WhiteSpace @MulExpr)+ {
    return {
      nodeType: 'expr_mul',
      values: [head, ...tail],
      location: location(),
    }
  }
  / head:SingleExpr tail:(WhiteSpace '/' WhiteSpace @MulExpr)+ {
    return {
      nodeType: 'expr_div',
      values: [head, ...tail],
      location: location(),
    }
  }
  / head:SingleExpr tail:(WhiteSpace '%' WhiteSpace @MulExpr)+ {
    return {
      nodeType: 'expr_mod',
      values: [head, ...tail],
      location: location(),
    }
  }
  / node:SingleExpr {
    return node
  }

SingleExpr
  = 'not' WordSep expr:SufExpr {
    return {
      nodeType: 'expr_not',
      expr,
      location: location(),
    }
  }
  / node:SufExpr {
    return node
  }

SufExpr
  = func:ParrenExpr '(' WhiteSpace list:ParamList? WhiteSpace ')' {
    return {
      nodeType: 'func_call',
      func,
      params: list || [],
      location: location(),
    }
  }
  / arr:ParrenExpr '[' WhiteSpace index:Expr WhiteSpace ']' {
    return {
      nodeType: 'arr_index',
      arr,
      index,
      location: location(),
    }
  }
  / obj:ParrenExpr '.' member:NoWhiteSpaceAroundExpr {
    return {
      nodeType: 'obj_member',
      obj,
      member,
      location: location(),
    }
  }
  / node:ParrenExpr {
    return node
  }

ParrenExpr
  = '(' WhiteSpace expr:NoWhiteSpaceAroundExpr WhiteSpace ')' {
    return expr
  }
  / node:MetaExpr {
    return node
  }

MetaExpr
  = node:Literal {
    return node
  }
  / node:Identifier {
    return node
  }

ParamList
  = head:Param tail:(WhiteSpace ',' WhiteSpace @Param)* {
    return [head, ...tail]
  }

Param
  = key:Identifier WhiteSpace '=' WhiteSpace value:NoWhiteSpaceAroundExpr {
    return {
      nodeType: 'param',
      key,
      value,
      location: location(),
    }
  }
  / value:NoWhiteSpaceAroundExpr {
    return {
      nodeType: 'param',
      value,
      location: location(),
    }
  }

Identifier
  = value:$([^- \n\t\+\*\/&^%$#@!\\|'";:\?\.\[\]\{\}`~\(\)\=,0-9] [^- \n\t\+\*\/&^%$#@!\\|'";:\?\.\[\]\{\}`~\(\)\=,]*) {
    return {
      nodeType: 'identifier',
      value,
      location: location(),
    }
  }

Literal
  = value:NumberLiteral {
    return {
      nodeType: 'literal_number',
      value,
      location: location(),
    }
  }
  / value:StringLiteral {
    return {
      nodeType: 'literal_string',
      value,
      location: location(),
    }
  }
  / value:BooleanLiteral {
    return {
      nodeType: 'literal_boolean',
      value,
      location: location(),
    }
  }
  / value:NullLiteral {
    return {
      nodeType: 'literal_null',
      value,
      location: location(),
    }
  }

NumberLiteral
  = IntegerLiteral
  / FloatLiteral

IntegerLiteral
  = $(('+' / '-')? [1-9] [0-9]*)
  / $(('+' / '-')? [0-9])

FloatLiteral
  = $(('+' / '-')? IntegerLiteral '.' [0-9]*)
  / $(('+' / '-')? '.' [0-9]+)

StringLiteral
  = '"' value:$((('\\' .) / [^"])*) '"' {
    let res = value
    for(const k of Object.keys(options.escapeMap)) {
      res = res.replaceAll(new RegExp('\\\\' + k, 'g'), options.escapeMap[k])
    }
    return res.replaceAll(/\\(.)/g, '$1')
  }
  / "'" value:$((('\\' .) / [^'])*) "'" {
    let res = value
    for(const k of Object.keys(options.escapeMap)) {
      res = res.replaceAll(new RegExp('\\\\' + k, 'g'), options.escapeMap[k])
    }
    return res.replaceAll(/\\(.)/g, '$1')
  }

BooleanLiteral
  = $('true' / 'false')

NullLiteral
  = $('null' / 'nullUnit')

WhiteSpace
  = [ \t\n]*

WordSep
  = [ \t\n]+
