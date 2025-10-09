export interface CurrentUserInfo {
    id: number;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    accountType: string | null;
}