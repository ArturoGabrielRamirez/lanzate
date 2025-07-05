const Label = ({ htmlFor, text, className, animationDir }: { htmlFor: string, text: string, className?: string, animationDir: string }) => {

    return (
        <label htmlFor={htmlFor} className={`text-sm text-gray-400 ${animationDir === 'left' ? 'animate-slide-in-left' : ''
            } ${animationDir === 'right' ? 'animate-slide-in-right' : ''} ${className}`}>
            {text}
        </label>
    )
}

export default Label