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