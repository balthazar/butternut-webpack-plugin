import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers'
import { RawSource } from 'webpack-sources'
import { squash } from 'butternut'

export default class ButternutPlugin {

  constructor (conf = {}) {
    this.conf = conf
  }

  apply (compiler) {

    compiler.plugin('compilation', compilation => {
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {

        const matchObjectOpts = { test: /\.js($|\?)/i }
        const files = getFiles(chunks, compilation, matchObjectOpts)

        for (const file of files) {

          if (!ModuleFilenameHelpers.matchObject(matchObjectOpts, file)) {
            return
          }

          const asset = compilation.assets[file]
          const code = asset.source()
          const transformed = squash(code, this.conf)

          compilation.assets[file] = new RawSource(transformed.code)

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
