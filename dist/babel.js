'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types,
      template = _ref.template;

  var headerTemplate = template('function importedWrapper(marker, name, realImport) { \n      if (typeof __deoptimization_sideEffect__ !== \'undefined\') {\n        __deoptimization_sideEffect__(marker, name, realImport);\n      }\n      return realImport;\n  }', templateOptions);

  var importRegistration = template('importedWrapper(MARK, FILE, IMPORT)', templateOptions);

  var hasImports = {};
  var visitedNodes = new Map();

  return {
    inherits: syntax,

    visitor: {
      // using program to replace imports before "dynamic-import-node"
      // see: https://jamie.build/babel-plugin-ordering.html
      Program: {
        enter: function enter(programPath, _ref2) {
          var file = _ref2.file;

          programPath.traverse({
            Import: function Import(_ref3) {
              var parentPath = _ref3.parentPath;

              if (visitedNodes.has(parentPath.node)) {
                return;
              }

              var localFile = file.opts.filename;
              var newImport = parentPath.node;
              var importName = parentPath.get('arguments')[0].node.value;
              if (!importName) {
                return;
              }
              var requiredFile = (0, _utils.encipherImport)(resolveImport(importName, localFile));

              var replace = null;

              replace = importRegistration({
                MARK: t.stringLiteral("imported-component"),
                FILE: t.stringLiteral(requiredFile),
                IMPORT: newImport
              });

              hasImports[localFile] = true;
              visitedNodes.set(newImport, true);

              parentPath.replaceWith(replace);
            }
          });
        },
        exit: function exit(_ref4, _ref5) {
          var node = _ref4.node;
          var file = _ref5.file;

          if (!hasImports[file.opts.filename]) return;

          // hasImports[file.opts.filename].forEach(cb => cb());
          node.body.unshift(headerTemplate());
        }
      }
    }
  };
};

var _path = require('path');

var _utils = require('./utils');

// Babel v7 compat
var syntax = void 0;
try {
  syntax = require('babel-plugin-syntax-dynamic-import');
} catch (err) {
  syntax = require('@babel/plugin-syntax-dynamic-import');
}
syntax = syntax.default || syntax;

var resolveImport = function resolveImport(importName, file) {
  if (importName.charAt(0) === '.') {
    return (0, _path.relative)(process.cwd(), (0, _path.resolve)((0, _path.dirname)(file), importName));
  }
  return importName;
};

var templateOptions = {
  placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/
};