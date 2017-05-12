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
