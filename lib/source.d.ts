import { Position } from "./parser";
export interface Source<Content extends unknown = string> {
    filename?: string;
    fullpath?: string;
    content: Content;
    length: number;
    locate(offset: number): Position;
}
export declare function createSource<Content extends unknown = string>(content: Content, options?: {
    fullpath?: string;
    length?: number;
    locate?(offset: number): Position;
}): Source<Content>;
