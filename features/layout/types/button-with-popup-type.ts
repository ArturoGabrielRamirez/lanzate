import { FieldValues } from "react-hook-form";
import { ObjectSchema } from "yup";
import { ResponseType } from ".";

export type ButtonWithPopupPropsType<P extends FieldValues> = {
  text: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  action: (payload: P) => Promise<ResponseType<any> | undefined>;
  messages: {
    success: string;
    error: string;
    loading: string;
  };
  disabled?: boolean;
  schema?: ObjectSchema<Partial<P>>;
  onComplete?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  formDisabled?: boolean;
  contentButton?: string | React.ReactNode;
  onlyIcon?: boolean;
};
