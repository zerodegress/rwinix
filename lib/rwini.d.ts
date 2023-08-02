import { ASTNode, Parser, Range } from './parser';
import { Plugin } from './plugin';
export type RwiniASTNodeType = 'rwini' | 'comment_block' | 'comment_line' | 'section' | 'section_item' | 'attribute';
export interface RwiniASTNode<Type extends RwiniASTNodeType = RwiniASTNodeType> extends ASTNode<Type> {
    nodeType: Type;
    location: Range;
}
export interface RwiniSource extends RwiniASTNode<'rwini'> {
    blocks: CommentBlock | CommentLine | Section;
}
export interface CommentBlock extends RwiniASTNode<'comment_block'> {
    content: string;
}
export interface CommentLine extends RwiniASTNode<'comment_line'> {
    content: string;
}
export interface Section extends RwiniASTNode<'section'> {
    head: string;
    body: SectionItem;
    comment?: CommentLine;
}
export interface SectionItem extends RwiniASTNode<'section_item'> {
    attr?: Attribute;
    comment?: CommentLine;
}
export interface Attribute extends RwiniASTNode<'attribute'> {
    key: string;
    value: string;
}
export type RwiniParser = Parser<RwiniASTNodeType, RwiniSource>;
export declare const parse: RwiniParser;
export declare const core: Plugin<{}, undefined, RwiniSource, string>;
