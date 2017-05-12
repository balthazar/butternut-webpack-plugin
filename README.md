<p align="right">
  <a href="https://www.npmjs.com/package/butternut-webpack-plugin">
    <img src="https://img.shields.io/npm/v/butternut-webpack-plugin.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/Apercu/butternut-webpack-plugin">
    <img src="https://img.shields.io/travis/Apercu/butternut-webpack-plugin.svg?style=flat-square">
  </a>
</p>

# butternut-webpack-plugin

    yarn add --dev butternut-webpack-plugin

### Usage

```js
// webpack.conf.js
import ButternutWebpackPlugin from 'butternut-webpack-plugin'

const options = {}

export default {
  // ...
  plugins: [
    new ButternutWebpackPlugin(options)
  ]
}
```

Checkout the options you can pass to butternut on [their Readme](https://github.com/Rich-Harris/butternut#javascript-api).
