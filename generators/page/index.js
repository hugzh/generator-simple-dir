'use strict';
var generators = require('yeoman-generator');
var glob = require('glob');

module.exports = generators.Base.extend({
  // init
  initializing: function() {
    this.existedFile = [];
    this.pageName = '';
    // 遍历./pages
    var pageFiles = glob.sync(this.destinationPath('./pages/*/'));
    var reg = /\/(\w+)(\/$)/;
    pageFiles.forEach(function(v) {
      if (v && v.lastIndexOf('/') > -1) {
        this.existedFile.push(reg.exec(v)[1]);
      }
    }.bind(this));
  },

  prompting: function() {
    var done = this.async();
    var promptConf = [{
      type: 'input',
      name: 'pageName',
      message: '请输入页面名称:',
      default: 'page_demo',
      // 校验page是否已存在
      validate: function(input) {
        if (this.existedFile && this.existedFile.indexOf(input) >
          -1) {
          this.log('页面已存在，请换一个页面名称！');
          return false;
        } else {
          return true;
        }
      }.bind(this)
    }, {
      type: 'input',
      name: 'pageTitle',
      message: '页面Title描述：',
      default: 'Title'
    }, {
      type: 'confirm',
      name: 'isNeedStyle',
      message: '是否需要样式表?',
      default: true
    }, {
      type: 'confirm',
      name: 'isPc',
      message: '是否PC端的页面？',
      default: false
    }];

    return this.prompt(promptConf)
      .then(function(props) {
        this.pageName = props.pageName;
        this.pageTitle = props.pageTitle;
        this.isNeedStyle = props.isNeedStyle;
        this.isPc = props.isPc;

        done();
      }.bind(this));
  },
  writing: function() {
    var tplArr = ['page.html', 'page.js', 'page.css'];
    var pageConf = {
      pageName: this.pageName,
      pageTitle: this.pageTitle,
      isNeedStyle: this.isNeedStyle,
    };
    if (this.isPc) {
      tplArr[0] = 'page.pc.html';
    }
    if (!this.isNeedStyle) {
      tplArr.pop();
    }

    tplArr.forEach(function(value, index) {
      // (from,to,content)
      this.fs.copyTpl(
        this.templatePath(value),
        this.destinationPath('pages/' + pageConf.pageName + '/' + pageConf.pageName +
          '.' + value.split(
            '.').pop()),
        pageConf
      );
    }.bind(this));

  },
  end: function() {
    this.log('新建页面完成!')
  }
});