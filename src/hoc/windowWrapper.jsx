import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import useWindowStore from '#store/window.js';

gsap.registerPlugin(Draggable);

const MIN_WIDTH = 360;
const MIN_HEIGHT = 240;

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = React.memo((props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, isMinimized, isMaximized, zIndex } = windows[windowKey];

    const ref = useRef(null);
    const dragRef = useRef(null);
    const resizeState = useRef({
      active: false,
      dir: null,
      startX: 0,
      startY: 0,
      startW: 0,
      startH: 0,
    });

    /* ---------- OPEN / CLOSE ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      if (isOpen) {
        gsap.set(el, { display: 'block', willChange: 'transform', force3D: true });
        gsap.fromTo(
          el,
          { scale: 0.85, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
        );
      } else {
        gsap.to(el, {
          scale: 0.8,
          opacity: 0,
          duration: 0.25,
          onComplete: () => gsap.set(el, { display: 'none' }),
        });
      }
    }, [isOpen]);

    /* ---------- MINIMIZE ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      gsap.to(el, {
        scale: isMinimized ? 0.6 : 1,
        opacity: isMinimized ? 0 : 1,
        y: isMinimized ? 100 : 0,
        duration: 0.3,
        pointerEvents: isMinimized ? 'none' : 'auto',
        ease: 'power2.out',
      });
    }, [isMinimized]);

    /* ---------- DRAG ---------- */
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen || isMaximized) return;

      // Kill old draggable
      dragRef.current?.kill();

      dragRef.current = Draggable.create(el, {
        type: 'x,y', // GPU friendly
        handle: '#window-header',
        inertia: false,
        autoScroll: false,
        onPress: () => focusWindow(windowKey),
      })[0];

      return () => dragRef.current?.kill();
    }, [isOpen, isMaximized]);

    /* ---------- MAXIMIZE ---------- */
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (isMaximized) {
        dragRef.current?.kill();
        gsap.set(el, { x: 0, y: 0, width: '100vw', height: '100vh' });
      } else {
        gsap.set(el, { width: '', height: '' });
      }
    }, [isMaximized]);

    /* ---------- RESIZE ---------- */
    const startResize = (e, dir) => {
      if (isMaximized) return;
      const el = ref.current;
      if (!el) return;

      focusWindow(windowKey);

      resizeState.current = {
        active: true,
        dir,
        startX: e.clientX,
        startY: e.clientY,
        startW: el.offsetWidth,
        startH: el.offsetHeight,
      };

      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    };

    const resize = (e) => {
      const state = resizeState.current;
      if (!state.active) return;
      const el = ref.current;
      if (!el) return;

      if (state.dir.includes('right')) {
        const w = Math.max(MIN_WIDTH, state.startW + (e.clientX - state.startX));
        el.style.width = `${w}px`;
      }

      if (state.dir.includes('bottom')) {
        const h = Math.max(MIN_HEIGHT, state.startH + (e.clientY - state.startY));
        el.style.height = `${h}px`;
      }
    };

    const stopResize = () => {
      resizeState.current.active = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };

    return (
      <section
        ref={ref}
        id={windowKey}
        className="absolute window"
        style={{ zIndex, willChange: 'transform' }}
        onMouseDown={() => focusWindow(windowKey)}
      >
        <Component {...props} />

        {!isMaximized && (
          <>
            <span className="resize-handle right" onMouseDown={(e) => startResize(e, 'right')} />
            <span className="resize-handle bottom" onMouseDown={(e) => startResize(e, 'bottom')} />
            <span className="resize-handle corner" onMouseDown={(e) => startResize(e, 'right bottom')} />
          </>
        )}
      </section>
    );
  });

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
};

export default WindowWrapper;
