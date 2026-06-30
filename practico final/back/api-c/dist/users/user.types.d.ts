export type ExternalUser = {
    id: number | string;
    name?: string;
    username?: string;
    email: string;
    password?: string;
    emailVerified?: boolean;
    isVerified?: boolean;
    verificationToken?: string | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: number | null;
};
