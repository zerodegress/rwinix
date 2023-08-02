{
  options.errors = {
    'line.unknown': 'Unknown line.',
    'section.head.empty': 'Unexpeted empty section head.',
    'section.head.unclosed': 'Unclosed section head.',
    'attribute.key.empty': 'Unexpected empty attribute key.',
    'attribute.value.empty': 'Unexpected empty attribute value.',
    'attribute.value.multiline.unclosed': 'Unclosed attribute multiline value.',
    'attribute.value.multiline.suffix': 'Unexpected attribute multiline value suffix',
    ...options.errors,
  }
}

Source
  = block:(WhiteSpace @SourceBLock WhiteSpace)* EOF {
    return {
      nodeType: 'rwini',
      blocks: block.filter(x => x),
    }
  }

SourceBLock
  = comment:CommentLine ('\n' / EOF) {
    return comment
  }
  / Section
  / $([^\n]+ ('\n' / EOF)) {
    return error(options.errors['line.unknown'])
  }

Section
  = head:SectionHead WhiteSpaceNoNewLine comment:CommentLine? WhiteSpaceNoNewLine '\n' WhiteSpace body:SectionBody {
    if(head.startsWith('comment_')) {
      return {
        nodeType: 'comment_block',
        content: text(),
        location: location(),
      }
    }
    for(const x of body) {
      if(x && x.nodeType === 'section_item_unknown_line') {
        return error(options.errors['line.unknown'], x.location)
      }
    }
    return {
      nodeType: 'section',
      head,
      body: body.filter(x => x),
      location: location(),
      ...(comment && { comment }),
    }
  }
  / head:SectionHead comment:CommentLine? WhiteSpace EOF {
    if(head.startsWith('comment_')) {
      return {
        nodeType: 'comment_block',
        content: text(),
        location: location(),
      }
    }
    return {
      nodeType: 'section',
      head,
      body: [],
      location: location(),
      ...(comment && { comment }),
    }
  }

SectionHead
  = '[' content:$([^\[\]\n]+)? end:']'? {
    if(end != ']') {
      return error(options.errors['section.head.unclosed'])
    }
    if(!content) {
      return error(options.errors['section.head.empty'])
    }
    return content
  }

SectionBody
  = head:SectionItem
    tail:(WhiteSpaceNoNewLine '\n' WhiteSpaceNoNewLine SectionItem)* {
      return [head, ...tail.map(x => x[3]).filter(x => x)]
    }

SectionItem
  = attr:Attribute comment:CommentLine? {
    return {
      nodeType: 'section_item',
      attr,
      ...(comment && { comment }),
      location: location(),
    }
  }
  / comment:CommentLine {
    return {
      nodeType: 'section_item',
      comment: comment,
      location: location(),
    }
  }
  / unknown:UnknownLine {
    return {
      nodeType: 'section_item_unknown_line',
      unknown,
      location: location(),
    }
  }
  / WhiteSpaceNoNewLine { return }

Attribute
  = key:$([^:\n]+)? ':' WhiteSpaceNoNewLine value:AttributeValue? {
    if(!key) {
      return error(options.errors['attribute.key.empty'])
    }
    if(!value) {
      return error(options.errors['attribute.value.empty'])
    }
    return {
      nodeType: 'attribute',
      key,
      value: value.replaceAll('\n', ''),
      location: location(),
    }
  }

AttributeValue
  = pre:$([^\n#('"' &'""')] [^\n('"' &'""')]*)? '"""' content:$((('"' !'""') / ([^"]))*) end:$'"""'? suf:AttributeValue? {
    if(end != '"""') {
      return error(options.errors['attribute.value.multiline.unclosed'])
    }
    return (pre || '') + (content || '') + (suf || '')
  }
  / pre:$([^\n#("'" &"''")] [^\n]*)? "'''" content:$((("'" !"''") / ([^']))*) end:$"'''"? suf:AttributeValue? {
    if(end != "'''") {
      return error(options.errors['attribute.value.multiline.unclosed'])
    }
    return (pre || '') + (content || '') + (suf || '')
  }
  / content:$[^\n#]+ {
    if(content.endsWith('"""') || content.endsWith("'''")) {
      return error(options.errors['attribute.value.multiline.unclosed'])
    }
  	return content
  }
  
UnknownLine
  = content:$([^ \t\n\[#] [^\n]*) {
    return {
      nodeType: 'unknown_line',
      content,
      location: location(),
    }
  }

CommentLine
  = '#' content:$[^\n]* {
    return {
      nodeType: 'comment_line',
      content,
      location: location(),
    }
  }

WhiteSpace
  = [ \t\n]*

WhiteSpaceNoNewLine
  = [ \t]*

EOF
  = !.