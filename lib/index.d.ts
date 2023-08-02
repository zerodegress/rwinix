import { Plugin } from "./plugin";
import { RwiniSource } from "./rwini";
import { Source } from "./source";
export interface Processor<SourceInput extends unknown, CurrentOutput extends unknown> {
    use: <Output extends unknown, Options extends object>(plugin: Plugin<object, CurrentOutput, Output, SourceInput>, options?: Options) => Processor<SourceInput, Output>;
    process: (input: Source<SourceInput>) => CurrentOutput;
}
export interface ProcessorFactory<Source extends unknown = undefined, Options extends object = {}> {
    (options?: Options): Processor<Source, string>;
}
export interface RwIniOptions {
}
export declare const rwini: (options?: RwIniOptions) => Processor<string, RwiniSource>;
export default rwini;
