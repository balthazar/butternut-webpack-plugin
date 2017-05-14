import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers'
import { RawSource, SourceMapSource } from 'webpack-sources'
import { squash } from 'butternut'

export default class ButternutPlugin {

  constructor (conf = {}) {
    this.conf = conf
  }

  apply (compiler) {

    const useSourceMap = typeof this.conf.sourceMap === 'undefined'
      ? !!compiler.options.devtool
      : this.conf.sourceMap

    compiler.plugin('compilation', compilation => {

      if (useSourceMap) {
        compilation.plugin('build-module', module => {
          module.useSourceMap = true
        })
      }

      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

        const matchObjectOpts = { test: /\.js($|\?)/i }
        const files = getFiles(chunks, compilation, matchObjectOpts)

        for (const file of files) {

          if (!ModuleFilenameHelpers.matchObject(matchObjectOpts, file)) {
            return
          }

          const asset = compilation.assets[file]

          if (asset.__butternutfied) {
            return
          }

          const { input, inputSourceMap } = getAssetParts(asset, useSourceMap)

          // TODO: We need to find a way to pass `inputSourceMap` to squash(),
          // so the final output source map will be based on `inputSourceMap`.
          const transformed = squash(input, {
            check: this.conf.check,
            allowDangerousEval: this.conf.allowDangerousEval,
            sourceMap: useSourceMap,
          })

          const source = transformed.map
            ? new SourceMapSource(transformed.code, file, transformed.map, input, inputSourceMap)
            : new RawSource(transformed.code)

          asset.__butternutfied = compilation.assets[file] = source

        }

        callback()

      })
    })
  }
}

function getFiles (chunks, compilation) {
  const files = []
  chunks.forEach(chunk => files.push(...chunk.files))
  files.push(...compilation.additionalChunkAssets)

  return files
}

function getAssetParts (asset, useSourceMap) {
  if (useSourceMap && asset.sourceAndMap) {
    const sourceAndMap = asset.sourceAndMap()
    return { input: sourceAndMap.source, inputSourceMap: sourceAndMap.map }
  }

  if (useSourceMap) {
    return { input: asset.source(), inputSourceMap: asset.map() }
  }

  return { input: asset.source() }
}
