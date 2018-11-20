'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazy = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _loadable = require('./loadable');

var _loadable2 = _interopRequireDefault(_loadable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 *
 * @param {Function} loaderFunction - () => import('a'), or () => require('b')
 * @param {Object} [options]
 * @param {React.Component} [options.LoadingComponent]
 * @param {React.Component} [options.ErrorComponent]
 * @param {Function} [options.exportPicker] - default behaviour - picks default export
 * @param {Function} [options.onError] - error handler. Will consume the real error.
 * @param {Function} [options.async] - enable React 16+ suspense.
 */
var loader = function loader(loaderFunction) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var loadable = (0, _loadable2.default)(loaderFunction, !options.noAutoImport);

  // eslint-disable-next-line
  var ImportedComponent = function ImportedComponent(_ref) {
    var _ref$importedProps = _ref.importedProps,
        importedProps = _ref$importedProps === undefined ? {} : _ref$importedProps,
        props = _objectWithoutProperties(_ref, ['importedProps']);

    return _react2.default.createElement(_Component2.default, _extends({
      loadable: loadable,
      LoadingComponent: options.LoadingComponent,
      ErrorComponent: options.ErrorComponent,
      exportPicker: options.exportPicker,
      onError: options.onError,
      render: options.render,
      async: options.async,
      forwardProps: props || {}
    }, importedProps));
  };

  var Imported = _react2.default.forwardRef ? _react2.default.forwardRef(function (_ref2, ref) {
    var _ref2$importedProps = _ref2.importedProps,
        importedProps = _ref2$importedProps === undefined ? {} : _ref2$importedProps,
        props = _objectWithoutProperties(_ref2, ['importedProps']);

    return _react2.default.createElement(ImportedComponent, _extends({}, props, {
      importedProps: _extends({}, importedProps, { forwardRef: ref })
    }));
  }) : ImportedComponent;

  Imported.preload = function () {
    return loadable.load().catch(function () {
      return {};
    });
  };

  return Imported;
};

var lazy = exports.lazy = function lazy(loaderFunction) {
  return loader(loaderFunction, { async: true });
};

exports.default = loader;