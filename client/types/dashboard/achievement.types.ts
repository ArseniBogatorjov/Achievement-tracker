export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string;
  globalRarity: number;
  isMissable: boolean;
  userAchievements: UserAchievement[];
}

export interface UserAchievement {
  unlockedAt: string;
}
