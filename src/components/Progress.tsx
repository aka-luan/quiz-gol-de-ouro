"use client";

import { motion } from "framer-motion";

type ProgressProps = {
  max: number;
  value: number;
};

function Progress({ max, value }: ProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="bg-surface-1 w-full overflow-hidden rounded-full">
      <motion.div
        className="bg-gradient-progress h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

export default Progress;
