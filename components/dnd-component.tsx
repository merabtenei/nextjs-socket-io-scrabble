import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCombinedRefs } from '@dnd-kit/utilities';

export function DndComponent(props) {
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: props.id,
        data: props.data
    });
    const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging } = useDraggable({
        id: props.id,
        data: props.data
    });

    const style = transform ? {
        zIndex: isDragging ? 999 : undefined,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const setNodeRef = useCombinedRefs(setDroppableNodeRef, setDraggableNodeRef);

    return (
        <div className={`inline-flex touch-none ${props.className}`} ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {typeof props.children === 'function' ? props.children({ isOver, isDragging }) : props.children}
        </div>
    );
}