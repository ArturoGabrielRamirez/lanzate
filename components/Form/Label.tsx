const Label = ({ htmlFor, text, className, animationDir }: { htmlFor: string, text: string, className?: string, animationDir?: string }) => {

    return (
        <label htmlFor={htmlFor} className={`text-sm text-gray-400 ${className}`}>
            {text}
        </label>
    )
}

export default Label