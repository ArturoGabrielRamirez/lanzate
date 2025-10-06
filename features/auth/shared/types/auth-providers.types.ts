export interface AuthProvidersProps {
  label: string;
}

export interface GoogleAuthButtonProps {
  label: string;
  onClick: () => void | Promise<void>;
  className?: string;
}

