'use strict';
const hljs = require('highlight.js');
const cheerio = require('cheerio');
/**
 * util
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-11-18  下午5:53
 */


let fileUid = 1;


/**
 * genId
 */

let genId = function(file){
	return (++fileUid);
};

/**
 * wrap
 *
 * @param render
 * @returns {Function}
 */
let wrap = function(render){
	return function(){
		return render.apply(this, arguments)
			.replace('<code class="', '<code class="hljs ')
			.replace('<code>', '<code class="hljs">');
	}
};

/**
 * 自定义标签
 *
 * @param str
 * @param tags
 * @returns {*}
 */
let striptags = function(str, tags) {
	var $ = cheerio.load(str, {decodeEntities: false});

	if (!tags || tags.length === 0) {
		return str;
	}

	tags = !Array.isArray(tags) ? [tags] : tags;
	var len = tags.length;

	while (len--) {
		$(tags[len]).remove();
	}

	return $.html();
};

/**
 * 字符串转换
 *
 * @param str
 * @returns {string|void|XML|*}
 */
let convert = function(str) {
	str = str.replace(/(&#x)(\w{4});/gi, function($0) {
		return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
	});
	return str;
};

/**
 * `{{ }}` => `<span>{{</span> <span>}}</span>`
 * @param  {string} str
 * @return {string}
 */
let replaceDelimiters = function (str) {
	return str.replace(/({{|}})/g, '<span>$1</span>')
}


/**
 * renderHighlight
 * @param  {string} str
 * @param  {string} lang
 */
let renderHighlight = function (str, lang) {
	if (!(lang && hljs.getLanguage(lang))) {
		return ''
	}

	try {
		return replaceDelimiters(hljs.highlight(lang, str, true).value)
	} catch (err) {}
}


module.exports = {
	genId : genId,
	wrap : wrap,
	striptags : striptags,
	convert : convert,
	replaceDelimiters : replaceDelimiters,
	renderHighlight : renderHighlight

}