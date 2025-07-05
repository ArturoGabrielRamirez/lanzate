const Input = ({ required, htmlFor, animationDir }: { required: boolean, htmlFor: string, animationDir: string }) => {

    return (
        <input className={`w-full px-2 py-1 mb-4 text-gray-700 border rounded dark:bg-gray-900 dark:text-white ${animationDir === 'left' ? 'animate-slide-in-left' : ''
            } ${animationDir === 'right' ? 'animate-slide-in-right' : ''}`} id={htmlFor} name={htmlFor} type={htmlFor} required={required} />
    )
}

export default Input