import { useState, useRef, useCallback, useEffect } from "react";

export const MIN_ZOOM = 1.0;
export const MAX_ZOOM = 3.0;
const DRAG_THRESHOLD = 5;
const ZOOM_FACTOR = 1.14;

function getContainerSize(el: HTMLElement) {
  return { w: el.clientWidth, h: el.clientHeight };
}

function clampOffset(x: number, y: number, zoom: number, w: number, h: number) {
  return {
    x: Math.min(0, Math.max(w * (1 - zoom), x)),
    y: Math.min(0, Math.max(h * (1 - zoom), y)),
  };
}

function applyZoomAtPoint(
  newZoom: number,
  pivotX: number,
  pivotY: number,
  curZoom: number,
  curOffset: { x: number; y: number },
  w: number,
  h: number
) {
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
  const worldX = (pivotX - curOffset.x) / curZoom;
  const worldY = (pivotY - curOffset.y) / curZoom;
  const nx = pivotX - worldX * clamped;
  const ny = pivotY - worldY * clamped;
  return { zoom: clamped, offset: clampOffset(nx, ny, clamped, w, h) };
}

export function useMapControls() {
  const [zoom, setZoomState] = useState(1.0);
  const [offset, setOffsetState] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const zoomRef = useRef(1.0);
  const offsetRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const offsetAtStart = useRef({ x: 0, y: 0 });

  const pinchStart = useRef({ dist: 0, midX: 0, midY: 0, zoom: 1, offX: 0, offY: 0 });

  const commit = useCallback((z: number, o: { x: number; y: number }) => {
    zoomRef.current = z;
    offsetRef.current = o;
    setZoomState(z);
    setOffsetState(o);
  }, []);

  const containerSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight - 48 };
    return getContainerSize(el);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const { w, h } = containerSize();
      const pivotX = e.clientX - rect.left;
      const pivotY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const res = applyZoomAtPoint(
        zoomRef.current * factor, pivotX, pivotY,
        zoomRef.current, offsetRef.current, w, h
      );
      commit(res.zoom, res.offset);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { w, h } = containerSize();
      const rect = el.getBoundingClientRect();

      if (e.touches.length === 1 && isDragging.current) {
        const dx = e.touches[0].clientX - pointerStart.current.x;
        const dy = e.touches[0].clientY - pointerStart.current.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          dragMoved.current = true;
        }
        if (!dragMoved.current) return;
        const nx = offsetAtStart.current.x + dx;
        const ny = offsetAtStart.current.y + dy;
        const clamped = clampOffset(nx, ny, zoomRef.current, w, h);
        offsetRef.current = clamped;
        setOffsetState({ ...clamped });
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const midX = (t0.clientX + t1.clientX) / 2 - rect.left;
        const midY = (t0.clientY + t1.clientY) / 2 - rect.top;
        const newZoom = pinchStart.current.zoom * (dist / pinchStart.current.dist);
        const res = applyZoomAtPoint(
          newZoom,
          pinchStart.current.midX, pinchStart.current.midY,
          pinchStart.current.zoom,
          { x: pinchStart.current.offX, y: pinchStart.current.offY },
          w, h
        );
        commit(res.zoom, res.offset);
        // Update mid for smooth pan-during-pinch
        pinchStart.current.midX = midX;
        pinchStart.current.midY = midY;
        pinchStart.current.dist = dist;
        pinchStart.current.zoom = zoomRef.current;
        pinchStart.current.offX = offsetRef.current.x;
        pinchStart.current.offY = offsetRef.current.y;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [commit, containerSize]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    isDragging.current = true;
    dragMoved.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    offsetAtStart.current = { ...offsetRef.current };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || e.pointerType === "touch") return;
    const { w, h } = containerSize();
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragMoved.current = true;
    }
    if (!dragMoved.current) return;
    const nx = offsetAtStart.current.x + dx;
    const ny = offsetAtStart.current.y + dy;
    const clamped = clampOffset(nx, ny, zoomRef.current, w, h);
    offsetRef.current = clamped;
    setOffsetState({ ...clamped });
  }, [containerSize]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    isDragging.current = false;
    setDragging(false);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();
    if (e.touches.length === 1) {
      isDragging.current = true;
      dragMoved.current = false;
      pointerStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      offsetAtStart.current = { ...offsetRef.current };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      pinchStart.current = {
        dist,
        midX: (t0.clientX + t1.clientX) / 2 - (rect?.left ?? 0),
        midY: (t0.clientY + t1.clientY) / 2 - (rect?.top ?? 0),
        zoom: zoomRef.current,
        offX: offsetRef.current.x,
        offY: offsetRef.current.y,
      };
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const zoomTo = useCallback((factor: number) => {
    const { w, h } = containerSize();
    const res = applyZoomAtPoint(
      zoomRef.current * factor, w / 2, h / 2,
      zoomRef.current, offsetRef.current, w, h
    );
    commit(res.zoom, res.offset);
  }, [commit, containerSize]);

  const zoomIn = useCallback(() => zoomTo(1.3), [zoomTo]);
  const zoomOut = useCallback(() => zoomTo(1 / 1.3), [zoomTo]);

  return {
    zoom,
    offset,
    dragging,
    dragMoved,
    containerRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onTouchStart, onTouchEnd },
    zoomIn,
    zoomOut,
  };
}
