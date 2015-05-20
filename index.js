var Writer = require('broccoli-writer');
var fs = require('fs-extra');
var wiredep = require('wiredep');

var WiredepPlugin = function (inputTree, options) {
  if (!(this instanceof WiredepPlugin)) {
    return new WiredepPlugin(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options;

  this.options.src = this.options.src || 'index.html';
};

WiredepPlugin.prototype = Object.create(Writer.prototype);
WiredepPlugin.prototype.constructor = WiredepPlugin;

WiredepPlugin.prototype.write = function (readTree, destDir) {
  var self = this;

  return readTree(this.inputTree).then(function (srcDir) {
    fs.copySync(srcDir, destDir);
    self.options.src = destDir + '/' + self.options.src;

    wiredep(self.options);
  })
};

module.exports =  WiredepPlugin;
