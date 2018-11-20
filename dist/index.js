'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazy = exports.setConfiguration = exports.ImportedStream = exports.loadableResource = exports.ComponentLoader = exports.assignImportedComponents = exports.dryRender = exports.whenComponentsReady = exports.rehydrateMarks = exports.drainHydrateMarks = exports.printDrainHydrateMarks = undefined;

var _HOC = require('./HOC');

var _HOC2 = _interopRequireDefault(_HOC);

var _marks = require('./marks');

var _loadable = require('./loadable');

var _loadable2 = _interopRequireDefault(_loadable);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _context = require('./context');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setConfiguration = function setConfiguration(config) {
  return Object.assign(_Component.settings, config);
};

exports.printDrainHydrateMarks = _marks.printDrainHydrateMarks;
exports.drainHydrateMarks = _marks.drainHydrateMarks;
exports.rehydrateMarks = _marks.rehydrateMarks;
exports.whenComponentsReady = _loadable.done;
exports.dryRender = _loadable.dryRender;
exports.assignImportedComponents = _loadable.assignImportedComponents;
exports.ComponentLoader = _Component2.default;
exports.loadableResource = _loadable2.default;
exports.ImportedStream = _context.ImportedStream;
exports.setConfiguration = setConfiguration;
exports.lazy = _HOC.lazy;
exports.default = _HOC2.default;