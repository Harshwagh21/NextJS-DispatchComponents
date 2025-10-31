"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/map/slider";
import { Play, Pause, Timer, RotateCcw } from "lucide-react";

const MAX_SECONDS = 86400;
const HOURS = 24;
const SLIDER_STEP = 1;
const SLIDER_WIDTH = 636; // px, for a smaller, centered bar

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${h}:${m}:${s}`;
}

const TimelineScrubber: React.FC = () => {
    const [value, setValue] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);

    // Playback: advance 10s per second
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (playing) {
            interval = setInterval(() => {
                setValue((prev) => (prev + 59 <= MAX_SECONDS ? prev + 59 : MAX_SECONDS));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [playing]);

    // Manual slider change
    const handleSliderChange = (val: number[]) => {
        setValue(val[0]);
    };

    // Hours for ticks
    const hours = useMemo(() => Array.from({ length: HOURS + 1 }, (_, i) => i), []);

    return (
        <div className="fixed bottom-10 z-50 w-full flex flex-col items-center pointer-events-none select-none">
            {/* Pill above timeline */}
            <div className="flex items-center justify-center mb-1 w-full">
                <div className="flex items-center gap-3 bg-neutral-900/90 border border-white/10 rounded-full shadow px-3 py-1 pointer-events-auto mx-auto">
                    <button
                        className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors focus:outline-none  ${playing ? 'hover:bg-orange-600 focus:ring-2 focus:ring-primary/60' : 'bg-transparent hover:bg-neutral-800'}`}
                        aria-label={playing ? "Pause timeline" : "Play timeline"}
                        onClick={() => setPlaying((p) => !p)}
                        tabIndex={0}
                        type="button"
                    >
                        {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                    </button>
                    <span className="text-base font-mono font-semibold text-white tracking-widest" style={{ letterSpacing: '0.12em' }}>{formatTime(value)}</span>
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                        <Timer className="w-4 h-4" /> 1
                    </span>
                    <span className="flex items-center gap-1 text-white/80 text-xs cursor-pointer" onClick={() => setValue(0)}>
                        <RotateCcw className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
            {/* Timeline bar and hour ticks, fixed width, centered */}
            <div className="w-full flex flex-col items-center">
                <div className="relative mx-auto" style={{ width: SLIDER_WIDTH }}>
                    {/* Slider */}
                    <Slider
                        value={[value]}
                        onValueChange={handleSliderChange}
                        min={0}
                        max={MAX_SECONDS}
                        step={SLIDER_STEP}
                        aria-label="Timeline Scrubber"
                        className="w-full h-5 z-100 cursor-pointer focus:outline-none"
                        thumbClassName="bg-gray-500 border border-white shadow-lg w-2 h-6 rounded-[2px] -mt-2 cursor-pointer transition-transform active:scale-110"
                        trackClassName="bg-gray-500/40 h-1 rounded-full"
                        rangeClassName="bg-gray-500 h-1 rounded-full"
                    />
                    {/* Hour numbers as ticks below the bar */}
                    <div className="absolute left-0 right-0 top-5 flex flex-row justify-between items-center w-full px-0">
                        {hours.map((h) => (
                            <span key={h} className="text-[10px] text-foreground font-mono" style={{ minWidth: 12, textAlign: 'center' }}>{h.toString().padStart(2, "0")}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineScrubber; 