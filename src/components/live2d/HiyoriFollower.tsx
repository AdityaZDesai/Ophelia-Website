"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function HiyoriFollower() {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [live2dReady, setLive2dReady] = useState(false);
  const modelRef = useRef<any>(null);
  const appRef = useRef<any>(null);

  // Click handler — triggers TapBody motion + sparkle burst
  const handleClick = useCallback((e: React.MouseEvent) => {
    const model = modelRef.current;
    if (!model) return;
    try {
      model.motion("TapBody");
    } catch {
      // fallback to a random idle if TapBody fails
      try { model.motion("Idle"); } catch { /* no-op */ }
    }

    // spawn sparkle particles at click position
    const shell = shellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < 6; i++) {
      const spark = document.createElement("span");
      spark.className = "hiyori-sparkle";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      spark.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      shell.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove());
    }
  }, []);

  // Double-click — triggers excitement (rapid scale bounce + special motion)
  const handleDoubleClick = useCallback(() => {
    const model = modelRef.current;
    if (!model) return;
    // play TapBody for reaction, then do a little bounce
    try { model.motion("TapBody"); } catch { /* no-op */ }
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.classList.add("hiyori-bounce");
      setTimeout(() => canvas.classList.remove("hiyori-bounce"), 600);
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resolveLayout = () => {
      const mobile = window.innerWidth <= 680;
      if (mobile) {
        return { mobile: true, width: 160, height: 220, scale: 0.15, floorOffset: 4 };
      }
      if (window.innerWidth <= 900) {
        return { mobile: false, width: 280, height: 380, scale: 0.24, floorOffset: 12 };
      }
      return { mobile: false, width: 350, height: 470, scale: 0.30, floorOffset: 16 };
    };

    let layout = resolveLayout();

    let disposed = false;
    let app: any;
    let model: any;
    let idleTimer: ReturnType<typeof setInterval> | null = null;
    let targetY = Math.max(8, window.innerHeight - layout.height - (layout.mobile ? 14 : 20));
    let currentY = targetY;
    let targetX = Math.max(8, window.innerWidth - layout.width - (layout.mobile ? 10 : 24));
    let currentX = targetX;
    let baseScale = 0.32;

    // mouse tracking state
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const updateTargets = () => {
      if (layout.mobile) {
        targetY = Math.max(8, window.innerHeight - layout.height - 14);
        targetX = Math.max(8, window.innerWidth - layout.width - 10);
        return;
      }

      targetY = Math.max(8, Math.min(window.innerHeight - layout.height - 12, 48 + window.scrollY * 0.06));
      targetX = Math.max(8, window.innerWidth - layout.width - (window.innerWidth <= 900 ? 20 : 24));
    };

    const placeModel = () => {
      if (!model) {
        return;
      }

      // Calculate scale to fit model within canvas with some padding
      const naturalW = model.width / (model.scale?.x || 1);
      const naturalH = model.height / (model.scale?.y || 1);
      if (naturalW > 0 && naturalH > 0) {
        baseScale = Math.min(layout.width / naturalW, layout.height / naturalH) * 0.88;
      } else {
        baseScale = layout.scale;
      }

      model.scale.set(baseScale);

      if (model.anchor?.set) {
        model.anchor.set(0.5, 1);
        model.x = layout.width * 0.5;
        model.y = layout.height - layout.floorOffset;
        return;
      }

      model.x = (layout.width - model.width) * 0.5;
      model.y = layout.height - model.height;
    };

    const applyLayout = () => {
      layout = resolveLayout();

      if (canvasRef.current) {
        canvasRef.current.style.width = `${layout.width}px`;
        canvasRef.current.style.height = `${layout.height}px`;
      }

      if (app?.renderer?.resize) {
        app.renderer.resize(layout.width, layout.height);
      }

      placeModel();
      updateTargets();
    };

    const ensureCubismCore = async () => {
      if ((window as Window & { Live2DCubismCore?: unknown }).Live2DCubismCore) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>("script[data-cubism-core='true']");

        if (existing) {
          if ((window as Window & { Live2DCubismCore?: unknown }).Live2DCubismCore) {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load Cubism core runtime.")), {
            once: true,
          });
          return;
        }

        const script = document.createElement("script");
        script.src = "/live2dcubismcore.min.js";
        script.async = true;
        script.dataset.cubismCore = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Cubism core runtime."));
        document.head.appendChild(script);
      });
    };

    const mount = async () => {
      try {
        await ensureCubismCore();

        const PIXI = await import("pixi.js");
        (globalThis as { PIXI?: unknown }).PIXI = PIXI;
        const { Live2DModel } = await import("pixi-live2d-display/cubism4");

        if (disposed || !canvasRef.current || !shellRef.current) {
          return;
        }

        app = new PIXI.Application({
          width: layout.width,
          height: layout.height,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
        });
        appRef.current = app;

        canvasRef.current.replaceChildren();
        canvasRef.current.appendChild(app.view as HTMLCanvasElement);

        model = await Live2DModel.from("/Hiyori.model3.json", { autoInteract: false });
        if (disposed) {
          return;
        }

        app.stage.addChild(model);
        modelRef.current = model;
        applyLayout();

        // Model is fully assembled — reveal it
        setLive2dReady(true);

        const runIdle = () => {
          try {
            model.motion("Idle");
          } catch {
            // no-op
          }
        };

        runIdle();
        idleTimer = setInterval(runIdle, 8000);

        app.ticker.add(() => {
          if (!shellRef.current) {
            return;
          }

          // Floating animation
          const floatY = Math.sin(performance.now() / 650) * 4;
          const floatX = Math.cos(performance.now() / 1100) * 3;

          // Gentle breathing scale pulse
          const breathe = 1 + Math.sin(performance.now() / 2000) * 0.006;
          model.scale.set(baseScale * breathe);

          if (!reduced && !layout.mobile) {
            currentY += (targetY - currentY) * 0.08;
            currentX += (targetX - currentX) * 0.07;
          } else {
            currentY = targetY;
            currentX = targetX;
          }

          shellRef.current.style.transform = `translate3d(${currentX + (layout.mobile ? 0 : floatX)}px, ${currentY + (layout.mobile ? 0 : floatY)}px, 0)`;

          // Mouse tracking — make eyes/head follow cursor
          if (!reduced && model.internalModel) {
            try {
              const mgr = model.internalModel.coreModel;
              const shellRect = shellRef.current.getBoundingClientRect();
              const centerX = shellRect.left + shellRect.width / 2;
              const centerY = shellRect.top + shellRect.height * 0.3;

              const dx = (mouseX - centerX) / (window.innerWidth / 2);
              const dy = (mouseY - centerY) / (window.innerHeight / 2);
              const clampedX = Math.max(-1, Math.min(1, dx));
              const clampedY = Math.max(-1, Math.min(1, dy));

              const setParam = (id: string, target: number, speed: number) => {
                const idx = mgr._parameterIds?.indexOf(id) ?? -1;
                if (idx < 0 || !mgr._parameterValues) return;
                const current = mgr._parameterValues[idx];
                mgr._parameterValues[idx] = current + (target - current) * speed;
              };

              setParam("ParamAngleX", clampedX * 30, 0.08);
              setParam("ParamAngleY", clampedY * -15, 0.08);
              setParam("ParamAngleZ", clampedX * -8, 0.05);
              setParam("ParamBodyAngleX", clampedX * 8, 0.06);
              setParam("ParamBodyAngleY", clampedY * -4, 0.06);
              setParam("ParamEyeBallX", clampedX * 0.8, 0.12);
              setParam("ParamEyeBallY", clampedY * -0.8, 0.12);
            } catch {
              // coreModel API not available — skip tracking
            }
          }
        });

        const onScroll = () => {
          if (!layout.mobile) {
            updateTargets();
          }
        };

        applyLayout();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", applyLayout);

        return () => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", applyLayout);
        };
      } catch (error) {
        setLoadFailed(true);
        console.error("[HiyoriFollower] Failed to initialize Live2D model", error);
      }
    };

    let unsubscribe: (() => void) | undefined;
    mount().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      disposed = true;
      setLive2dReady(false);
      window.removeEventListener("mousemove", onMouseMove);
      if (unsubscribe) {
        unsubscribe();
      }
      if (idleTimer) {
        clearInterval(idleTimer);
      }
      if (app) {
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      }
      modelRef.current = null;
      appRef.current = null;
    };
  }, []);

  return (
    <div
      className="hiyori-shell"
      ref={shellRef}
      aria-hidden="true"
      style={{ visibility: live2dReady ? "visible" : "hidden" }}
    >
      <div
        className="hiyori-canvas"
        ref={canvasRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />
      <p>Hiyori</p>
    </div>
  );
}
