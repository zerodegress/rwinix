{
  options.escapeMap = {
    'n': '\n',
    ...options.escapeMap,
  }
  options.allowAssign = options.allowAssign || false
  options.errors = {
    'expr.invalid': 'Invalid exprresion.',
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
  
AssignExpr
  = left:OrExpr right:(WhiteSpace '=' @WhiteSpace AssignExpr)? {
    if(!right) {
      return left
    } else {
      return {
        nodeType: 'expr_assign',
        left,
        right,
      }
    }
  }
  
OrExpr
  = head:AndExpr tail:(WordSep 'or' WordSep @OrExpr)+ {
    return {
      nodeType: 'expr_or',
      values: [head, ...tail]
    }
  }
  / node:AndExpr {
    return node
  }

AndExpr
  = head:EqExpr tail:(WordSep 'and' WordSep @AndExpr)+ {
    return {
      nodeType: 'expr_and',
      values: [head, ...tail]
    }
  }
  / node:EqExpr {
    return node
  }
  
EqExpr
  = head:CompareExpr tail:(WhiteSpace '==' WhiteSpace @EqExpr)+ {
    return {
      nodeType: 'expr_eq',
      values: [head, ...tail]
    }
  }
  / head:CompareExpr tail:(WhiteSpace '!=' WhiteSpace @EqExpr)+ {
    return {
      nodeType: 'expr_ne',
      values: [head, ...tail]
    }
  }
  / node:CompareExpr {
    return node
  }
  
CompareExpr
  = head:AddExpr tail:(WhiteSpace '>=' WhiteSpace @CompareExpr)+ {
    return {
      nodeType: 'expr_ge',
      values: [head, ...tail]
    }
  }
  / head:AddExpr tail:(WhiteSpace '>' WhiteSpace @CompareExpr)+ {
    return {
      nodeType: 'expr_gt',
      values: [head, ...tail]
    }
  }
  / head:AddExpr tail:(WhiteSpace '<=' WhiteSpace @CompareExpr)+ {
    return {
      nodeType: 'expr_le',
      values: [head, ...tail]
    }
  }
  / head:AddExpr tail:(WhiteSpace '<' WhiteSpace @CompareExpr)+ {
    return {
      nodeType: 'expr_lt',
      values: [head, ...tail]
    }
  }
  / node:AddExpr {
    return node
  }
  
AddExpr
  = head:MulExpr tail:(WhiteSpace '+' WhiteSpace @AddExpr)+ {
    return {
      nodeType: 'expr_add',
      values: [head, ...tail]
    }
  }
  / head:MulExpr tail:(WhiteSpace '-' WhiteSpace @AddExpr)+ {
    return {
      nodeType: 'expr_sub',
      values: [head, ...tail]
    }
  }
  / node:MulExpr {
    return node
  }

MulExpr
  = head:SingleExpr tail:(WhiteSpace '*' WhiteSpace @MulExpr)+ {
    return {
      nodeType: 'expr_mul',
      values: [head, ...tail]
    }
  }
  / head:SingleExpr tail:(WhiteSpace '/' WhiteSpace @MulExpr)+ {
    return {
      nodeType: 'expr_div',
      values: [head, ...tail]
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
    }
  }
  / arr:ParrenExpr '[' WhiteSpace index:Expr WhiteSpace ']' {
    return {
      nodeType: 'arr_index',
      arr,
      index,
    }
  }
  / obj:ParrenExpr '.' member:NoWhiteSpaceAroundExpr {
    return {
      nodeType: 'obj_member',
      obj,
      member,
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
    }
  }
  / value:NoWhiteSpaceAroundExpr {
    return {
      nodeType: 'param',
      value,
    }
  }
  
Identifier
  = value:$([^- \n\t\+\*\/&^%$#@!\\|'";:\?\.\[\]\{\}`~\(\)\=,0-9] [^- \n\t\+\*\/&^%$#@!\\|'";:\?\.\[\]\{\}`~\(\)\=,]*) {
    return {
      nodeType: 'identifier',
      value,
    }
  }
  
Literal
  = value:NumberLiteral {
    return {
      nodeType: 'literal_number',
      value,
    }
  }
  / value:StringLiteral {
    return {
      nodeType: 'literal_string',
      value,
    }
  }
  / value:BooleanLiteral {
    return {
      nodeType: 'literal_boolean',
      value,
    }
  }
  / value:NullLiteral {
    return {
      nodeType: 'literal_null',
      value,
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