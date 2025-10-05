import './globals.css';

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;