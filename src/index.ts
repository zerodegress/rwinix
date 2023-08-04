import { Plugin } from './plugin'
import { CorePluginOptions, core } from './rwini'
import { Source } from './source'

export interface Processor<
  SourceInput,
  CurrentOutput
> {
  use: <
    Output,
    Options extends object
  >(
    plugin: Plugin<object, CurrentOutput, Output, SourceInput>,
    options?: Options,
  ) => Processor<SourceInput, Output>
  process: (input: Source<SourceInput>) => CurrentOutput
}

export interface ProcessorFactory<
  Source = undefined,
  Options extends object = Record<string, never>,
> {
  (options?: Options): Processor<Source, string>
}

function createProcessor<
  Output,
  SourceInput,
  CurrentOutput,
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
  core: CorePluginOptions
}
export const rwini = (options?: RwIniOptions) => createProcessor(
  () => undefined,
  core,
  options?.core,
)

export default rwini
