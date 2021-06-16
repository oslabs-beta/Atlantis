'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _canvasGauges = require('canvas-gauges');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactRadialGauge = function (_React$Component) {
  _inherits(ReactRadialGauge, _React$Component);

  function ReactRadialGauge() {
    _classCallCheck(this, ReactRadialGauge);

    return _possibleConstructorReturn(this, (ReactRadialGauge.__proto__ || Object.getPrototypeOf(ReactRadialGauge)).apply(this, arguments));
  }

  _createClass(ReactRadialGauge, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var options = Object.assign({}, this.props, {
        renderTo: this.el
      });
      this.gauge = new _canvasGauges.RadialGauge(options).draw();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.gauge.update(nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('canvas', { ref: function ref(canvas) {
          _this2.el = canvas;
        } });
    }
  }]);

  return ReactRadialGauge;
}(_react2.default.Component);

exports.default = ReactRadialGauge;