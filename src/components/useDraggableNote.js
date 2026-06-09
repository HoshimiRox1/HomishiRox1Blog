// 桌面端贴纸拖动状态只保存在内存，刷新后恢复默认布局。
import { useEffect, useRef, useState } from "react";

// 返回指定 note 的 pointer handlers 和 CSS 位移变量。
export function useDraggableNotes() {
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
          x: activeDrag.originX + event.clientX - activeDrag.startX,
          y: activeDrag.originY + event.clientY - activeDrag.startY,
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

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
      }

      activeDragRef.current = {
        id,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };
    }

    return {
      style: {
        "--drag-x": `${position.x}px`,
        "--drag-y": `${position.y}px`,
      },
      handlers: {
        onDrag(event) {
          if (!activeDragRef.current || event.clientX === 0 || event.clientY === 0) {
            return;
          }

          setPositions((current) => ({
            ...current,
            [id]: {
              x: activeDragRef.current.originX + event.clientX - activeDragRef.current.startX,
              y: activeDragRef.current.originY + event.clientY - activeDragRef.current.startY,
            },
          }));
        },
        onDragEnd() {
          activeDragRef.current = null;
        },
        onDragStart: startDrag,
        onMouseDown: startDrag,
        onPointerDown: startDrag,
      },
    };
  }

  return { getDragProps };
}
