import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { AchievementNotification } from "@/components/AchievementNotification";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
};

export function useAchievementFeedback() {
  const [achievements, setAchievements] = useState<Record<string, Achievement>>(
    {},
  );
  const shownToasts = useRef<Set<string>>(new Set());

  // Carregar achievements do JSON
  useEffect(() => {
    fetch("/data/achievements.json")
      .then((res) => res.json())
      .then((data: Achievement[]) => {
        const map = Object.fromEntries(data.map((a) => [a.id, a]));
        setAchievements(map);
      });
  }, []);

  const showAchievementFeedback = (unlockedIds: string[]) => {
    // Mostrar toast apenas para achievements não exibidos ainda nesta sessão
    unlockedIds.forEach((id) => {
      if (!shownToasts.current.has(id) && achievements[id]) {
        const achievement = achievements[id];
        shownToasts.current.add(id);

        toast.custom(
          (t) => (
            <AchievementNotification
              name={achievement.name}
              description={achievement.description}
              icon={achievement.icon}
            />
          ),
          {
            duration: 3000,
            position: "top-right",
          },
        );
      }
    });
  };

  return {
    showAchievementFeedback,
    achievements,
  };
}
