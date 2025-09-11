export interface User {
  user: {
    id: string;
    email: string;
    name: string;
    password: string;
    avatarUrl: string | null;
    role: "USER" | "ADMIN"; // adjust if you have more roles
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

export interface ISingleUser {
  id: string;
  email: string;
  name: string;
  password: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN"; // adjust if you have more roles
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UpdateProfileData {
  name: string;
  avatarUrl: string | null;
}
export interface ResetPasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
