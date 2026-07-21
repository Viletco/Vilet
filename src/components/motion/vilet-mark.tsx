"use client";

import type { PointerEvent } from "react";
import Image from "next/image";

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
        <div className={styles.motion}>
          <div className={styles.artwork}>
            <Image
              src="/brand/vilet-mark.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 32vw, 70vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
