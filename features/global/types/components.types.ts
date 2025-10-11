import * as Yup from 'yup';

export interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClickAsync: () => Promise<unknown>;
  leftIcon?: React.ReactNode;
  iconOnly?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface FormField {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validation?: Yup.AnySchema;
  required?: boolean;
  tooltip?: string;
}

export interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void | Promise<void>;
  submitText: string;
  submitLoadingText?: string;
  submitLeftIcon?: React.ReactNode;
  validationSchema?: Yup.ObjectSchema<any>;
  defaultValues?: Record<string, any>;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  tooltip?: string;
  fieldName?: string;
}

export interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  iconOnly?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}