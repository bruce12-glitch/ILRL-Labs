import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface HeroWireframeHandsProps {
  motionEnabled: boolean;
}

/**
 * Unboxed, seamlessly blended monochrome wireframe hands convergence
 * using two completely separate, pre-isolated hand images:
 * - /assets/aistudio/wf_hand_upper.png (Upper-Right Hand)
 * - /assets/aistudio/wf_hand_lower.png (Lower-Left Hand)
 *
 * Serves as the dimmed, realistic background for the Future Goals (#future-goals)
 * section. Each hand translates as an intact, independent hand from the outer
 * edges until the fingertips meet at the center.
 */
export function HeroWireframeHands({ motionEnabled }: HeroWireframeHandsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { amount: 0.22, once: false });

  const upperUrl = `${import.meta.env.BASE_URL}assets/aistudio/wf_hand_upper.png`;
  const lowerUrl = `${import.meta.env.BASE_URL}assets/aistudio/wf_hand_lower.png`;

  const shouldConnect = !motionEnabled || isInView;

  return (
    <div
      ref={stageRef}
      className="wireframe-goals-bg"
      data-testid="goals-wireframe-hands"
      aria-hidden="true"
    >
      <div className="wireframe-seamless-stage">
        {/* Upper-Right Wireframe Hand — completely separate hand image gliding down-left */}
        <motion.img
          src={upperUrl}
          alt=""
          className="wf-isolated-hand wf-isolated-upper"
          initial={
            motionEnabled
              ? { x: 185, y: -145, opacity: 0 }
              : { x: -7, y: 5, opacity: 0.42 }
          }
          animate={
            shouldConnect
              ? { x: -7, y: 5, opacity: 0.42 }
              : { x: 185, y: -145, opacity: 0 }
          }
          transition={
            motionEnabled
              ? { duration: 2.4, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
        />

        {/* Lower-Left Wireframe Hand — completely separate hand image gliding up-right */}
        <motion.img
          src={lowerUrl}
          alt=""
          className="wf-isolated-hand wf-isolated-lower"
          initial={
            motionEnabled
              ? { x: -185, y: 145, opacity: 0 }
              : { x: 7, y: -5, opacity: 0.42 }
          }
          animate={
            shouldConnect
              ? { x: 7, y: -5, opacity: 0.42 }
              : { x: -185, y: 145, opacity: 0 }
          }
          transition={
            motionEnabled
              ? { duration: 2.4, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
        />

        {/* Seamless radial & edge fade into #101211 canvas */}
        <div className="wireframe-edge-scrim" />
      </div>
    </div>
  );
}
