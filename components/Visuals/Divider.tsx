export default function Divider({ className }: { className?: string }) {

    return (
        <div className={`hidden sm:block opacity-20 bg-gray-300 w-[1px] sm:col-start-2 sm:row-start-2 ${className}`} />
    )

}