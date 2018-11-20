'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remapImports = exports.getDynamicImports = exports.getFileContent = exports.promisify = undefined;

var _scanDirectory = require('scan-directory');

var _scanDirectory2 = _interopRequireDefault(_scanDirectory);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

try {
  require('babel-polyfill');
} catch (err) {
  require('@babel/polyfill');
}

/* eslint-disable no-console */

var promisify = exports.promisify = function promisify(fn, context, noReject) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      fn.call.apply(fn, [context].concat(args, [function (error, ok) {
        if (error) {
          if (noReject) {
            resolve(error);
          } else {
            reject(error);
          }
        }
        resolve(ok);
      }]));
    });
  };
};

var getRelative = function getRelative(from, to) {
  var rel = (0, _path.relative)(from, to);
  if (rel[0] !== '.') {
    return '.' + _path.sep + rel;
  }
  return rel;
};

var pReadFile = promisify(_fs.readFile);
var pWriteFile = promisify(_fs.writeFile);

var trimImport = function trimImport(str) {
  return str.replace(/['"]/g, '');
};
var getFileContent = exports.getFileContent = function getFileContent(file) {
  return pReadFile(file, 'utf8');
};

var getMatchString = function getMatchString(pattern, selected) {
  return function (str) {
    return (str.match(new RegExp(pattern, 'g')) || []).map(function (statement) {
      return statement.match(new RegExp(pattern, 'i'))[selected];
    });
  };
};

var getImports = getMatchString('([\'"]?[\\w-/.]+[\'"]?)\\)', 1);
var getComment = getMatchString(/\/\*.*\*\//, 0);

var clearComment = function clearComment(str) {
  return str.replace("webpackPrefetch: true", '').replace("webpackPreload: true", '');
};

var getImportString = function getImportString(pattern, selected) {
  return function (str) {
    return getMatchString(pattern, selected)(str).map(function (statement) {
      return {
        name: trimImport(getImports(statement + ')')[0] || ''),
        comment: clearComment(getComment(statement)[0] || '')
      };
    });
  };
};

var getDynamicImports = exports.getDynamicImports = getImportString('import\\((([^)])+[\'"]?)\\)', 1);

var mapImports = function mapImports(file, imports) {
  return imports.map(function (dep) {
    var name = dep.name,
        comment = dep.comment;

    if (name && name.charAt(0) === '.') {
      return {
        name: (0, _path.resolve)((0, _path.dirname)(file), name),
        comment: comment
      };
    }
    return dep;
  });
};

var rejectSystem = function rejectSystem(file, stats) {
  return stats.isDirectory() && file.match(/node_modules/) || file.match(/(\/\.\w+)/);
};

var remapImports = exports.remapImports = function remapImports(data, root, targetDir, getRelative, imports) {
  return data.map(function (_ref) {
    var file = _ref.file,
        content = _ref.content;
    return mapImports(file, getDynamicImports(content));
  }).forEach(function (importBlock) {
    return importBlock.forEach(function (_ref2) {
      var name = _ref2.name,
          comment = _ref2.comment;

      imports[getRelative(root, name)] = '() => import(' + comment + '\'' + getRelative(targetDir, name) + '\')';
    });
  });
};

function scanTop(root, start, target) {
  var scan = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var files, data, imports, targetDir;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log('scanning', start, 'for imports...');

              _context2.next = 3;
              return (0, _scanDirectory2.default)((0, _path.join)(root, start), undefined, rejectSystem);

            case 3:
              _context2.t0 = function (name) {
                return name.indexOf(target) === -1;
              };

              _context2.t1 = function (name) {
                return ['.js', '.jsx', '.ts', '.tsx'].indexOf((0, _path.extname)(name)) >= 0;
              };

              files = _context2.sent.filter(_context2.t0).filter(_context2.t1);
              _context2.next = 8;
              return Promise.all(files.map(function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
                  var content;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return getFileContent(file);

                        case 2:
                          content = _context.sent;
                          return _context.abrupt('return', {
                            file: file,
                            content: content
                          });

                        case 4:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x) {
                  return _ref4.apply(this, arguments);
                };
              }()));

            case 8:
              data = _context2.sent;
              imports = {};
              targetDir = (0, _path.resolve)(root, (0, _path.dirname)(target));

              remapImports(data, root, targetDir, getRelative, imports);

              console.log(Object.keys(imports).length + ' imports found, saving to ' + target);

              pWriteFile(target, '/* eslint-disable */ \n    import {assignImportedComponents} from \'react-imported-component\';\n    const applicationImports = {\n      ' + Object.keys(imports).map(function (key, index) {
                return index + ': ' + imports[key] + ',';
              }).join('\n') + '\n    };\n    assignImportedComponents(applicationImports);\n    export default applicationImports;');

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function scan() {
      return _ref3.apply(this, arguments);
    };
  }();

  return scan();
}

if (!process.argv[3]) {
  console.log('usage: imported-components sourceRoot targetFile');
  console.log('example: imported-components src src/importedComponents');
} else {
  scanTop(process.cwd(), process.argv[2], process.argv[3]);
}