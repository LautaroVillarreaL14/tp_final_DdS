"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalUsersGateway = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class LocalUsersGateway {
    users;
    filePath;
    constructor() {
        const candidate1 = (0, path_1.join)(__dirname, '../data/users.json');
        const candidate2 = (0, path_1.join)(process.cwd(), 'src', 'users', 'data', 'users.json');
        this.filePath = candidate1;
        let content = null;
        try {
            content = (0, fs_1.readFileSync)(candidate1, 'utf-8');
        }
        catch (e) {
            try {
                content = (0, fs_1.readFileSync)(candidate2, 'utf-8');
                this.filePath = candidate2;
            }
            catch (e2) {
                throw e;
            }
        }
        this.users = JSON.parse(content);
    }
    fetchAll() {
        return this.users;
    }
    findOne(id) {
        return this.users.find(u => +u.id === +id);
    }
    findByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    create(data) {
        const id = String((Math.max(0, ...this.users.map(u => Number(u.id))) + 1));
        const user = { id, ...data };
        this.users.push(user);
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(this.users, null, 2), 'utf-8');
        return user;
    }
    update(id, data) {
        const idx = this.users.findIndex(u => +u.id === +id);
        if (idx === -1)
            return undefined;
        this.users[idx] = { ...this.users[idx], ...data };
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(this.users, null, 2), 'utf-8');
        return this.users[idx];
    }
}
exports.LocalUsersGateway = LocalUsersGateway;
//# sourceMappingURL=local-users.gateway.js.map