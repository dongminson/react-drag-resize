import React, { ReactNode } from 'react';
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
declare const ReactDragResize: React.FC<ReactDragResizeProps>;
export default ReactDragResize;
