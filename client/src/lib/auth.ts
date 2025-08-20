import { apiRequest } from "./queryClient";

export interface LoginResponse {
  success: boolean;
  token: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest("POST", "/login", credentials);
  return response.json();
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
