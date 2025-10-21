import { StatItemProps } from '@/features/profile/types'


function StatItem({
    icon: Icon,
    label,
    value,
    color,
    bgColor,
    showProgress = true,
    maxValue
}: StatItemProps) {
    const progressWidth = maxValue
        ? Math.min((value / maxValue) * 100, 100)
        : Math.min((value / Math.max(value + 5, 20)) * 100, 100)

    return (
        <div className="flex items-center gap-3">
            <div className={`p-2 ${bgColor} rounded-lg`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className={`text-lg font-semibold ${color}`}>{value}</span>
                </div>
                {showProgress && (
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                            className={`bg-gradient-to-r ${color.replace('text-', 'from-')} ${color.replace('text-', 'to-').replace('400', '600')} h-1.5 rounded-full transition-all duration-700`}
                            style={{ width: `${progressWidth}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export { StatItem }