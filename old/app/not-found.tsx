import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f9fafb',
          color: '#374151'
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>404</h1>
          <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>Page Not Found</p>
          <p style={{ margin: '0.5rem 0', opacity: 0.7 }}>
            The page you&apos;re looking for doesn&apos;t exist.
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
            Go Home
          </Link>
        </div>
      </body>
    </html>
  )
}