import { useState, useRef, useCallback, useEffect } from "react";

export const WORLD_W = 1600;
export const WORLD_H = 900;
const MAX_ZOOM = 3.0;
const DRAG_THRESHOLD = 5;
const ZOOM_FACTOR = 1.14;

function getContainerRect(el: HTMLElement) {
  return { cw: el.clientWidth, ch: el.clientHeight };
}

/** Returns clamped/centered offset so the scaled world stays within container */
function clampOffset(x: number, y: number, zoom: number, cw: number, ch: number) {
  const sw = WORLD_W * zoom;
  const sh = WORLD_H * zoom;
  const ox = sw <= cw ? (cw - sw) / 2 : Math.min(0, Math.max(cw - sw, x));
  const oy = sh <= ch ? (ch - sh) / 2 : Math.min(0, Math.max(ch - sh, y));
  return { x: ox, y: oy };
}

/** Initial zoom that fits the entire world inside the container */
function fitZoom(cw: number, ch: number) {
  return Math.min(cw / WORLD_W, ch / WORLD_H);
}

function getInitialState() {
  const cw = window.innerWidth;
  const ch = Math.max(1, window.innerHeight - 48);
  const zoom = fitZoom(cw, ch);
  const sw = WORLD_W * zoom;
  const sh = WORLD_H * zoom;
  return { zoom, offset: { x: (cw - sw) / 2, y: (ch - sh) / 2 } };
}

function applyZoomAtPoint(
  newZoom: number, pivotX: number, pivotY: number,
  curZoom: number, curOffset: { x: number; y: number },
  cw: number, ch: number,
  minZoom: number
) {
  const clamped = Math.min(MAX_ZOOM, Math.max(minZoom, newZoom));
  const worldX = (pivotX - curOffset.x) / curZoom;
  const worldY = (pivotY - curOffset.y) / curZoom;
  const nx = pivotX - worldX * clamped;
  const ny = pivotY - worldY * clamped;
  return { zoom: clamped, offset: clampOffset(nx, ny, clamped, cw, ch) };
}

export function useMapControls() {
  const initial = getInitialState();
  const [zoom, setZoomState] = useState(initial.zoom);
  const [offset, setOffsetState] = useState(initial.offset);
  const [dragging, setDragging] = useState(false);

  const minZoomRef = useRef(initial.zoom);
  const zoomRef = useRef(initial.zoom);
  const offsetRef = useRef(initial.offset);
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
    setOffsetState({ ...o });
  }, []);

  const getSize = useCallback(() => {
    const el = containerRef.current;
    if (el) return getContainerRect(el);
    return { cw: window.innerWidth, ch: Math.max(1, window.innerHeight - 48) };
  }, []);

  // Re-fit on window resize
  useEffect(() => {
    const onResize = () => {
      const { cw, ch } = getSize();
      const mz = fitZoom(cw, ch);
      minZoomRef.current = mz;
      const newZoom = Math.max(mz, zoomRef.current);
      const clamped = clampOffset(offsetRef.current.x, offsetRef.current.y, newZoom, cw, ch);
      commit(newZoom, clamped);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [commit, getSize]);

  // Wheel zoom + touchmove (must be non-passive)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { cw, ch } = getContainerRect(el);
      const rect = el.getBoundingClientRect();
      const pivotX = e.clientX - rect.left;
      const pivotY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const res = applyZoomAtPoint(
        zoomRef.current * factor, pivotX, pivotY,
        zoomRef.current, offsetRef.current, cw, ch, minZoomRef.current
      );
      commit(res.zoom, res.offset);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { cw, ch } = getContainerRect(el);
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
        setOffsetState(clampOffset(nx, ny, zoomRef.current, cw, ch));
        offsetRef.current = clampOffset(nx, ny, zoomRef.current, cw, ch);
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
          pinchStart.current.zoom, { x: pinchStart.current.offX, y: pinchStart.current.offY },
          cw, ch, minZoomRef.current
        );
        commit(res.zoom, res.offset);
        pinchStart.current = {
          dist, midX, midY,
          zoom: zoomRef.current,
          offX: offsetRef.current.x, offY: offsetRef.current.y,
        };
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [commit]);

  const pointerIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    isDragging.current = true;
    dragMoved.current = false;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    offsetAtStart.current = { ...offsetRef.current };
    pointerIdRef.current = e.pointerId;
    // Do NOT setPointerCapture yet — wait until drag threshold is exceeded
    // so that simple clicks on markers still fire normally.
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || e.pointerType === "touch") return;
    const { cw, ch } = getSize();
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      if (!dragMoved.current) {
        dragMoved.current = true;
        setDragging(true);
        // Capture pointer only once drag starts — keeps clicks on markers working
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
      }
    }
    if (!dragMoved.current) return;
    const clamped = clampOffset(
      offsetAtStart.current.x + dx,
      offsetAtStart.current.y + dy,
      zoomRef.current, cw, ch
    );
    offsetRef.current = clamped;
    setOffsetState({ ...clamped });
  }, [getSize]);

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
        offX: offsetRef.current.x, offY: offsetRef.current.y,
      };
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const zoomTo = useCallback((factor: number) => {
    const { cw, ch } = getSize();
    const res = applyZoomAtPoint(
      zoomRef.current * factor, cw / 2, ch / 2,
      zoomRef.current, offsetRef.current, cw, ch, minZoomRef.current
    );
    commit(res.zoom, res.offset);
  }, [commit, getSize]);

  const zoomIn = useCallback(() => zoomTo(1.3), [zoomTo]);
  const zoomOut = useCallback(() => zoomTo(1 / 1.3), [zoomTo]);
  const resetView = useCallback(() => {
    const { cw, ch } = getSize();
    const mz = fitZoom(cw, ch);
    const sw = WORLD_W * mz;
    const sh = WORLD_H * mz;
    commit(mz, { x: (cw - sw) / 2, y: (ch - sh) / 2 });
  }, [commit, getSize]);

  return {
    zoom,
    offset,
    dragging,
    dragMoved,
    containerRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onTouchStart, onTouchEnd },
    zoomIn,
    zoomOut,
    resetView,
    minZoom: minZoomRef.current,
  };
}
