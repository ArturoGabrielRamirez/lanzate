'use client'

import { Suspense, lazy } from 'react'

import { TabLoadingState } from '@/features/profile/components/tab-laoding-state'
import { ProfileTabsProps } from '@/features/profile/types'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shadcn/components/ui/tabs'

// Lazy load para no cargar todo de golpe
const UserActivities = lazy(() =>
    import('./user-activity').then(m => ({ default: m.UserActivities }))
)
const UserLikedProducts = lazy(() =>
    import('./user-liked-products').then(m => ({ default: m.UserLikedProducts }))
)


function ProfileTabs({ user, isOwnProfile }: ProfileTabsProps) {
    return (
        <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-0">
                <Tabs defaultValue="activity" className="w-full">
                    <div className="border-b border-gray-700/50 px-4 md:px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50 h-12">
                            <TabsTrigger
                                value="activity"
                                disabled={!user?.show_activity && !isOwnProfile}
                                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 h-10"
                            >
                                Actividad
                            </TabsTrigger>
                            <TabsTrigger
                                value="likes"
                                disabled={!user?.show_liked_products && !isOwnProfile}
                                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 h-10"
                            >
                                Me gusta
                            </TabsTrigger>
                            <TabsTrigger
                                value="comments"
                                disabled={!user?.show_comments && !isOwnProfile}
                                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 h-10"
                            >
                                Comentarios
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="activity" className="p-4 md:p-6 mt-0">
                        <Suspense fallback={<TabLoadingState />}>
                            <UserActivities
                                userId={user.id}
                                isOwnProfile={isOwnProfile}
                                showPrivateActivities={isOwnProfile}
                            />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="likes" className="p-4 md:p-6 mt-0">
                        <Suspense fallback={<TabLoadingState />}>
                            <UserLikedProducts
                                userId={user.id}
                                isOwnProfile={isOwnProfile}
                            />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="comments" className="p-4 md:p-6 mt-0">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Comentarios próximamente
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Estamos trabajando en esta funcionalidad.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export { ProfileTabs }