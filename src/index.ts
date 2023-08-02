import { Plugin, Transformer } from "./plugin"
import { RwiniSource, core } from "./rwini"
import { Source } from "./source"
import { parse as rwiniParser } from './rwini'

export interface Processor<
  SourceInput extends unknown,
  CurrentOutput extends unknown,
> {
  use: <
    Output extends unknown,
    Options extends object
  >(
    plugin: Plugin<object, CurrentOutput, Output, SourceInput>, 
    options?: Options,
  ) => Processor<SourceInput, Output>
  process: (input: Source<SourceInput>) => CurrentOutput
}

export interface ProcessorFactory<
  Source extends unknown = undefined,
  Options extends object = {},
> {
  (options?: Options): Processor<Source, string>
}

function createProcessor<
  Output extends unknown,
  SourceInput extends unknown,
  CurrentOutput extends unknown,
  Options extends object
>(
  preProcess: (input: Source<SourceInput>) => CurrentOutput,
  plugin: Plugin<Options, CurrentOutput, Output, SourceInput>,
  options?: Options,
): Processor<
  SourceInput, 
  Output
> {
  const transformer = plugin(options)
  function process(input: Source<SourceInput>) {
    const currentOutput = preProcess(input)
    return transformer(currentOutput, input)
  }

  return {
    use: (plugin, options?) => {
      return createProcessor(
        process, 
        plugin,
        options
      )
    },
    process,
  }
}

export interface RwIniOptions {

}
export const rwini = (options?: RwIniOptions) => createProcessor(
  (input: Source<string>) => undefined,
  core,
  options,
)

export default rwini