const Title = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            <h1 className='text-3xl text-gray-800 dark:text-white'>{title}</h1>
            {subtitle && <>
                <span className="text-xl bg-gray-200 dark:bg-gray-800">/</span>
                <h2 className='text-lg text-gray-800 dark:text-white'>{subtitle}</h2>
            </>}
        </div>
    );
};

export default Title