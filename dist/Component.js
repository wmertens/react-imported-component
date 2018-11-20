'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnconnectedReactImportedComponent = exports.settings = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _marks = require('./marks');

var _loadable = require('./loadable');

var _loadable2 = _interopRequireDefault(_loadable);

var _context = require('./context');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATE_LOADING = 'loading';
var STATE_ERROR = 'error';
var STATE_DONE = 'done';

var FragmentNode = function FragmentNode(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'div',
    null,
    children
  );
};
FragmentNode.propTypes = {
  children: _propTypes2.default.any
};

var settings = exports.settings = {
  hot: !!module.hot,
  SSR: _detectNode2.default
};

var getLoadable = function getLoadable(importFunction) {
  if ('promise' in importFunction) {
    return importFunction;
  }
  return (0, _loadable2.default)(importFunction, false);
};

var UnconnectedReactImportedComponent = exports.UnconnectedReactImportedComponent = function (_Component) {
  _inherits(UnconnectedReactImportedComponent, _Component);

  function UnconnectedReactImportedComponent(props) {
    _classCallCheck(this, UnconnectedReactImportedComponent);

    var _this = _possibleConstructorReturn(this, (UnconnectedReactImportedComponent.__proto__ || Object.getPrototypeOf(UnconnectedReactImportedComponent)).call(this, props));

    _this.mounted = false;

    _this.reload = function () {
      if (_this.mounted) {
        _this.setState({
          state: STATE_LOADING
        });
      }
      _this.remount();
    };

    _this.state = _this.pickPrecached() || {};

    getLoadable(_this.props.loadable).load().catch(function () {
      return {};
    });

    if (_detectNode2.default && settings.SSR && typeof _this.props.streamId !== 'undefined') {
      (0, _marks.useMark)(_this.props.streamId, _this.props.loadable.mark);
      if (_this.state.state !== STATE_DONE) {
        _this.state.state = STATE_LOADING;
        _this.reload();
      }
    }
    return _this;
  }

  _createClass(UnconnectedReactImportedComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
      (0, _marks.useMark)(this.props.streamId, this.props.loadable.mark);
      if (this.state.state !== STATE_DONE) {
        this.reload();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(oldProps) {
      // this.props.loadable would change only on HRM (or direct component usage)
      // just load it, do not use result
      if (oldProps.loadable !== this.props.loadable) {
        getLoadable(this.props.loadable).load().catch(function () {
          return {};
        });
      }
    }
  }, {
    key: 'pickPrecached',
    value: function pickPrecached() {
      var loadable = getLoadable(this.props.loadable);
      if (loadable.done) {
        return {
          AsyncComponent: this.props.exportPicker(loadable.payload),
          state: loadable.ok ? STATE_DONE : STATE_ERROR,
          error: loadable.error
        };
      }
      return null;
    }
  }, {
    key: 'loadAsyncComponent',
    value: function loadAsyncComponent() {
      var _this2 = this;

      var loadable = getLoadable(this.props.loadable);
      if (loadable.done) {
        this.setState(this.pickPrecached());
        return loadable.promise;
      } else {
        this.loadingPromise = loadable.load();
        return this.loadingPromise.then(function (payload) {
          if (_this2.mounted) {
            _this2.setState({
              AsyncComponent: _this2.props.exportPicker(payload),
              state: STATE_DONE
            });
          }
        });
      }
    }
  }, {
    key: 'remount',
    value: function remount() {
      var _this3 = this;

      this.loadAsyncComponent().catch(function (err) {
        if (_this3.mounted) {
          /* eslint-disable */
          console.error('[React-imported-component]', err);
          /* eslint-enable */
          _this3.setState({
            state: STATE_ERROR,
            error: err
          });

          if (_this3.props.onError) {
            _this3.props.onError(err);
          } else {
            throw err;
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          AsyncComponent = _state.AsyncComponent,
          state = _state.state;
      var _props = this.props,
          LoadingComponent = _props.LoadingComponent,
          ErrorComponent = _props.ErrorComponent;


      if (state === STATE_LOADING && this.props.async) {
        throw this.loadingPromise;
      }

      if (this.props.render) {
        return this.props.render(AsyncComponent, state, this.props.forwardProps);
      }

      if (AsyncComponent) {
        return _react2.default.createElement(AsyncComponent, _extends({}, this.props.forwardProps, { ref: this.props.forwardRef }));
      }

      switch (state) {
        case STATE_LOADING:
          return LoadingComponent ? _react2.default.Children.only(_react2.default.createElement(LoadingComponent, this.props.forwardProps)) : null;
        case STATE_ERROR:
          if (ErrorComponent) {
            return _react2.default.Children.only(_react2.default.createElement(ErrorComponent, _extends({
              retryImport: this.reload,
              error: this.state.error
            }, this.props.forwardProps)));
          }
          throw this.state.error;
        default:
          return null;
      }
    }
  }]);

  return UnconnectedReactImportedComponent;
}(_react.Component);

var es6import = function es6import(module) {
  return module.default ? module.default : module;
};

var BaseProps = {
  loadable: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]).isRequired,
  LoadingComponent: _propTypes2.default.func,
  ErrorComponent: _propTypes2.default.func,
  exportPicker: _propTypes2.default.func,
  render: _propTypes2.default.func,
  ssrMark: _propTypes2.default.string,
  async: _propTypes2.default.bool,

  onError: _propTypes2.default.func,
  forwardProps: _propTypes2.default.object,
  forwardRef: _propTypes2.default.func
};

UnconnectedReactImportedComponent.propTypes = _extends({}, BaseProps, {
  streamId: _propTypes2.default.number
});

UnconnectedReactImportedComponent.defaultProps = {
  exportPicker: es6import,
  async: false
};

var ReactImportedComponent = function ReactImportedComponent(props) {
  return settings.SSR ? _react2.default.createElement(
    _context.UIDConsumer,
    null,
    function (UID) {
      return _react2.default.createElement(UnconnectedReactImportedComponent, _extends({}, props, { streamId: UID | 0 }));
    }
  ) : _react2.default.createElement(UnconnectedReactImportedComponent, _extends({}, props, { streamId: 0 }));
};

ReactImportedComponent.propTypes = BaseProps;

exports.default = ReactImportedComponent;