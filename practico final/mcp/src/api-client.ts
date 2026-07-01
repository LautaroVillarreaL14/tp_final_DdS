import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import type { AxiosInstance } from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

dotenv.config({ path: path.resolve(__dirname, "..", "..", "back", "api-c", ".env") });

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private authPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({ baseURL: this.getBaseUrl() });
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  private getBaseUrl(): string {
    return process.env.API_C_URL || "http://localhost:3000";
  }

  private getAuthCredentials(): { email?: string; password?: string } {
    return {
      email: process.env.API_C_EMAIL,
      password: process.env.API_C_PASSWORD,
    };
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.token) return;
    if (this.authPromise) return this.authPromise;

    this.authPromise = (async () => {
      const { email, password } = this.getAuthCredentials();

      if (!email || !password) return;

      try {
        const res = await this.login(email, password);
        this.setToken(res.access_token);
      } catch {
        try {
          const res = await this.register(email, password);
          this.setToken(res.access_token);
        } catch {
          this.clearToken();
        }
      }
    })();

    try {
      await this.authPromise;
    } finally {
      this.authPromise = null;
    }
  }

  async login(email: string, password: string): Promise<{ user: any; access_token: string }> {
    const res = await this.client.post("/auth/login", { email, password });
    return res.data;
  }

  async register(email: string, password: string): Promise<{ user: any; access_token: string }> {
    const res = await this.client.post("/auth/register", { email, password });
    return res.data;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  async autoLogin(): Promise<boolean> {
    const { email, password } = this.getAuthCredentials();
    if (!email || !password) {
      return false;
    }
    try {
      const res = await this.login(email, password);
      this.setToken(res.access_token);
      return true;
    } catch {
      try {
        const res = await this.register(email, password);
        this.setToken(res.access_token);
        return true;
      } catch {
        return false;
      }
    }
  }

  async get(path: string, config?: any): Promise<any> {
    await this.ensureAuthenticated();
    const res = await this.client.get(path, config);
    return res.data;
  }

  async post(path: string, data?: any): Promise<any> {
    await this.ensureAuthenticated();
    const res = await this.client.post(path, data);
    return res.data;
  }

  async put(path: string, data?: any): Promise<any> {
    await this.ensureAuthenticated();
    const res = await this.client.put(path, data);
    return res.data;
  }

  async patch(path: string, data?: any): Promise<any> {
    await this.ensureAuthenticated();
    const res = await this.client.patch(path, data);
    return res.data;
  }

  async del(path: string, config?: any): Promise<any> {
    await this.ensureAuthenticated();
    const res = await this.client.delete(path, config);
    return res.data;
  }
}

export const api = new ApiClient();
