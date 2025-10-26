/**
 * Tipos TypeScript para el Password Vault
 */

export type VaultItem = {
  id: string;
  app_name: string;
  app_login_url?: string;
  username?: string;
  created_at: string;
};

export type VaultItemDetail = VaultItem & {
  updated_at?: string;
};

export type SignupFormData = {
  email: string;
  master_password: string;
};

export type LoginFormData = {
  email: string;
  master_password: string;
};

export type VaultRegisterFormData = {
  app_name: string;
  app_login_url?: string;
  username?: string;
  password: string;
  master_password: string;
};

export type AuthResponse = {
  token: string;
  message?: string;
};

