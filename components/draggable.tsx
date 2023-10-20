import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable(props) {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: props.id,
        data: props.data
    });

    const style = transform ? {
        zIndex: isDragging ? 999 : undefined,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <div ref={setNodeRef} className='touch-none' style={style} {...listeners} {...attributes}>
            {typeof props.children === 'function' ? props.children({ isDragging }) : props.children}
        </div>
    );
}