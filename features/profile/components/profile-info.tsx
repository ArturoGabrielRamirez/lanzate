import { Calendar, MapPin } from "lucide-react"

import { ProfileInfoProps } from '@/features/profile/types'
import { formatDate } from '@/features/profile/utils/format-date'

function ProfileInfo({
    displayName,
    username,
    bio,
    location,
    showLocation,
    createdAt,
    isMobile = false
}: ProfileInfoProps) {
    if (isMobile) {
        return (
            <div className="flex-1 pt-1 min-w-0">
                <h1 className="text-xl font-bold text-white mb-0.5 truncate">
                    {displayName}
                </h1>
                <p className="text-sm text-gray-400 mb-3">
                    @{username}
                </p>

                {bio && (
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-3">
                        {bio}
                    </p>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    {showLocation && location && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(createdAt)}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold text-white mb-1">
                {displayName}
            </h1>
            <p className="text-lg text-gray-400 mb-3">
                @{username}
            </p>

            {bio && (
                <p className="text-gray-300 mb-3 leading-relaxed text-sm max-w-2xl">
                    {bio}
                </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-400">
                {showLocation && location && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Desde {formatDate(createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export { ProfileInfo }