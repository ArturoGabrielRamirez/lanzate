"use client"

import { Textarea } from "@/features/shadcn/components/ui/textarea"
import { Form, InputField } from "@/features/layout/components"
import { addProductComment } from "../actions/addProductComment"
import { useOptimistic, useState, useTransition } from "react"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"
import { toast } from "sonner"

type Comment = {
    id: number
    content: string
    created_at: Date
    users: {
        id: number
        first_name?: string | null
        last_name?: string | null
        email: string
    }
}

type Props = {
    productId: number
    user: {
        id: number
        email: string
        first_name?: string | null
        last_name?: string | null
    } | null
    initialComments: Comment[]
}

function CommentsClient({ productId, user, initialComments }: Props) {
    const [comments, setComments] = useState(initialComments)
    const [isPending, startTransition] = useTransition()
    const [optimisticComments, addOptimisticComment] = useOptimistic(
        comments,
        (currentComments, newComment) => {
            return [newComment as Comment, ...currentComments]
        }
    )
    const pathname = usePathname()

    async function handleFormAction(data: { content: string }) {
        console.log("🚀 ~ handleFormAction ~ data:", data)
        if (!user) {
            toast.error("Please login to leave a comment")
            return { error: true, message: "Login required", payload: null }
        }

        if (!data.content || data.content.trim().length === 0) {
            return { error: true, message: "Please enter a comment", payload: null }
        }

        if (data.content.trim().length > 500) {
            return { error: true, message: "Comment cannot exceed 500 characters", payload: null }
        }

        const optimisticComment: Comment = {
            id: Date.now(), // Temporary ID
            content: data.content.trim(),
            created_at: new Date(),
            users: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        }

        // Start transition for optimistic update
        startTransition(async () => {
            addOptimisticComment(optimisticComment)
        })

        try {
            const result = await addProductComment(
                { content: data.content.trim() },
                productId,
                user.id,
                pathname
            )
            
            if (!result.error) {
                setComments(prev => [result.payload, ...prev])
                return result
            } else {
                // Revert optimistic update on error
                setComments(comments)
                return result
            }
        } catch (error) {
            console.error("Error adding comment:", error)
            // Revert optimistic update on error
            setComments(comments)
            return { error: true, message: "Failed to add comment", payload: null }
        }
    }

    function formatUserName(user: Comment['users']) {
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`
        }
        if (user.first_name) {
            return user.first_name
        }
        return user.email.split('@')[0]
    }

    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString('es', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
            
            {/* Comment Form */}
            {user ? (
                <Form
                    className="w-full flex flex-col gap-2 items-end"
                    contentButton={isPending ? "Enviando..." : "Comentar"}
                    formAction={handleFormAction}
                    successMessage="Comentario agregado exitosamente"
                    loadingMessage="Enviando comentario..."
                    disabled={isPending}
                >
                    <InputField name="content" label="Comentario" containerClassName="w-full" />
                </Form>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Inicia sesión para dejar un comentario
                </p>
            )}

            {/* Comments List */}
            <div className="space-y-3">
                {optimisticComments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                ) : (
                    optimisticComments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 rounded-full p-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                            {formatUserName(comment.users)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CommentsClient 