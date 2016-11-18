'use strict';
/**
 * loader
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-11-18  上午9:50
 */
const VueLoader = require('./component.js');

module.exports = function(source){
	
	this.cacheable();

	let entry = new VueLoader({
		resourcePath :  this.resourcePath
	});

	let filePath = entry.renderMarkdown(source)

	return 'module.exports = require(' +
		loaderUtils.stringifyRequest(this, '!!vue-loader!' + filePath) +
		');'
}


