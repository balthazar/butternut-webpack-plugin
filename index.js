import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers'
import { RawSource } from 'webpack-sources'
import { squash } from 'butternut'

const isEntryChunk = chunk => chunk.hasRuntime() && chunk.isInitial()

export default class ButternutPlugin {

  constructor (conf = {}) {
    this.conf = conf
  }

  apply (compiler) {

    compiler.plugin('compilation', compilation => {
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

        for (const chunk of chunks) {
          const files = chunk.files

          for (const file of files) {
            const matchObjectConfiguration = { test: /\.js$/ }

            if (ModuleFilenameHelpers.matchObject(matchObjectConfiguration, file)) {
              const asset = compilation.assets[file]
              const code = isEntryChunk(chunk) ? asset.source() : `__assumeDataProperty(global, "webpackJsonp", __abstract("function"))\n ${asset.source()}`
              const transformed = squash(code, this.conf)

              compilation.assets[file] = new RawSource(transformed.code)
            }

          }
        }

        callback()

      })
    })
  }
}
