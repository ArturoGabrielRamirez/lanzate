export interface Account {
    id: number
    created_at: string | Date
    updated_at: string | Date
    user_id: number
    type: string
}

export interface Store {
    id: number
    name: string
    description: string | null
    logo: string | null
    slogan: string | null
    created_at: Date
    updated_at: Date
    user_id: number
    slug: string
    subdomain: string
}

export interface UserType {
    id: number
    email: string
    avatar: string | null
    banner: string | null
    created_at: string | Date
    first_name: string | null
    last_name: string | null
    username: string | null
    phone?: string | null  // Esto acepta string, null, o undefined
    password?: string
    updated_at?: string | Date
    supabase_user_id: string | null
    Account?: Account[]
    Store?: Store[]
}

export interface AvatarOption {
    id: string
    url: string
    provider: string
    label: string
    icon?: string
    isExternal?: boolean
    isCurrentlyUsed?: boolean
    fileName?: string
    size?: number
    uploadedAt?: string | Date
}

export interface BannerOption {
    id: string
    url: string
    provider: string
    label: string
    icon: string
    isCurrentlyUsed?: boolean
    fileName?: string
    size?: number
    uploadedAt?: string
}

export interface AvatarEditorProps {
    currentAvatar: string | null
    userEmail: string
    onAvatarUpdate: (newAvatarUrl: string | null) => void
}

export interface AccountHeaderProps {
    user: UserType
    translations: {
        title: string
        "description.upgrade-plan": string
    }
    onAvatarUpdate: (newAvatarUrl: string | null) => void
    onProfileUpdate: (profile: {
        username: string | null
        firstName: string | null
        lastName: string | null
        phone: string | null
    }) => void
}


export interface AccountPageClientProps {
    user: UserType
    translations: {
        title: string
        "description.upgrade-plan": string
        "description.account-details": string
        "description.membership": string
        "description.first-name": string
        "description.last-name": string
        "description.email": string
        "description.password": string
        "description.change-email": string
        "description.change-password": string
        "description.currently-not-available": string
        "description.username": string
        "description.phone": string
        [key: string]: string
    }
}

export interface ActionButtonsProps {
    selectedOption: string | null
    selectedFile: File | null
    currentAvatar: string | null
    isUploading: boolean
    onUseSelectedOption: () => void
    onUpload: () => void
    onRemoveAvatar: () => void
    onCancel: () => void
}

export interface AvatarOptionsProps {
    isLoading: boolean
    options: AvatarOption[]
    selectedOption: string | null
    onOptionSelect: (optionId: string) => void
}

export interface AvatarPreviewProps {
    previewUrl: string | null | undefined
    getDefaultAvatar: () => string
}

export interface FileUploadSectionProps {
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
    onButtonClick: () => void
}

export interface UserDeletionRequest {
    reason: string;
    confirmPassword: string;
}

export interface UserDeletionStatus {
    isDeletionRequested: boolean;
    deletionRequestedAt: Date | null;
    deletionScheduledAt: Date | null;
    displayScheduledAt: Date | null;
    deletionReason: string | null;
    canCancel: boolean;
    daysRemaining: number;
    minutesRemaining: number;

    canDeleteUntil?: Date | null;
    canCancelUntil?: Date | null;
    isWithinActionWindow?: boolean;

    isAnonymized?: boolean;
    anonymizedAt?: Date | null;
    legalRetentionUntil?: Date | null;
    legalStatus?: 'active' | 'pending_deletion' | 'legally_processed';
    processingMethod?: string;
    cronFrequency?: string;
    testingMode?: boolean;

    calculationInfo?: {
        requestedAt?: Date | null;
        scheduledAt?: Date | null;
        displayScheduledAt?: Date | null;
        currentTime: string;
        roundedActionLimit: string | null;
        withinWindow: boolean;
    };
}

export interface DeletionActionResponse {
    success: boolean;
    message: string;
    deletionInfo?: {
        requestedAt: Date;
        scheduledAt: Date;
        displayScheduledAt: Date | null;
        canDeleteUntil: Date;
        canCancelUntil: Date;
        actionWindowMinutes: number;
        processingMethod?: string;
        testingMode?: boolean;
    };
    cancellationInfo?: {
        cancelledAt: Date;
        reason: string;
        originalRequestAt: Date;
        actionLimitWas: Date;
        cancelledWithMinutesToSpare: number;
        processingMethod?: string;
        automaticProcessing?: boolean;
    };
    error?: string;
    expiredAt?: Date;
    currentTime?: Date;
    minutesPastDeadline?: number;
}

export interface DangerZoneProps {
    userId: number;
    onStatusChange?: () => void;
}

export interface AccountDeletedParams {
    onStatusChange?: () => void;
    setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
}

export interface DangerZoneTabProps {
    userId: number
    onStatusChange: () => void
    preload?: boolean
}

export interface DeleteRequestParams {
    reason: string;
    password: string;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setReason: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
    onStatusChange?: () => void;
}

export interface CancelDeletionParams {
    setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setCancelReason: React.Dispatch<React.SetStateAction<string>>;
    setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
    onStatusChange?: () => void;
    cancelReason: string;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    difference: number;
}

export interface CountdownDisplayProps {
    timeLeft: TimeLeft;
    scheduledDate: Date;
    title?: string;
    variant?: 'main' | 'action';
    urgencyTextColor?: string;
}

export interface UseAvatarEditorProps {
    currentAvatar: string | null
    userEmail: string
    onAvatarUpdate: (newAvatarUrl: string | null) => void
    fileInputRef: React.RefObject<HTMLInputElement | null>
    onClose: () => void
}

export interface AccountDetailsTabProps {
    user: UserType
    translations: {
        "description.account-details": string
        "description.username": string
        "description.first-name": string
        "description.last-name": string
        "description.email": string
        "description.password": string
        "description.change-email": string
        "description.change-password": string
        "description.phone": string
        [key: string]: string
    }
    immediateData?: {
        username?: string | null
        email: string
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        avatar?: string | null
        createdAt: Date | string
        activeAccounts: number
        storesCount: number
        accountType: string
    }
}

export interface AccountBannerHeaderProps extends AccountHeaderProps {
    onBannerUpdate?: (url: string | null) => void
}

export interface DeletionRequestedViewProps {
    user: UserType
    deletionStatus: UserDeletionStatus
    onStatusChange: () => void
}

export interface ActionTimeLeft {
    minutes: number;
    seconds: number;
    totalMinutes: number;
}