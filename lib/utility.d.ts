import { ASTNode, Range } from './parser';
export type MessageLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export interface Utility<Node extends ASTNode> {
    visit(ast: Node): Node | undefined;
    message(msg: string, range?: Range, level?: MessageLevel): void;
}
