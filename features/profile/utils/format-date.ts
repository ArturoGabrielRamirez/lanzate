export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(date))
}