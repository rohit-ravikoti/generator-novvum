'use strict';
var yeoman = require('yeoman-generator');
var fsSync = require('fs-exists-sync');
var changeCase = require('change-case');
var addToIndex = require('../../utils/add_to_index');
// var chalk = require('chalk');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.props = {
      module: arguments[0][0]
    };
    this.props = Object.assign(this.props, this.options);
  },

  prompting: function () {
    var prompts = [
      this.props.module ?
      undefined :
      {
        type: 'input',
        name: 'module',
        message: 'What is the name of the module?',
        default: 'Generic' // Default to current folder name
      }
    ].filter(i => i);
    return prompts.length > 0 ?
      this.prompt(prompts).then(function (props) {
        // To access props later use this.props.someAnswer;
        this.props = Object.assign(this.props, props);
      }.bind(this)) : undefined;
  },

  writing: function () {
    if (!fsSync(this.destinationPath('src', this.props.module))) { // eslint-disable-line
      const pascalCase = changeCase.pascalCase(this.props.module);
      // create component folder
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('src', this.props.module, 'components', 'index.js'),
        {componentName: pascalCase}
      );
      // update components index file
      addToIndex(
        this.destinationPath('src', 'index.js'),
        `export * from './${pascalCase}/components';`
      );
      // create story for component
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('src', this.props.module, 'stories', 'index.js'),
        {componentName: pascalCase}
      );
      // update stories index file
      addToIndex(
        this.destinationPath('src', 'index.storybook.js'),
        `require('./${pascalCase}');`
      );
    } else {
      this.log.error(`Error! Module ${this.props.module} already exists!`);
      return;
    }
  }
});
