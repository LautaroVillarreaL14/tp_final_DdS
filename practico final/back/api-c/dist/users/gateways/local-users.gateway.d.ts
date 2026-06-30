export declare class LocalUsersGateway {
    private users;
    private filePath;
    constructor();
    fetchAll(): any[];
    findOne(id: number): any;
    findByEmail(email: string): any;
    create(data: Partial<any>): any;
    update(id: string | number, data: Partial<any>): any;
}
