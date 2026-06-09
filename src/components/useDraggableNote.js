// 桌面端贴纸拖动状态只保存在内存，刷新后恢复默认布局。
import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// 返回指定 note 的 pointer handlers 和 CSS 位移变量。
export function useDraggableNotes(boundaryRef) {
  const [positions, setPositions] = useState({});
  const activeDragRef = useRef(null);

  useEffect(() => {
    function handleDragMove(event) {
      const activeDrag = activeDragRef.current;
      if (!activeDrag) {
        return;
      }

      setPositions((current) => ({
        ...current,
        [activeDrag.id]: {
          x: clamp(
            activeDrag.originX + event.clientX - activeDrag.startX,
            activeDrag.minX,
            activeDrag.maxX,
          ),
          y: clamp(
            activeDrag.originY + event.clientY - activeDrag.startY,
            activeDrag.minY,
            activeDrag.maxY,
          ),
        },
      }));
    }

    function handleDragEnd() {
      activeDragRef.current = null;
    }

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);
    };
  }, []);

  function getDragProps(id) {
    const position = positions[id] ?? { x: 0, y: 0 };

    function startDrag(event) {
      if (window.matchMedia("(max-width: 980px)").matches) {
        event.preventDefault();
        return;
      }

      if (event.pointerType === "touch") {
        return;
      }

      const noteRect = event.currentTarget?.getBoundingClientRect?.();
      const boundaryRect = boundaryRef?.current?.getBoundingClientRect?.();

      const hasMeasuredBounds =
        boundaryRect &&
        noteRect &&
        boundaryRect.width > 0 &&
        boundaryRect.height > 0 &&
        noteRect.width > 0 &&
        noteRect.height > 0;

      activeDragRef.current = {
        id,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
        minX: hasMeasuredBounds ? -1 * (noteRect.left - boundaryRect.left) : -Infinity,
        maxX:
          hasMeasuredBounds
            ? boundaryRect.right - noteRect.right
            : Infinity,
        minY: hasMeasuredBounds ? -1 * (noteRect.top - boundaryRect.top) : -Infinity,
        maxY:
          hasMeasuredBounds
            ? boundaryRect.bottom - noteRect.bottom
            : Infinity,
      };
    }

    return {
      style: {
        "--drag-x": `${position.x}px`,
        "--drag-y": `${position.y}px`,
      },
      handlers: {
        onMouseDown: startDrag,
        onPointerDown: startDrag,
      },
    };
  }

  return { getDragProps };
}
