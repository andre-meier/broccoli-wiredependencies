'use strict';

var _ = require('lodash-node');
var fs = require('fs-extra');
var path = require('path');
var wiredep = require('wiredep');
var Writer = require('broccoli-writer');

function WireDependencies (inputTree, options) {
  var self = this;

  if (!(this instanceof WireDependencies)) {
    return new WireDependencies(inputTree, options);
  }

  self.inputTree = inputTree;
  self.options = options;

  self.options.src = self.options.src || 'index.html';

  self.options.bower = self.options.bower || true;
  self.options.ignoreBowerStylesheets = self.options.ignoreBowerStylesheets || true;

  self.options.paths = self.options.paths || {};
  self.options.paths.js = self.options.paths.js || 'js';
  self.options.paths.css = self.options.paths.css || 'styles';

  self.options.wiredep = self.options.wiredep || {};
}

WireDependencies.prototype = Object.create(Writer.prototype);
WireDependencies.prototype.constructor = WireDependencies;

WireDependencies.prototype.wire = function (dependencies, srcDir, destDir) {
  var self = this;

  var templates = {
    '.html': {
      'js': '<script src="{filePath}"></script>',
      'css': '<link href="{filePath}" rel="stylesheet" type="text/css">'
    },
    '.haml': {
      'js': '%script{src: "{filePath}"}',
      'css': '%link{href: "{filePath}", rel: "stylesheet", type: "text/css"}'
    },
    '.jade': {
      'js': 'script(src="{filePath}")',
      'css': 'link(href="{filePath}", rel="stylesheet", type="text/css")'
    }
  };

  var marker = {
    '.html': {
      js: /<!--\s*include:scripts\s*-->/gi,
      css: /<!--\s*include:styles\s*-->/gi
    },
    '.haml': {
      js: /-#\s*include:scripts/gi,
      css: /-#\s*include:styles/gi
    },
    '.jade': {
      js: /\/\/\s*include:scripts/gi,
      css: /\/\/\s*include:styles/gi
    }
  };

  var data = fs.readFileSync(srcDir + '/' + self.options.src, 'utf8');
  var extension = path.extname(self.options.src);

  var includes = {
    js: [],
    css: []
  };

  _.forOwn(dependencies, function (value, type) {
    _.forEach(value, function (filePath) {
      includes[type].push(templates[extension][type].replace('{filePath}', filePath));
    })
  });

  var replaceMarkerWithIncludes = function (type, data) {
    var lines = data.split('\n');
    var insertLines = [];

    _.forEach(lines, function (line) {
      if (line.match(marker[extension][type])) {
        _.forEach(includes[type], function (item) {
          insertLines.push(line.replace(marker[extension][type], item))
        });
      }
    });

    var indentationRegEx = /([ \t]*)/;

    var searchValue = new RegExp(indentationRegEx.source + marker[extension][type].source);
    var newValue = insertLines.join('\n');

    data = data.replace(searchValue, newValue);

    return data;
  };

  data = replaceMarkerWithIncludes('js', data);
  data = replaceMarkerWithIncludes('css', data);

  fs.outputFileSync(destDir + '/' + self.options.src, data);

};

WireDependencies.prototype.findFiles = function (searchPath, fileExtension) {
  var self = this;
  var result = [];

  if (fs.existsSync(searchPath)) {
    var files = fs.readdirSync(searchPath);

    _.forEach(files, function (file) {
      var fileName = path.join(searchPath, file);
      var stat = fs.lstatSync(fileName);

      if (stat.isDirectory()) {
        result = result.concat(self.findFiles(fileName, fileExtension));
      } else if (path.extname(fileName) === fileExtension) {
        result.push(fileName);
      }
    })
  }

  return result;
};

WireDependencies.prototype.collectDependencies = function (srcDir, destDir) {
  var self = this;

  var result = {
    js: [],
    css: []
  };

  var dependencies = {
    js: self.findFiles(srcDir, '.js'),
    css: self.findFiles(srcDir, '.css')
  };

  if (self.options.bower) {
    var bowerPackages = wiredep(self.options.wiredep);

    if (!self.options.ignoreBowerStylesheets) {
      dependencies.css = bowerPackages.css.concat(dependencies.css);
    }

    dependencies.js = bowerPackages.js.concat(dependencies.js);
  }

  _.forOwn(dependencies, function (value, type) {
    _.forEach(value, function (filepath) {
      var filename = path.basename(filepath);
      var target = self.options.paths[type] + '/' + filename;
      fs.copySync(filepath, destDir + '/' + target);

      result[type].push(target);
    });
  });

  return result;
};

WireDependencies.prototype.write = function (readTree, destDir) {
  var self = this;

  return readTree(self.inputTree).then(function (srcDir) {
    var dependencies = self.collectDependencies(srcDir, destDir);
    self.wire(dependencies, srcDir, destDir);
  });
};

module.exports =  WireDependencies;
