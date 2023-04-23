type BasicUser = {
  accountType: number;
  displayName: string;
  authCategory?: number;
};

export type TrainerUser = {
    trainings?: {
      id?: number;
      user?: number;
      requirement?: number;
  }[];
}

export type NewUser = BasicUser & TrainerUser & {
  openId: string;
};

export type User = BasicUser & TrainerUser & {
  id: number;
  category?: {}
  categories?: {
    name: string;
  }
  accountTypes?: {
    name: string;
  };
  approved: boolean;
  trainee?: {
    callsign?: string;
    category?: number;
  }
};
