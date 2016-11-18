'use strict';
/**
 * vueLoader Component
 * config code block
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-11-18  上午9:34
 */

const EventEmitter = require('events').EventEmitter;
const cheerio = require('cheerio');
const path = require('path');
const markdown = require('markdown-it');
const util = require('./util.js');
const fs = require('fs');
const fse = require('fs-extra');


class VueLoader extends EventEmitter{
	constructor(options){
		options = options || {};
		super(options);

		console.log(options);
		this.options = options = Object.assign({
			preset : 'default',
			html : true,
			highlight : util.renderHighlight,
			doc : 'ysfdoc'
		},options);


		this.md = markdown(options.preset, options);

		this.init();

	}
	init(){
		this.addPlugin();
		this.rewriteRender();
	}
	addPlugin(){
		var that = this,
			options = this.options;

		var reg = new RegExp('^'+options.doc+'\\s*(.*)$');

		this.md.use(require('markdown-it-container'), options.doc, {

			validate: function(params) {
				return params.trim().match(reg);
			},

			render: function(tokens, idx) {
				var m = tokens[idx].info.trim().match(reg);
				if (tokens[idx].nesting === 1) {
					var description = (m && m.length > 1) ? m[1] : '';
					var html = util.convert(util.striptags(tokens[idx + 1].content, 'script'));
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

		this.md.renderer.rules.fence = util.wrap(this.md.renderer.rules.fence);

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

	renderVuePath(source){
		let file = path.resolve(process.cwd(), this.options.path, util.genId()+'.vue');

		fse.outputFileSync(file, this.renderMarkdown(source));

		return file;

	}
}

module.exports = VueLoader;