import { ButtonProps } from "@/features/shadcn/components/ui/button";
import { Button } from "@/features/shadcn/components/ui/button";
import { cn } from "@/lib/utils";

function EyeCatchingButton({ ...props }: ButtonProps) {
    return (
        <div className="relative group rounded-lg inline-block p-[1.3px] overflow-hidden">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_50%,transparent_100%)] bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_100%)]" />
            <Button
                {...props}
                className={cn(
                    'backdrop-blur-2xl rounded-lg bg-transparent transition-colors  group-hover:scale-100',
                    props.className,
                )}
            />
        </div>
    );
};


export { EyeCatchingButton };