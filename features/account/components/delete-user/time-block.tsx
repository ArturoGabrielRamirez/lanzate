export default function TimeBlock({ 
    value, 
    label, 
    urgencyTextColor = 'text-red-400',
    isMain = false
}: { 
    value: number; 
    label: string;
    urgencyTextColor?: string;
    isMain?: boolean;
}) {

    return (
        <div className={`bg-gray-900/50 rounded p-3 text-center border border-gray-700 ${isMain && value === 0 ? 'ring-1 ring-red-500/50' : ''}`}>
            <div className={`text-2xl font-bold mb-1 ${urgencyTextColor} ${isMain && value === 0 ? 'animate-pulse' : ''}`}>
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 font-medium">
                {label}
            </div>
        </div>
    );
}