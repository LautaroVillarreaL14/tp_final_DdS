export declare class UserEntity {
    id: number;
    email: string;
    name: string;
    username: string;
    password: string;
    emailVerified: boolean;
    isVerified: boolean;
    verificationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: number;
    createdAt: Date;
}
