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

    let disposed = false;
    let app: any;
    let model: any;
    let idleTimer: ReturnType<typeof setInterval> | null = null;
    let targetY = Math.min(window.innerHeight - 360, 140);
    let currentY = targetY;
    let targetX = Math.max(12, window.innerWidth - 300);
    let currentX = targetX;

    // mouse tracking state
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

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
          width: 420,
          height: 560,
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

        let modelScale = 0.32;
        if (Number.isFinite(model.width) && Number.isFinite(model.height) && model.width > 0 && model.height > 0) {
          modelScale = Math.min(420 / model.width, 560 / model.height) * 0.92;
        }

        model.scale.set(modelScale);
        if (model.anchor?.set) {
          model.anchor.set(0.5, 1);
        }
        model.x = 210;
        model.y = 540;

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
          model.scale.set(modelScale * breathe);

          if (!reduced) {
            currentY += (targetY - currentY) * 0.08;
            currentX += (targetX - currentX) * 0.07;
          } else {
            currentY = targetY;
            currentX = targetX;
          }

          shellRef.current.style.transform = `translate3d(${currentX + floatX}px, ${currentY + floatY}px, 0)`;

          // Mouse tracking — make eyes/head follow cursor
          if (!reduced && model.internalModel?.coreModel) {
            const core = model.internalModel.coreModel;
            const shellRect = shellRef.current.getBoundingClientRect();
            const centerX = shellRect.left + shellRect.width / 2;
            const centerY = shellRect.top + shellRect.height * 0.3;

            // Normalize to -1..1 range
            const dx = (mouseX - centerX) / (window.innerWidth / 2);
            const dy = (mouseY - centerY) / (window.innerHeight / 2);
            const clampedX = Math.max(-1, Math.min(1, dx));
            const clampedY = Math.max(-1, Math.min(1, dy));

            // Apply to model parameters (smooth lerp)
            const setParam = (id: string, target: number, speed: number) => {
              const idx = core.getParameterIndex(id);
              if (idx < 0) return;
              const current = core.getParameterValue(idx);
              core.setParameterValue(idx, current + (target - current) * speed);
            };

            setParam("ParamAngleX", clampedX * 30, 0.08);
            setParam("ParamAngleY", clampedY * -15, 0.08);
            setParam("ParamAngleZ", clampedX * -8, 0.05);
            setParam("ParamBodyAngleX", clampedX * 8, 0.06);
            setParam("ParamBodyAngleY", clampedY * -4, 0.06);
            setParam("ParamEyeBallX", clampedX * 0.8, 0.12);
            setParam("ParamEyeBallY", clampedY * -0.8, 0.12);
          }
        });

        const onScroll = () => {
          targetY = Math.max(8, Math.min(window.innerHeight - 600, 48 + window.scrollY * 0.06));
          targetX = Math.max(8, window.innerWidth - 450);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
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
    <div className="hiyori-shell" ref={shellRef} aria-hidden="true">
      {/* Loading pulse shown while model assembles */}
      {!live2dReady && !loadFailed && (
        <div className="hiyori-loader">
          <div className="hiyori-loader-ring" />
          <span>Loading</span>
        </div>
      )}

      {/* Canvas is invisible until live2dReady flips */}
      <div
        className={`hiyori-canvas ${live2dReady ? "hiyori-canvas--visible" : "hiyori-canvas--hidden"}`}
        ref={canvasRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {loadFailed && (
        <div className="hiyori-fallback hiyori-fallback--overlay">
          <img src="/Hiyori.2048/texture_00.png" alt="Hiyori" width={330} height={460} />
        </div>
      )}

      <p>Hiyori</p>
    </div>
  );
}
