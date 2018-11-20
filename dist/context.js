'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIDConsumer = exports.ImportedStream = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var context = _react2.default.createContext ? _react2.default.createContext() : null;

var UID = 1;

var ImportedStream = exports.ImportedStream = function (_React$Component) {
  _inherits(ImportedStream, _React$Component);

  function ImportedStream(props) {
    _classCallCheck(this, ImportedStream);

    var _this = _possibleConstructorReturn(this, (ImportedStream.__proto__ || Object.getPrototypeOf(ImportedStream)).call(this, props));

    _this.UID = UID++;
    if (!_this.props.takeUID) {
      throw new Error('You have to provide takeUID prop to ImportedStream');
    }
    _this.props.takeUID(_this.UID);
    return _this;
  }

  _createClass(ImportedStream, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        context.Provider,
        { value: this.UID },
        this.props.children
      );
    }
  }]);

  return ImportedStream;
}(_react2.default.Component);

ImportedStream.propTypes = {
  takeUID: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node
};


var PassThrough = function PassThrough(_ref) {
  var children = _ref.children;
  return children(0);
};
PassThrough.propTypes = {
  children: _propTypes2.default.func.isRequired
};

var UIDConsumer = exports.UIDConsumer = context ? context.Consumer : PassThrough;