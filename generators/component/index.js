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
      module: arguments[0][0],
      component: arguments[0][1]
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
        message: 'What is the name of the module that the compoent goes into?',
        default: 'Generic' // Default to current folder name
      },
      this.props.component ?
      undefined :
      {
        type: 'input',
        name: 'component',
        message: 'What is the name of your new component? (ThisCase)',
        default: 'new_component' // Default to current folder name
      }
    ].filter(i => i);
    return prompts.length > 0 ?
      this.prompt(prompts).then(function (props) {
        // To access props later use this.props.someAnswer;
        this.props = Object.assign(this.props, props);
      }.bind(this)) : undefined;
  },

  writing: function () {
    if (fsSync(this.destinationPath('src', this.props.module))) {
      const snakeCase = changeCase.snakeCase(this.props.component);
      const pascalCase = changeCase.pascalCase(this.props.component);
      // create component
      this.fs.copyTpl(
        this.templatePath('ReactComponent.js'),
        this.destinationPath('src', this.props.module, 'components', `${snakeCase}.js`),
        {componentName: pascalCase}
      );
      // update components index file
      addToIndex(
        this.destinationPath('src', this.props.module, 'components', 'index.js'),
        `export { default as ${pascalCase} } from './${snakeCase}';`
      );
      // create story for component
      this.fs.copyTpl(
        this.templatePath('Story.js'),
        this.destinationPath('src', this.props.module, 'stories', `${snakeCase}.js`),
        {componentName: pascalCase}
      );
      // update stories index file
      addToIndex(
        this.destinationPath('src', this.props.module, 'stories', 'index.js'),
        `require('./${snakeCase}');`
      );
    } else {
      this.log.error(`Error! Module ${this.props.module} doesn't exist!`);
      return;
    }
  }
});
