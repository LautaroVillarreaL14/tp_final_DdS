import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class LocalUsersGateway {
  private users: any[];
  private filePath: string;

  constructor() {
    // Try locating the data file in dist (runtime) or src (dev)
    const candidate1 = join(__dirname, '../data/users.json');
    const candidate2 = join(process.cwd(), 'src', 'users', 'data', 'users.json');
    this.filePath = candidate1;
    let content: string | null = null;
    try {
      content = readFileSync(candidate1, 'utf-8');
    } catch (e) {
      try {
        content = readFileSync(candidate2, 'utf-8');
        this.filePath = candidate2;
      } catch (e2) {
        throw e; // original error
      }
    }
    this.users = JSON.parse(content as string);
  }

  fetchAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => +u.id === +id);
  }

  findByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  create(data: Partial<any>) {
    const id = String((Math.max(0, ...this.users.map(u => Number(u.id))) + 1));
    const user = { id, ...data } as any;
    this.users.push(user);
    writeFileSync(this.filePath, JSON.stringify(this.users, null, 2), 'utf-8');
    return user;
  }

  update(id: string | number, data: Partial<any>) {
    const idx = this.users.findIndex(u => +u.id === +id);
    if (idx === -1) return undefined;
    this.users[idx] = { ...this.users[idx], ...data };
    writeFileSync(this.filePath, JSON.stringify(this.users, null, 2), 'utf-8');
    return this.users[idx];
  }
}