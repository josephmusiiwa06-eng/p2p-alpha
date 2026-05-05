import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'P2P Alpha — Play2Perform',
  description: 'Kinder kinetics platform for early childhood motor development',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Background blobs */}
        <div className="blob" style={{width:600,height:600,background:'#FF6B00',top:-200,left:-200}} />
        <div className="blob" style={{width:500,height:500,background:'#FF2D87',bottom:-150,right:-100}} />
        <div className="blob" style={{width:400,height:400,background:'#00C3FF',top:'40%',left:'50%',transform:'translateX(-50%)'}} />
        {children}
      </body>
    </html>
  )
}
