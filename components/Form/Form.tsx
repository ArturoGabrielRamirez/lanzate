const Form = ({ children, action, method, formAction, className, contentButton, animationDir }: { children?: React.ReactNode, action?: string, method?: string, formAction?: (formData: FormData) => Promise<void>, className?: string, contentButton: string, animationDir?: string }) => {

    return (
        <form action={action} method={method} className={`flex flex-col gap-4 md:pt-2 ${className}`} >
            <>
                {children}
                <button className={`p-2 border border-gray-300 rounded-sm `} type='submit' formAction={formAction}>{contentButton}</button>
            </>
        </form>
    )

}

export default Form