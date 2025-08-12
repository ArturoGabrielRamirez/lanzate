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
    created_at: string | Date
    first_name: string | null
    last_name: string | null
    username: string | null
    phone: string | null
    password: string
    updated_at: string | Date
    supabase_user_id: string | null
    Account: Account[]
    Store: Store[]
}

export interface AvatarOption {
    id: string
    url: string
    provider: string
    label: string
    icon?: string
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
    }
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
