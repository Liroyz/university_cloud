export interface Settings {
  userId: string;
  notifications: {
    email: boolean;
    newFiles: boolean;
    deadlines: boolean;
    login: boolean;
  };
  twoFactorAuth: boolean;
  storage: {
    used: number;
    total: number;
  };
} 