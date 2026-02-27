"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  name: string;
  className?: string;
}

// Generate random waveform bar heights for visualization
const generateWaveformBars = (count: number) => {
  return Array.from({ length: count }, () => Math.random() * 0.6 + 0.2);
};

export function AudioPlayer({ src, name, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Generate waveform bars only on client side to avoid hydration mismatch
  useEffect(() => {
    setWaveformBars(generateWaveformBars(40));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let animationFrameId: number | null = null;

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Use requestAnimationFrame for smooth updates when playing
      const animate = () => {
        if (audio && !audio.paused && !audio.ended) {
          setCurrentTime(audio.currentTime || 0);
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Check duration immediately if already loaded
    if (audio.duration && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }

    // Time updates (fallback for when not using requestAnimationFrame)
    audio.addEventListener("timeupdate", updateTime);

    // Duration events
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", updateDuration);
    audio.addEventListener("loadeddata", updateDuration);

    // Playback state
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
      audio.removeEventListener("loadeddata", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const waveform = waveformRef.current;
    if (!audio || !waveform || !duration) return;

    const rect = waveform.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 && isFinite(duration) ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const exactBarPosition = waveformBars.length > 0 ? progress * waveformBars.length : 0;
  const fullBars = Math.floor(exactBarPosition);
  const partialBarProgress = exactBarPosition - fullBars;

  return (
    <div className={`glass-card p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex flex-col gap-3">
        {/* Name and Time */}
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm text-foreground truncate">{name}</p>
          <span className="text-xs text-text-muted ml-2 flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Waveform and Play Button */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink text-white flex items-center justify-center hover:shadow-lg hover:shadow-neon-purple/30 transition-all"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Waveform Visualization */}
          <div
            ref={waveformRef}
            onClick={handleWaveformClick}
            className="flex-1 flex items-end gap-0.5 h-12 cursor-pointer"
          >
            {waveformBars.length > 0 ? (
              waveformBars.map((height, index) => {
                const barHeight = height * 100;
                let fillOpacity = 0;

                if (index < fullBars) {
                  fillOpacity = 1;
                } else if (index === fullBars && partialBarProgress > 0) {
                  fillOpacity = partialBarProgress;
                }

                return (
                  <div
                    key={index}
                    className="flex-1 rounded-full relative overflow-hidden"
                    style={{
                      height: `${barHeight}%`,
                      minHeight: "6px",
                    }}
                  >
                    {/* Background (unfilled) */}
                    <div
                      className="absolute inset-0 bg-white/10 rounded-full"
                      style={{
                        opacity: 1 - fillOpacity,
                      }}
                    />
                    {/* Foreground (filled) - gradient */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-t from-neon-purple to-neon-pink"
                      style={{
                        opacity: fillOpacity,
                      }}
                    />
                  </div>
                );
              })
            ) : (
              // Placeholder bars during SSR/initial render
              Array.from({ length: 40 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-full bg-white/10"
                  style={{
                    height: "50%",
                    minHeight: "6px",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
