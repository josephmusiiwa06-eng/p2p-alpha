'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',          label: '🏠 Home'      },
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/assess',    label: '✏️ Assess'    },
  { href: '/report',    label: '📋 Report'    },
  { href: '/progress',  label: '📈 Progress'  },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:200,
      background:'rgba(15,5,40,0.82)',backdropFilter:'blur(24px)',
      borderBottom:'1.5px solid rgba(212,175,55,0.35)',
      padding:'10px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',
      flexWrap:'wrap',gap:8,
    }}>
      <div className="fredoka" style={{fontSize:26,background:'linear-gradient(135deg,#FF6B00,#FFE600)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
        P2P<sup style={{fontSize:12,WebkitTextFillColor:'rgba(212,175,55,0.8)',verticalAlign:'top',marginTop:4,display:'inline-block'}}>ALPHA</sup>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            background: path===l.href ? '#FF6B00' : 'transparent',
            border: `1.5px solid ${path===l.href ? '#FF6B00' : 'rgba(255,255,255,0.15)'}`,
            color: path===l.href ? '#fff' : 'rgba(255,255,255,0.75)',
            padding:'7px 14px',borderRadius:50,fontFamily:'Nunito,sans-serif',
            fontWeight:700,fontSize:12,textDecoration:'none',transition:'all 0.2s',letterSpacing:'.3px',
          }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
