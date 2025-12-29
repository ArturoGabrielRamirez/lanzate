export const getSizeRecommendations = (type: 'avatar' | 'banner') => {
  if (type === 'avatar') {
    return {
      recommended: { width: 400, height: 400 },
      maximum: { width: 2000, height: 2000 },
      description: 'Cuadrada, ideal entre 200x200 y 400x400 píxeles'
    }
  }

  return {
    recommended: { width: 1200, height: 400 },
    maximum: { width: 4000, height: 2000 },
    description: 'Rectangular, ideal 3:1 o 16:9, máximo 4000x2000 píxeles'
  }
}
