import { Roboto } from 'next/font/google'
import './styles/global.scss'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'] // Specified as an array of strings
})

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    )
}
