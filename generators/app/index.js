'use strict';
var generators = require('yeoman-generator');
var glob = require('glob');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
  // init
  initializing: function() {
    this.projName = 'demo';
    this.existedFolder = [];
    var folders = glob.sync(this.destinationPath('./*/'));
    folders.forEach(function(v) {
      if (v && v.lastIndexOf('/') > -1) {
        var tmpArr = v.split('/').reverse();
        this.existedFolder.push(tmpArr[1]);
      }
    }.bind(this));
  },

  prompting: function() {
    var done = this.async();

    return this.prompt([{
      type: 'input',
      name: 'projName',
      message: '请输入项目名称:',
      default: 'demo',
      validate: function(input) {
        if (this.existedFolder && this.existedFolder.indexOf(input) >
          -1) {
          return '文件夹' + input + ' 已存在！';
        } else {
          return true;
        }
      }.bind(this)
    }]).then(function(props) {
      this.projName = props.projName;
      done();
    }.bind(this));
  },
  writing: function() {
    var projName = this.projName;
    var pagePath = projName + '/pages/';
    var compPath = projName + '/components/';
    var staticPath = projName + '/static/';
    var staticCssPath = projName + '/static/css/';
    var staticJsPath = projName + '/static/js/';
    var staticImgPath = projName + '/static/image/';

    // make dir
    mkdirp(pagePath);
    mkdirp(compPath);

    mkdirp(staticPath);
    mkdirp(staticCssPath);
    mkdirp(staticJsPath);
    mkdirp(staticImgPath);
  },
  end: function() {
    this.log('初始化项目完成!')
  }
});