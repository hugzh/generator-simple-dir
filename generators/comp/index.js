'use strict';
var generators = require('yeoman-generator');
var glob = require('glob');

module.exports = generators.Base.extend({
  // init
  initializing: function() {
    this.existedFile = [];
    this.compName = '';
    // 遍历./comps
    var compFiles = glob.sync(this.destinationPath('./components/*/'));
    var reg = /\/(\w+)(\/$)/;
    compFiles.forEach(function(v) {
      if (v && v.lastIndexOf('/') > -1) {
        this.existedFile.push(reg.exec(v)[1]);
      }
    }.bind(this));
  },

  prompting: function() {
    var done = this.async();
    var promptConf = [{
      type: 'input',
      name: 'compName',
      message: '请输入组件名称:',
      default: 'comp_demo',
      // 校验comp是否已存在
      validate: function(input) {
        if (this.existedFile && this.existedFile.indexOf(input) >
          -1) {
          return 'component' + input + ' 已存在！';
        } else {
          return true;
        }
      }.bind(this)
    }, {
      type: 'input',
      name: 'compDesc',
      message: '组件作用描述：',
      default: '公用组件'
    }, {
      type: 'confirm',
      name: 'isNeedStyle',
      message: '组件是否需要样式表?',
      default: true
    }, {
      type: 'confirm',
      name: 'isNeedTpl',
      message: '组件是否需要模板？',
      default: true
    }];

    return this.prompt(promptConf)
      .then(function(props) {
        this.compName = props.compName;
        this.compDesc = props.compDesc;
        this.isNeedStyle = props.isNeedStyle;
        this.isNeedTpl = props.isNeedTpl;

        done();
      }.bind(this));
  },
  writing: function() {
    var tplArr = ['comp.js', 'comp.tpl', 'comp.css'];
    var compConf = {
      compName: this.compName,
      compDesc: this.compDesc,
      isNeedStyle: this.isNeedStyle,
      isNeedTpl: this.isNeedTpl
    };
    if (!this.isNeedStyle) {
      tplArr.pop();
    }
    if (!this.isNeedTpl) {
      tplArr.pop();
    }

    tplArr.forEach(function(value, index) {
      var fileType = '.' + value.split('.').pop();
      var fileName = compConf.compName + fileType;
      // js入口文件，指定为index.js
      if (fileType === '.js') {
        fileName = 'index.js'
      }
      // (from,to,content)
      this.fs.copyTpl(
        this.templatePath(value),
        this.destinationPath('components/' + compConf.compName + '/' + fileName),
        compConf
      );
    }.bind(this));

  },
  end: function() {
    this.log('新建组件完成!')
  }
});