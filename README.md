# Document loader for webpack <img align="right" width="168" height="168" src="./assets/koala.png" title="logo" style="margin: -60px 30px 0 0;">


## Installation

```
    npm install vue-doc-loader --save-dev
```

The vue-doc-loader requires `vue-loader`, `vue-style-loader`, 'css-loader'

## Usage

``` javascript
    require("vue-doc-loader?doc=ysf-doc");
```
### webpack config

``` javascript

    module.exports = {
      module: {
        loaders: [
            {
                test: /\.md$/,
                loader: require('vue-doc-loader'),
                query : "doc=ysf-doc"
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
      },
        vue: {
            loaders: {
                scss: "vue-style-loader!css-loader!sass"
            }
        }
    };
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
