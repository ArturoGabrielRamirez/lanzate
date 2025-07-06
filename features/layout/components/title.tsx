const Title = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
    return (
        <div className={`flex gap-2 items-end mb-4 ${className}`}>
            <h2 className='text-3xl dark:text-white font-bold'>{title}</h2>
            {subtitle && <>
                <span className="text-xl">/</span>
                <h3 className='text-lg'>{subtitle}</h3>
            </>}
        </div>
    );
};

export default Title