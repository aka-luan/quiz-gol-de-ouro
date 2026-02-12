"use client";

import { motion } from "framer-motion";

type AchievementNotificationProps = {
  name: string;
  description: string;
  icon: string;
};

export function AchievementNotification({
  name,
  description,
  icon,
}: AchievementNotificationProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-gradient-button flex items-center gap-4 rounded-2xl px-4 py-3">
      <div className="bg-deep/40 rounded-xl p-2">
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}>
          <span className="text-2xl">✨</span>
        </motion.div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-display text-sm font-bold">Badge Desbloqueado!</p>
        <p className="text-xs font-medium">{name}</p>
      </div>
    </motion.div>
  );
}
