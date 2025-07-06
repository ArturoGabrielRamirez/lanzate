const Title = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
    return (
        <div className={`flex gap-2 ${className}`}>
            <h2 className='text-3xl text-gray-800 dark:text-white'>{title}</h2>
            {subtitle && <>
                <span className="text-xl bg-gray-200 dark:bg-gray-800">/</span>
                <h3 className='text-lg text-gray-800 dark:text-white'>{subtitle}</h3>
            </>}
        </div>
    );
};

export default Title