"use client";

import type { PointerEvent } from "react";

import styles from "./vilet-mark.module.css";

export function ViletMark() {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty("--mark-tilt-x", `${-y * 9}deg`);
    event.currentTarget.style.setProperty("--mark-tilt-y", `${x * 12}deg`);
  }

  function resetTilt(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--mark-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--mark-tilt-y", "0deg");
  }

  return (
    <div
      aria-hidden="true"
      className={styles.scene}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className={styles.ambientGlow} />
      <div className={styles.tilt}>
        <div className={styles.spin}>
          <div className={`${styles.ribbon} ${styles.ribbonLight}`} />
          <div className={`${styles.ribbon} ${styles.ribbonAccent}`} />
        </div>
      </div>
    </div>
  );
}
