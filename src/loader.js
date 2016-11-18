'use strict';
/**
 * loader
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-11-18  上午9:50
 */
const VueLoader = require('./vueLoader.js');
const loaderUtils = require('loader-utils')


module.exports = function(source){
	this.cacheable();
	let queryObj = loaderUtils.parseQuery(this.query) || {};


	let entry = new VueLoader(Object.assign({
		path :  './.vueloader'
	}, queryObj));





	let filePath = entry.renderVuePath(source);

	return 'module.exports = require(' +
		loaderUtils.stringifyRequest(this, '!!vue-loader!' + filePath) +
		');'
}


