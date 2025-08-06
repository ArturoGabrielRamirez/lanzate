export type HandleLoginAction = {
    email: string
    password: string
}

export interface ChangePasswordButtonProps {
    buttonText: string;
    title: string;
    className?: string;
}

export interface ChangeEmailButtonProps {
    buttonText: string;
    title: string;
    className?: string;
    currentEmail: string;
}
export type { FacebookLogoProps } from "./facebook-logo";
export type { GoogleLogoProps } from "./google-logo";
export type { LoginErrorDisplayProps } from "./login-error-display";
