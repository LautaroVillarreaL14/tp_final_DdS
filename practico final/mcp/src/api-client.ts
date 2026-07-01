import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.API_C_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private authPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({ baseURL: BASE_URL });
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.token) return;
    if (this.authPromise) return this.authPromise;

    this.authPromise = (async () => {
      const email = process.env.API_C_EMAIL;
      const password = process.env.API_C_PASSWORD;

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
    const email = process.env.API_C_EMAIL;
    const password = process.env.API_C_PASSWORD;
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
