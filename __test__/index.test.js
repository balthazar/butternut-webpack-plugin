/* eslint-env jest */
import path from 'path'
import fs from 'fs'
import del from 'del'
import webpack from 'webpack'
import { SourceMapConsumer } from 'source-map'
import ButternutWebpackPlugin from '../index'

const buildDir = path.join(__dirname, 'build')

describe('butternut-webpack-plugin', () => {
  afterEach(() =>
    del(buildDir)
  )

  describe('sourcemaps', () => {
    beforeEach(() =>
      run({
        devtool: 'sourcemap',
      })
    )

    test('should have sourcemaps with correct filenames', async () => {
      const src = await sources()
      const srcWithouthWebpackPrefix = src.map(removeWebpackPrefix)
      expect(srcWithouthWebpackPrefix).toContain('__test__/resources/a.js')
      expect(srcWithouthWebpackPrefix).toContain('__test__/resources/b.js')
      expect(srcWithouthWebpackPrefix).toContain('__test__/resources/app.js')
    })
  })
})

function run (webpackConfigOpts, butternutOpts) {
  const compiler = webpack(getConfig(webpackConfigOpts, butternutOpts))
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      return resolve(stats)
    })
  })
}

async function sources () {
  const fileContent = await getFile('bundle.js.map')
  const map = JSON.parse(fileContent)
  const smc = new SourceMapConsumer(map)
  return smc.sources
}

function getFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(buildDir, file), 'utf-8', (error, data) => {
      if (error) {
        return reject(error)
      }

      return resolve(data)
    })
  })
}

function getConfig (webpackConfigOpts = {}, butternutOpts = {}) {
  return {
    entry: path.join(__dirname, 'resources/app.js'),
    output: {
      filename: 'bundle.js',
      path: buildDir,
    },
    plugins: [
      new ButternutWebpackPlugin(butternutOpts),
    ],
    devtool: webpackConfigOpts.devtool ? webpackConfigOpts.devtool : undefined,
  }
}

function removeWebpackPrefix (s) {
  return s.replace('webpack:///', '')
}
