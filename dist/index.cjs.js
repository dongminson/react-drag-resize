'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');
var styled = require('styled-components');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;
const DragComponent = styled__default["default"].div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  box-sizing: border-box;\n\n  &.active {\n    border: dashed 1px #000;\n  }\n\n  &:hover {\n    cursor: ", ";\n  }\n"])), props => props.draggable ? 'move' : 'default');
const Handle = styled__default["default"].div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  display: none;\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  font-size: 1px;\n  background: #fff;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);\n  border-radius: 100px;\n"])));
const HandleTL = styled__default["default"](Handle)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  top: -5px;\n  left: -5px;\n  cursor: nw-resize;\n"])));
const HandleTM = styled__default["default"](Handle)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  top: -5px;\n  left: 50%;\n  margin-left: -5px;\n  cursor: n-resize;\n"])));
const HandleTR = styled__default["default"](Handle)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  top: -5px;\n  right: -5px;\n  cursor: ne-resize;\n"])));
const HandleML = styled__default["default"](Handle)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  top: 50%;\n  margin-top: -5px;\n  left: -5px;\n  cursor: w-resize;\n"])));
const HandleMR = styled__default["default"](Handle)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  top: 50%;\n  margin-top: -5px;\n  right: -5px;\n  cursor: e-resize;\n"])));
const HandleBL = styled__default["default"](Handle)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  left: -5px;\n  cursor: sw-resize;\n"])));
const HandleBM = styled__default["default"](Handle)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  left: 50%;\n  margin-left: -5px;\n  cursor: s-resize;\n"])));
const HandleBR = styled__default["default"](Handle)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  right: -5px;\n  cursor: se-resize;\n"])));
const ReactDragResize = _ref => {
  let {
    active = false,
    draggable = true,
    resizable = true,
    w,
    h,
    minW = 50,
    minH = 50,
    x,
    y,
    handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
    children
  } = _ref;
  const [width, setWidth] = React.useState(w);
  const [height, setHeight] = React.useState(h);
  const [top, setTop] = React.useState(y);
  const [left, setLeft] = React.useState(x);
  const [enabled, setEnabled] = React.useState(active);
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);
  const lastMouseX = React.useRef(0);
  const lastMouseY = React.useRef(0);
  const mouseOffX = React.useRef(0);
  const mouseOffY = React.useRef(0);
  const elementX = React.useRef(0);
  const elementY = React.useRef(0);
  const elementW = React.useRef(0);
  const elementH = React.useRef(0);
  const handle = React.useRef(null);
  const resizing = React.useRef(null);
  const dragging = React.useRef(null);
  const dragRef = React.useRef(null);
  React.useEffect(() => {
    document.addEventListener('mousemove', handleMove, true);
    document.addEventListener('mousedown', handleDeselect, true);
    document.addEventListener('mouseup', handleUp, true);
    elementX.current = parseInt(dragRef.current.style.left || '0', 10);
    elementY.current = parseInt(dragRef.current.style.top || '0', 10);
    elementW.current = dragRef.current.offsetWidth || dragRef.current.clientWidth;
    elementH.current = dragRef.current.clientHeight || dragRef.current.clientHeight;
    enforceMinimumDimensions();
    return () => {
      document.removeEventListener('mousemove', handleMove, true);
      document.removeEventListener('mousedown', handleDeselect, true);
      document.removeEventListener('mouseup', handleUp, true);
    };
  }, []);
  const elementDown = event => {
    event.stopPropagation();
    const target = event.target;
    if (dragRef.current && dragRef.current.contains(target)) {
      enforceMinimumDimensions();
      if (!enabled) {
        setEnabled(true);
      }
      if (draggable) {
        dragging.current = true;
      }
    }
  };
  const handleDown = (element, event) => {
    event.stopPropagation();
    event.preventDefault();
    handle.current = element;
    resizing.current = true;
  };
  const handleMove = event => {
    mouseX.current = event.pageX || event.clientX + document.documentElement.scrollLeft;
    mouseY.current = event.pageY || event.clientY + document.documentElement.scrollTop;
    let diffX = mouseX.current - lastMouseX.current + mouseOffX.current;
    let diffY = mouseY.current - lastMouseY.current + mouseOffY.current;
    mouseOffX.current = mouseOffY.current = 0;
    lastMouseX.current = mouseX.current;
    lastMouseY.current = mouseY.current;
    const dX = diffX;
    const dY = diffY;
    if (resizing.current && handle.current) {
      if (handle.current.indexOf('t') > -1) {
        if (elementH.current - dY < minH) {
          mouseOffY.current = dY - (diffY = elementH.current - minH);
        }
        elementY.current += diffY;
        elementH.current -= diffY;
      }
      if (handle.current.indexOf('b') > -1) {
        if (elementH.current + dY < minH) {
          mouseOffY.current = dY - (diffY = minH - elementH.current);
        }
        elementH.current += diffY;
      }
      if (handle.current.indexOf('l') > -1) {
        if (elementW.current - dX < minW) {
          mouseOffX.current = dX - (diffX = elementW.current - minW);
        }
        elementX.current += diffX;
        elementW.current -= diffX;
      }
      if (handle.current.indexOf('r') > -1) {
        if (elementW.current + dX < minW) {
          mouseOffX.current = dX - (diffX = minW - elementW.current);
        }
        elementW.current += diffX;
      }
      setTop(Math.round(elementY.current));
      setLeft(Math.round(elementX.current));
      setWidth(Math.round(elementW.current));
      setHeight(Math.round(elementH.current));
    } else if (dragging.current) {
      elementX.current += diffX;
      elementY.current += diffY;
      setLeft(Math.round(elementX.current));
      setTop(Math.round(elementY.current));
    }
  };
  const handleDeselect = event => {
    lastMouseX.current = mouseX.current = event.pageX || event.clientX + document.documentElement.scrollLeft;
    lastMouseY.current = mouseY.current = event.pageY || event.clientY + document.documentElement.scrollTop;
    const target = event.target;
    const regexp = new RegExp('handle-([trmbl]{2})', '');
    if (dragRef.current && !dragRef.current.contains(target) && !regexp.test(target.className)) {
      if (enabled) {
        setEnabled(false);
      }
    }
  };
  const handleUp = () => {
    handle.current = null;
    if (resizing.current) {
      resizing.current = false;
    }
    if (dragging) {
      dragging.current = false;
    }
  };
  const enforceMinimumDimensions = () => {
    if (minW && minW > width) setWidth(minW);
    if (minH && minH > height) setHeight(minH);
    elementW.current = width;
    elementH.current = height;
  };
  return /*#__PURE__*/React__default["default"].createElement(DragComponent, {
    className: "".concat(draggable ? 'draggable' : '', " ").concat(resizable ? 'resizable' : '', " ").concat(enabled ? 'active' : ''),
    style: {
      width,
      height,
      top,
      left
    },
    onMouseDown: elementDown,
    ref: dragRef
  }, resizable && handles.map(handle => {
    const HandleComponent = {
      tl: HandleTL,
      tm: HandleTM,
      tr: HandleTR,
      ml: HandleML,
      mr: HandleMR,
      bl: HandleBL,
      bm: HandleBM,
      br: HandleBR
    }[handle];
    if (HandleComponent) {
      return /*#__PURE__*/React__default["default"].createElement(HandleComponent, {
        key: handle,
        style: {
          display: enabled ? 'block' : 'none'
        },
        onMouseDown: event => handleDown(handle, event)
      });
    }
    return null;
  }), children);
};
ReactDragResize.propTypes = {
  active: PropTypes__default["default"].bool,
  draggable: PropTypes__default["default"].bool,
  resizable: PropTypes__default["default"].bool,
  w: PropTypes__default["default"].number.isRequired,
  h: PropTypes__default["default"].number.isRequired,
  x: PropTypes__default["default"].number.isRequired,
  y: PropTypes__default["default"].number.isRequired,
  minW: PropTypes__default["default"].number,
  minH: PropTypes__default["default"].number,
  handles: PropTypes__default["default"].array
};
var ReactDragResize$1 = ReactDragResize;

exports.ReactDragResize = ReactDragResize$1;
