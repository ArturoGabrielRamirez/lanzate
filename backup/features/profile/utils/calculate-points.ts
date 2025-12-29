export const calculatePoints = (followersCount: number, likesCount: number, accountAge: number): number => {
    const followersPoints = followersCount * 5 // 5 puntos por seguidor
    const likesPoints = likesCount * 2 // 2 puntos por like recibido
    const loyaltyPoints = Math.min(accountAge, 365) // 1 punto por día hasta un año
    const bonusPoints = followersCount > 10 ? 50 : 0 // Bonus por alcanzar 10+ seguidores

    return followersPoints + likesPoints + loyaltyPoints + bonusPoints
}
