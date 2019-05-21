"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _internals = require("./internals");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;

  var _defaultOptions$plugi = (0, _extends3.default)({}, _internals.defaultOptions, pluginOptions),
      rss = _defaultOptions$plugi.rss,
      json = _defaultOptions$plugi.json;

  var output = [];
  if (rss) {
    output.push(_react2.default.createElement("link", {
      rel: "alternate",
      key: "gatsby-feed-rss",
      type: "application/rss+xml",
      href: "feed.xml"
    }));
  }

  if (json) {
    output.push(_react2.default.createElement("link", {
      rel: "alternate",
      key: "gatsby-feed-json",
      type: "application/json",
      href: "feed.json"
    }));
  }

  setHeadComponents(output);
};