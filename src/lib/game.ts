function calculateStreakBonusXP(streak: number): number {
  let xp = 0

  if(streak % 5 === 0) {
    xp = streak
    return xp;
  } 

  return xp
}

function calculateDifficultyXP(difficulty: "fácil" | "médio" | "difícil"): number {
  let xp = 0
  switch (difficulty) {
    case "fácil":
      xp = 10
      break;
      case "médio":
        xp = 20
        break;
        case "difícil":
          xp = 30
          break;
  
    default:
      break;
  }

  return xp
}

function computeLevel(totalXp: number): string {
  if (totalXp >= 0 && totalXp <= 199) {
    return "Gândula"
  } else if (totalXp <= 599) {
    return "Profissional"
  } else if (totalXp <= 999) {
    return "Craque"
  } else {
    return "Lenda"
  }
}

export { calculateStreakBonusXP, calculateDifficultyXP, computeLevel };
