import { j as jsxRuntimeExports } from "./client-entry-6dd9121e.js";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1"
  }, props.components);
  return jsxRuntimeExports.jsx(_components.h1, {
    children: "123"
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, Object.assign({}, props, {
    children: jsxRuntimeExports.jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
export {
  MDXContent as default
};
