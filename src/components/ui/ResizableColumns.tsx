"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface ResizableColumnsProps {
    children: React.ReactNode[];
    defaultWidths: number[]; // percentages, must sum to 100
    storageKey: string;
    minWidth?: number; // minimum width in px
    className?: string;
}

export function ResizableColumns({
    children,
    defaultWidths,
    storageKey,
    minWidth = 200,
    className = "",
}: ResizableColumnsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef<number | null>(null);
    const startXRef = useRef(0);
    const startWidthsRef = useRef<number[]>([]);

    // Load saved widths from localStorage or use defaults
    const [widths, setWidths] = useState<number[]>(() => {
        if (typeof window === "undefined") return defaultWidths;
        try {
            const saved = localStorage.getItem(`resize-${storageKey}`);
            if (saved) {
                const parsed = JSON.parse(saved) as number[];
                if (parsed.length === defaultWidths.length) return parsed;
            }
        } catch { /* ignore */ }
        return defaultWidths;
    });

    // Persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(`resize-${storageKey}`, JSON.stringify(widths));
        } catch { /* ignore */ }
    }, [widths, storageKey]);

    const handleMouseDown = useCallback(
        (dividerIndex: number, e: React.MouseEvent) => {
            e.preventDefault();
            draggingRef.current = dividerIndex;
            startXRef.current = e.clientX;
            startWidthsRef.current = [...widths];
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";

            const handleMouseMove = (moveEvent: MouseEvent) => {
                if (draggingRef.current === null || !containerRef.current) return;

                const containerWidth = containerRef.current.offsetWidth;
                const dx = moveEvent.clientX - startXRef.current;
                const dxPercent = (dx / containerWidth) * 100;

                const idx = draggingRef.current;
                const newWidths = [...startWidthsRef.current];

                const newLeft = newWidths[idx] + dxPercent;
                const newRight = newWidths[idx + 1] - dxPercent;

                // Enforce minimum widths
                const minPercent = (minWidth / containerWidth) * 100;
                if (newLeft < minPercent || newRight < minPercent) return;

                newWidths[idx] = newLeft;
                newWidths[idx + 1] = newRight;
                setWidths(newWidths);
            };

            const handleMouseUp = () => {
                draggingRef.current = null;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [widths, minWidth]
    );

    return (
        <div ref={containerRef} className={`flex h-full ${className}`}>
            {children.map((child, i) => (
                <React.Fragment key={i}>
                    <div
                        className="flex flex-col min-h-0 overflow-hidden"
                        style={{ width: `${widths[i]}%`, flexShrink: 0 }}
                    >
                        {child}
                    </div>
                    {i < children.length - 1 && (
                        <div
                            className="relative flex-shrink-0 w-1 group cursor-col-resize z-20"
                            onMouseDown={(e) => handleMouseDown(i, e)}
                        >
                            {/* Visual handle */}
                            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                                <div className="w-1 h-8 rounded-full bg-border group-hover:bg-accent group-active:bg-accent-light transition-colors" />
                            </div>
                            {/* Wider hit area */}
                            <div className="absolute inset-y-0 -left-2 -right-2" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
