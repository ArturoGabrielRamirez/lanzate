import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f9fafb',
      color: '#374151',
      width: '100%',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>Página no encontrada</p>
      <p style={{ margin: '0.5rem 0', opacity: 0.7 }}>
        La página que buscas no existe.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem'
        }}
      >
        Ir al inicio
      </Link>
    </div>
  )
}