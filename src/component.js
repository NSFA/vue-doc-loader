'use strict';
/**
 * vueLoader
 * config code block
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-11-18  上午9:34
 */

const EventEmitter = require('events').EventEmitter;
const cheerio = require('cheerio');
const path = require('path');
const hljs = require('highlight.js');
const markdown = require('markdown-it');



let genId = (function(){
	let cache = {},
		fileUid = 1;
	return function(file){
		return cache[file] || (cache[file] = fileUid++)
	}

})()



let wrap = function(render){
	return function(){
		return render.apply(this, arguments)
			.replace('<code class="', '<code class="hljs ')
			.replace('<code>', '<code class="hljs">');
	}
};
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



class VueLoader extends EventEmitter{
	constructor(options){
		options = options || {};
		super(options);
		this.options = options = Object.assign(options, {
			preset : 'default',
			html : true,
			highlight : renderHighlight
		});


		this.md = markdown(options.preset, options);

		this.init();

	}
	init(){
		this.addPlugin();
		this.rewriteRender();
	}
	addPlugin(){
		var that = this;
		this.md.use(require('markdown-it-container'), 'ysfdoc', {

			validate: function(params) {
				return params.trim().match(/^ysfdoc\s*(.*)$/);
			},

			render: function(tokens, idx) {
				var m = tokens[idx].info.trim().match(/^ysfdoc\s*(.*)$/);
				if (tokens[idx].nesting === 1) {
					var description = (m && m.length > 1) ? m[1] : '';
					var html = convert(striptags(tokens[idx + 1].content, 'script'));
					var descriptionHTML = description
						? '<div class="description">' + that.md.render(description) + '</div>'
						: '';
					return `<demo-block class="demo-box">
                    <div class="source">${html}</div>
                    <div class="meta">
                      ${descriptionHTML}
                      <div class="highlight">`;
				}
				return '</div></div></demo-block>\n';
			}
		});
	}

	rewriteRender(){
		var codeInlineRender = this.md.renderer.rules.code_inline;

		this.md.renderer.rules.fence = wrap(this.md.renderer.rules.fence);

		this.md.renderer.rules.table_open = function(){
			return '<table class="table">';
		};

	}
	renderMarkdown(source){
		let content = this.md.render(source);
		let result = this.renderVueTemplate(content);

		return result;
	}


	renderVueTemplate(html){
		var $ = cheerio.load(html, {
			decodeEntities: false,
			lowerCaseAttributeNames: false,
			lowerCaseTags: false
		})

		var output = {
			style: $.html('style'),
			script: $.html('script')
		}
		var result

		$('style').remove()
		$('script').remove()

		result = '<template><section>' + $.html() + '</section></template>\n' +
			output.style + '\n' +
			output.script;

		return result
	}
}

module.exports = VueLoader;