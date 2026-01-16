"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useAnimationFrame, useTransform } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset) {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

function generateGibberishPreservingSpaces(original, charset) {
  if (!original) return "";
  let result = "";
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result += ch === " " ? " " : generateRandomCharacter(charset);
  }
  return result;
}

export const EncryptedShinyText = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  speed = 2,
  spread = 90, // Changed to 90deg to match your CSS request
  direction = 'left',
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [revealCount, setRevealCount] = useState(0);
  const scrambleCharsRef = useRef(text ? generateGibberishPreservingSpaces(text, charset).split("") : []);
  const scrambleAnimationFrameRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastFlipTimeRef = useRef(0);

  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);

  useEffect(() => {
    if (!isInView || !text) return;

    const initial = generateGibberishPreservingSpaces(text, charset);
    scrambleCharsRef.current = initial.split("");
    startTimeRef.current = performance.now();
    lastFlipTimeRef.current = startTimeRef.current;
    setRevealCount(0);

    const updateScramble = (now) => {
      const elapsedMs = now - startTimeRef.current;
      const totalLength = text.length;
      const currentRevealCount = Math.min(totalLength, Math.floor(elapsedMs / Math.max(1, revealDelayMs)));

      setRevealCount(currentRevealCount);

      if (currentRevealCount >= totalLength) return;

      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let i = 0; i < totalLength; i++) {
          if (i >= currentRevealCount) {
            scrambleCharsRef.current[i] = text[i] === " " ? " " : generateRandomCharacter(charset);
          }
        }
        lastFlipTimeRef.current = now;
      }
      scrambleAnimationFrameRef.current = requestAnimationFrame(updateScramble);
    };

    scrambleAnimationFrameRef.current = requestAnimationFrame(updateScramble);
    return () => {
      if (scrambleAnimationFrameRef.current) cancelAnimationFrame(scrambleAnimationFrameRef.current);
    };
  }, [isInView, text, revealDelayMs, charset, flipDelayMs]);

  useAnimationFrame((time) => {
    if (!isInView) return;
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    const animationDuration = speed * 1000;
    const cycleDuration = animationDuration + (delay * 1000);
    const cycleTime = elapsedRef.current % cycleDuration;

    if (cycleTime < animationDuration) {
      const p = (cycleTime / animationDuration) * 100;
      progress.set(directionRef.current === 1 ? p : 100 - p);
    } else {
      progress.set(directionRef.current === 1 ? 100 : 0);
    }
  });

  const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`);

  /**
   * Updated Gradient Styles based on your request:
   * Base: rgba(255, 255, 255, 0.5)
   * Shine: linear-gradient with 0% -> 100% -> 0% opacity
   */
  const gradientStyle = {
    // We use the 0.5 opacity as the "outer" colors and 1.0 as the center shine
    backgroundImage: `linear-gradient(${spread}deg, 
      rgba(255, 255, 255, 0.5) 0%, 
      rgba(255, 255, 255, 0.5) 40%, 
      rgba(255, 255, 255, 1) 50%, 
      rgba(255, 255, 255, 0.5) 60%, 
      rgba(255, 255, 255, 0.5) 100%
    )`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  if (!text) return null;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ ...gradientStyle, backgroundPosition }}
      aria-label={text}
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed 
            ? char 
            : (scrambleCharsRef.current[index] ?? char);

        return (
          <span key={index}>
            {displayChar === " " ? "\u00A0" : displayChar}
          </span>
        );
      })}
    </motion.span>
  );
};

export default EncryptedShinyText;