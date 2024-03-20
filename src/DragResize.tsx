import React, { useState, useEffect, useRef, ReactNode } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export interface ReactDragResizeProps {
  active?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  w: number;
  h: number;
  x: number;
  y: number;
  minW?: number;
  minH?: number;
  handles?: string[];
  children?: ReactNode;
}

type HandleProps = {
  style: React.CSSProperties;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const DragComponent = styled.div`
  position: absolute;
  box-sizing: border-box;

  &.active {
    border: dashed 1px #000;
  }

  &:hover {
    cursor: ${(props) => (props.draggable ? 'move' : 'default')};
  }
`;

const Handle = styled.div`
  box-sizing: border-box;
  display: none;
  position: absolute;
  width: 10px;
  height: 10px;
  font-size: 1px;
  background: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  border-radius: 100px;
`;

const HandleTL = styled(Handle)`
  top: -5px;
  left: -5px;
  cursor: nw-resize;
`;

const HandleTM = styled(Handle)`
  top: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: n-resize;
`;

const HandleTR = styled(Handle)`
  top: -5px;
  right: -5px;
  cursor: ne-resize;
`;

const HandleML = styled(Handle)`
  top: 50%;
  margin-top: -5px;
  left: -5px;
  cursor: w-resize;
`;

const HandleMR = styled(Handle)`
  top: 50%;
  margin-top: -5px;
  right: -5px;
  cursor: e-resize;
`;

const HandleBL = styled(Handle)`
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
`;

const HandleBM = styled(Handle)`
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: s-resize;
`;

const HandleBR = styled(Handle)`
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
`;

const ReactDragResize: React.FC<ReactDragResizeProps> = ({
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
  children,
}) => {
  const [width, setWidth] = useState<number>(w);
  const [height, setHeight] = useState<number>(h);
  const [top, setTop] = useState<number>(y);
  const [left, setLeft] = useState<number>(x);
  const [enabled, setEnabled] = useState<boolean>(active);

  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  const mouseOffX = useRef<number>(0);
  const mouseOffY = useRef<number>(0);
  const elementX = useRef<number>(0);
  const elementY = useRef<number>(0);
  const elementW = useRef<number>(0);
  const elementH = useRef<number>(0);

  const handle = useRef<string | null>(null);
  const resizing = useRef<boolean | null>(null);
  const dragging = useRef<boolean | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener('mousemove', handleMove, true);
    document.addEventListener('mousedown', handleDeselect, true);
    document.addEventListener('mouseup', handleUp, true);

    elementX.current = parseInt(dragRef.current!.style.left || '0', 10);
    elementY.current = parseInt(dragRef.current!.style.top || '0', 10);
    elementW.current =
      dragRef.current!.offsetWidth || dragRef.current!.clientWidth;
    elementH.current =
      dragRef.current!.clientHeight || dragRef.current!.clientHeight;

    enforceMinimumDimensions();

    return () => {
      document.removeEventListener('mousemove', handleMove, true);
      document.removeEventListener('mousedown', handleDeselect, true);
      document.removeEventListener('mouseup', handleUp, true);
    };
  }, []);

  const elementDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;

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

  const handleDown = (
    element: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    handle.current = element;
    resizing.current = true;
  };

  const handleMove = (event: MouseEvent) => {
    mouseX.current =
      event.pageX || event.clientX + document.documentElement.scrollLeft;
    mouseY.current =
      event.pageY || event.clientY + document.documentElement.scrollTop;

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

  const handleDeselect = (event: MouseEvent) => {
    lastMouseX.current = mouseX.current =
      event.pageX || event.clientX + document.documentElement.scrollLeft;
    lastMouseY.current = mouseY.current =
      event.pageY || event.clientY + document.documentElement.scrollTop;

    const target = event.target as HTMLElement;
    const regexp = new RegExp('handle-([trmbl]{2})', '');

    if (
      dragRef.current &&
      !dragRef.current.contains(target) &&
      !regexp.test(target.className)
    ) {
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

  return (
    <DragComponent
      className={`${draggable ? 'draggable' : ''} ${resizable ? 'resizable' : ''} ${enabled ? 'active' : ''}`}
      style={{
        width,
        height,
        top,
        left,
      }}
      onMouseDown={elementDown}
      ref={dragRef}
    >
      {resizable &&
        handles.map((handle) => {
          const HandleComponent = {
            tl: HandleTL,
            tm: HandleTM,
            tr: HandleTR,
            ml: HandleML,
            mr: HandleMR,
            bl: HandleBL,
            bm: HandleBM,
            br: HandleBR,
          }[handle] as React.FC<HandleProps> | undefined;

          if (HandleComponent) {
            return (
              <HandleComponent
                key={handle}
                style={{ display: enabled ? 'block' : 'none' }}
                onMouseDown={(event) => handleDown(handle, event)}
              />
            );
          }
          return null;
        })}
      {children}
    </DragComponent>
  );
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
  handles: PropTypes.array,
};

export default ReactDragResize;
