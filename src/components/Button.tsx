"use client";

import { motion } from "framer-motion";

type ButtonProps = {
  className: string;
  children: React.ReactNode;
  onClick: () => void;
  state?: "correct" | "wrong" | "disabled" | "default";
};

function Button({
  className,
  children,
  onClick,
  state = "default",
}: ButtonProps) {
  const baseStyles = "px-4 py-4 rounded-2xl";

  let animationProps: any = {
    whileHover: state === "default" ? { scale: 1.015 } : {},
    transition: { duration: 0.18, ease: "easeOut" },
  };

  if (state === "correct") {
    animationProps.animate = {
      scale: [1, 1.06, 1],
    };
    animationProps.transition = {
      duration: 0.5,
      times: [0, 0.5, 1],
      ease: "easeOut",
    };
  } else if (state === "wrong") {
    animationProps.animate = {
      x: [-6, 6, -3, 3, 0],
    };
    animationProps.transition = {
      duration: 0.35,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: "easeInOut",
    };
  } else if (state === "disabled") {
    animationProps.style = {
      opacity: 0.55,
      filter: "saturate(0.6)",
    };
  }

  return (
    <motion.button
      className={`${baseStyles} w-full cursor-pointer ${className} `}
      onClick={state === "disabled" ? undefined : onClick}
      disabled={state === "disabled"}
      {...animationProps}>
      {children}
    </motion.button>
  );
}

export default Button;
