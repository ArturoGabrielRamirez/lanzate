"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import {
  FormProvider,
  useForm,
  UseFormProps,
  type SubmitHandler,
  FieldValues,
  Resolver,
  DefaultValues,
} from "react-hook-form";
import { toast } from "sonner";

import { LoadingSubmitButton } from "@/features/global/components/form/loading-submit-button";
import { FormProps } from "@/features/global/types/form";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Global Form Wrapper Component
 *
 * A comprehensive form component that integrates React Hook Form with server actions,
 * providing consistent form handling, validation, loading states, and user feedback
 * across the entire application.
 *
 * Features:
 * - React Hook Form integration with yupResolver
 * - useTransition pattern for form submission
 * - Toast notifications for success/error feedback with loading state
 * - Automatic redirect on success
 * - Loading states during submission
 * - Optional form reset after success
 * - Customizable callbacks for form lifecycle events
 *
 * @template T - The type of the form data (extends FieldValues from react-hook-form)
 *
 * @example
 * ```tsx
 * <Form
 *   resolver={yupResolver(loginSchema)}
 *   formAction={handleLoginAction}
 *   successRedirect="/dashboard"
 *   successMessage="Login successful!"
 *   loadingMessage="Logging in..."
 *   contentButton="Log In"
 *   resetOnSuccess={false}
 * >
 *   <InputField name="email" label="Email" placeholder="Enter your email" type="email" isRequired />
 *   <InputField name="password" label="Password" placeholder="Enter your password" type="password" isRequired />
 * </Form>
 * ```
 */
export function Form<T extends FieldValues>({
  children,
  resolver,
  contentButton,
  formAction,
  successRedirect,
  successMessage = "Operación exitosa!",
  loadingMessage = "Cargando...",
  className,
  onComplete,
  onSuccess,
  onError,
  disabled = false,
  submitButton = true,
  resetOnSuccess = false,
  submitButtonClassName,
  onSubmitStart,
  onSubmitEnd,
  defaultValues,
}: FormProps<T>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Configure React Hook Form
  const config: UseFormProps<T> = {
    mode: "onChange",
    disabled,
    defaultValues: defaultValues as DefaultValues<T>,
  };
  if (resolver) config.resolver = resolver as Resolver<T, unknown, T>;

  const methods = useForm<T>(config);
  const { handleSubmit, reset } = methods;

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as DefaultValues<T>);
    }
  }, [defaultValues, reset]);

  /**
   * Handle form submission with useTransition pattern
   *
   * This function wraps the form action in a transition, handles loading states,
   * displays toast notifications with loading state, and manages success/error callbacks.
   */
  const onSubmit: SubmitHandler<T> = async (data) => {
    if (!formAction) return;

    // Call onSubmitStart if provided
    if (onSubmitStart) await onSubmitStart();

    // Use transition for non-blocking updates
    startTransition(async () => {
      // Create promise for toast.promise to track
      const actionPromise = new Promise(async (resolve, reject) => {
        try {
          // Execute the form action
          const response = await formAction(data);

          // Handle error response
          if (response.hasError) {
            reject(new Error(response.message || "Ocurrió un error"));
          } else {
            resolve(response);
          }
        } catch (error) {
          reject(error);
        }
      });

      // Use toast.promise to show loading, success, and error states
      toast.promise(actionPromise, {
        loading: loadingMessage,
        success: (response: any) => {
          // Reset form if configured
          if (resetOnSuccess) reset();

          // Redirect if configured
          if (successRedirect) router.push(successRedirect);

          // Call onSuccess callback
          if (onSuccess) onSuccess();

          return response?.message || successMessage;
        },
        error: (error: Error) => {
          // Call onError callback
          if (onError) onError();

          return error.message || "An unexpected error occurred";
        },
      });

      // Wait for promise to complete before calling callbacks
      try {
        await actionPromise;
      } catch (error) {
        // Error already handled by toast.promise
        console.error("Form submission error:", error);
      } finally {
        // Always call onComplete callback
        if (onComplete) onComplete();

        // Call onSubmitEnd if provided
        if (onSubmitEnd) await onSubmitEnd();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        {children}
        {submitButton && (
          <LoadingSubmitButton
            text={contentButton}
            disabled={disabled || isPending}
            className={submitButtonClassName}
          />
        )}
      </form>
    </FormProvider>
  );
}
