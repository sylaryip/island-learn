"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1"
  }, props.components);
  return jsxRuntime.jsx(_components.h1, {
    children: "123"
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsxRuntime.jsx(MDXLayout, Object.assign({}, props, {
    children: jsxRuntime.jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
exports.default = MDXContent;
