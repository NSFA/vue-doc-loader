var path = require('path');

module.exports = {
	"entry": "./loader.test.js",
	"output": {
		"path": "./dist",
		"filename": "app.js"
	},

	"module": {
		"loaders": [
			{
				test: /\.md$/,
				loader: path.resolve(__dirname, '../../src/loader.js'),
				query : "doc=demo"
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