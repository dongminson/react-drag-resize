import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
const DragComponent = styled.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  box-sizing: border-box;\n\n  &.active {\n    border: dashed 1px #000;\n  }\n\n  &:hover {\n    cursor: ", ";\n  }\n"])), props => props.draggable ? 'move' : 'default');
const Handle = styled.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  display: none;\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  font-size: 1px;\n  background: #fff;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);\n  border-radius: 100px;\n"])));
const HandleTL = styled(Handle)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  top: -5px;\n  left: -5px;\n  cursor: nw-resize;\n"])));
const HandleTM = styled(Handle)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  top: -5px;\n  left: 50%;\n  margin-left: -5px;\n  cursor: n-resize;\n"])));
const HandleTR = styled(Handle)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  top: -5px;\n  right: -5px;\n  cursor: ne-resize;\n"])));
const HandleML = styled(Handle)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  top: 50%;\n  margin-top: -5px;\n  left: -5px;\n  cursor: w-resize;\n"])));
const HandleMR = styled(Handle)(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  top: 50%;\n  margin-top: -5px;\n  right: -5px;\n  cursor: e-resize;\n"])));
const HandleBL = styled(Handle)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  left: -5px;\n  cursor: sw-resize;\n"])));
const HandleBM = styled(Handle)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  left: 50%;\n  margin-left: -5px;\n  cursor: s-resize;\n"])));
const HandleBR = styled(Handle)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  bottom: -5px;\n  right: -5px;\n  cursor: se-resize;\n"])));
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
  const [width, setWidth] = useState(w);
  const [height, setHeight] = useState(h);
  const [top, setTop] = useState(y);
  const [left, setLeft] = useState(x);
  const [enabled, setEnabled] = useState(active);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const mouseOffX = useRef(0);
  const mouseOffY = useRef(0);
  const elementX = useRef(0);
  const elementY = useRef(0);
  const elementW = useRef(0);
  const elementH = useRef(0);
  const handle = useRef(null);
  const resizing = useRef(null);
  const dragging = useRef(null);
  const dragRef = useRef(null);
  useEffect(() => {
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
  return /*#__PURE__*/React.createElement(DragComponent, {
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
      return /*#__PURE__*/React.createElement(HandleComponent, {
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
  active: PropTypes.bool,
  draggable: PropTypes.bool,
  resizable: PropTypes.bool,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  minW: PropTypes.number,
  minH: PropTypes.number,
  handles: PropTypes.array
};
var ReactDragResize$1 = ReactDragResize;

export { ReactDragResize$1 as ReactDragResize };
