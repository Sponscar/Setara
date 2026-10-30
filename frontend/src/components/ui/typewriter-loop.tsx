"use client";

import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TypewriterLoopProps {
  LeadText?: string;
  morphingText?: string[];
  className?: string;
  interval?: number;
  transition?: any;
  LeadTextClassName?: string;
  morphingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
  staticColor?: "violet" | "blue" | "emerald" | "amber" | "rose" | "fuchsia" | "orange";
  darkGradientBackgroundLock?: boolean;
}

const TypewriterLoop = ({
  LeadText = "Design",
  morphingText = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 4000,
  LeadTextClassName,
  morphingTextClassName,
  backgroundClassName,
  cursorClassName,
  staticColor,
  darkGradientBackgroundLock = false,
}: TypewriterLoopProps) => {
  const [index, setIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const gradientColors = [
    "from-violet-400 to-violet-800 dark:from-violet-400 dark:to-violet-600",
    "from-blue-400 to-blue-800 dark:from-blue-400 dark:to-blue-600",
    "from-emerald-400 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600",
    "from-amber-400 to-amber-800 dark:from-amber-400 dark:to-amber-600",
    "from-rose-400 to-rose-800 dark:from-rose-400 dark:to-rose-600",
    "from-fuchsia-400 to-fuchsia-800 dark:from-fuchsia-400 dark:to-fuchsia-600",
  ];

  const backgroundColors = [
    "from-transparent via-purple-200/30 to-purple-200 dark:from-transparent dark:via-violet-950/30 dark:to-violet-950/60",
    "from-transparent via-blue-200/30 to-blue-200 dark:from-transparent dark:via-blue-950/30 dark:to-blue-950/60",
    "from-transparent via-emerald-200/30 to-emerald-200 dark:from-transparent dark:via-emerald-950/30 dark:to-emerald-950/60",
    "from-transparent via-amber-200/30 to-amber-200 dark:from-transparent dark:via-amber-950/30 dark:to-amber-950/60",
    "from-transparent via-rose-200/30 to-rose-200 dark:from-transparent dark:via-rose-950/30 dark:to-rose-950/60",
    "from-transparent via-fuchsia-200/30 to-fuchsia-200 dark:from-transparent dark:via-fuchsia-950/30 dark:to-fuchsia-950/60",
  ];

  const darkOnlyBackgroundColors = [
    "from-transparent via-violet-950/30 to-violet-950/60",
    "from-transparent via-blue-950/30 to-blue-950/60",
    "from-transparent via-emerald-950/30 to-emerald-950/60",
    "from-transparent via-amber-950/30 to-amber-950/60",
    "from-transparent via-rose-950/30 to-rose-950/60",
    "from-transparent via-fuchsia-950/30 to-fuchsia-950/60",
  ];

  const cursorColors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-fuchsia-500",
  ];

  const staticGradientMap = {
    violet: "from-violet-400 to-violet-800 dark:from-violet-400 dark:to-violet-600",
    blue: "from-blue-400 to-blue-800 dark:from-blue-400 dark:to-blue-600",
    emerald: "from-emerald-400 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600",
    amber: "from-amber-400 to-amber-800 dark:from-amber-400 dark:to-amber-600",
    rose: "from-rose-400 to-rose-800 dark:from-rose-400 dark:to-rose-600",
    fuchsia: "from-fuchsia-400 to-fuchsia-800 dark:from-fuchsia-400 dark:to-fuchsia-600",
    orange: "from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400",
  };

  const staticBackgroundMap = {
    violet: "from-transparent via-purple-200/30 to-purple-200 dark:from-transparent dark:via-violet-950/30 dark:to-violet-950/60",
    blue: "from-transparent via-blue-200/30 to-blue-200 dark:from-transparent dark:via-blue-950/30 dark:to-blue-950/60",
    emerald: "from-transparent via-emerald-200/30 to-emerald-200 dark:from-transparent dark:via-emerald-950/30 dark:to-emerald-950/60",
    amber: "from-transparent via-amber-200/30 to-amber-200 dark:from-transparent dark:via-amber-950/30 dark:to-amber-950/60",
    rose: "from-transparent via-rose-200/30 to-rose-200 dark:from-transparent dark:via-rose-950/30 dark:to-rose-950/60",
    fuchsia: "from-transparent via-fuchsia-200/30 to-fuchsia-200 dark:from-transparent dark:via-fuchsia-950/30 dark:to-fuchsia-950/60",
    orange: "from-transparent via-orange-200/30 to-orange-200 dark:from-transparent dark:via-orange-950/30 dark:to-orange-950/60",
  };

  const staticDarkOnlyBackgroundMap = {
    violet: "from-transparent via-violet-950/30 to-violet-950/60",
    blue: "from-transparent via-blue-950/30 to-blue-950/60",
    emerald: "from-transparent via-emerald-950/30 to-emerald-950/60",
    amber: "from-transparent via-amber-950/30 to-amber-950/60",
    rose: "from-transparent via-rose-950/30 to-rose-950/60",
    fuchsia: "from-transparent via-fuchsia-950/30 to-fuchsia-950/60",
    orange: "from-transparent via-orange-950/30 to-orange-950/60",
  };

  const staticCursorMap = {
    violet: "bg-violet-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    fuchsia: "bg-fuchsia-500",
    orange: "bg-orange-500",
  };

  const getGradientColor = () => {
    if (staticColor && staticGradientMap[staticColor]) {
      return staticGradientMap[staticColor];
    }
    return gradientColors[colorIndex % gradientColors.length];
  };

  const getBackgroundColor = () => {
    if (darkGradientBackgroundLock) {
      if (staticColor && staticDarkOnlyBackgroundMap[staticColor]) {
        return staticDarkOnlyBackgroundMap[staticColor];
      }
      return darkOnlyBackgroundColors[colorIndex % darkOnlyBackgroundColors.length];
    }

    if (staticColor && staticBackgroundMap[staticColor]) {
      return staticBackgroundMap[staticColor];
    }
    return backgroundColors[colorIndex % backgroundColors.length];
  };

  const getCursorColor = () => {
    if (staticColor && staticCursorMap[staticColor]) {
      return staticCursorMap[staticColor];
    }
    return cursorColors[colorIndex % cursorColors.length];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % morphingText.length);
        if (!staticColor) {
          setColorIndex((prev) => (prev + 1) % gradientColors.length);
        }
        setIsVisible(true);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [morphingText.length, interval, staticColor, gradientColors.length]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start w-fit gap-x-2 md:gap-x-3 gap-y-1 text-3xl md:text-7xl font-medium tracking-tight",
        className
      )}
    >
      <span
        className={cn("whitespace-nowrap text-foreground", LeadTextClassName)}
      >
        {LeadText}
      </span>
      <div className="relative flex items-center">
        <div
          className={cn(
            "overflow-hidden whitespace-nowrap relative transition-all duration-300 ease-in-out transform",
            isVisible
              ? "opacity-100 translate-y-0 scale-100 max-w-[600px]"
              : "opacity-0 -translate-y-1 scale-95 max-w-0"
          )}
        >
          {/* Background gradient box */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r pointer-events-none",
              getBackgroundColor(),
              backgroundClassName
            )}
          />

          <span
            className={cn(
              "relative bg-clip-text text-transparent bg-gradient-to-r pr-1 inline-block",
              getGradientColor(),
              morphingTextClassName
            )}
          >
            {morphingText[index]}
          </span>
        </div>

        {/* Blinking Cursor Line */}
        <div
          className={cn(
            "w-[3px] md:w-[4px] h-[1.10em] sm:h-[1em] animate-pulse rounded-full transition-colors duration-300 ml-0.5",
            getCursorColor(),
            cursorClassName
          )}
        />
      </div>
    </div>
  );
};

export default TypewriterLoop;
