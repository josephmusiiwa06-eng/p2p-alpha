import Nav from '@/components/Nav'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'80px 24px 60px',position:'relative',zIndex:1}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(212,175,55,0.12)',border:'1px solid rgba(212,175,55,0.5)',color:'#F0D060',padding:'8px 22px',borderRadius:50,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',marginBottom:36}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#6EEB3C',boxShadow:'0 0 8px #6EEB3C',display:'inline-block'}}/>
          Early Childhood Motor Development Platform
        </div>

        <div className="fredoka" style={{fontSize:'clamp(56px,11vw,110px)',lineHeight:0.95,color:'#fff',marginBottom:4}}>
          <span style={{background:'linear-gradient(135deg,#FF6B00,#FFE600)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>PLAY</span>
        </div>
        <div className="fredoka" style={{fontSize:'clamp(56px,11vw,110px)',lineHeight:0.95,marginBottom:24}}>
          <span style={{background:'linear-gradient(135deg,#6EEB3C,#00FF88)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>2</span>
          <span style={{background:'linear-gradient(135deg,#00C3FF,#FF2D87)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>PERFORM</span>
        </div>

        <p style={{fontSize:19,color:'rgba(255,255,255,0.65)',maxWidth:520,margin:'0 auto 48px',lineHeight:1.65,fontWeight:600}}>
          Transforming every jump, throw &amp; sprint into meaningful data — so every child can grow at their best pace.
        </p>

        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/assess" className="btn-primary">🏃 Start Assessment</Link>
          <Link href="/dashboard" className="btn-secondary">📊 View Dashboard</Link>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:72,width:'100%',maxWidth:640}}>
          {[
            {n:'4',l:'Core Tests',c:'#FF6B00'},
            {n:'60s',l:'Per Child',c:'#6EEB3C'},
            {n:'∞',l:'Growth Tracked',c:'#00C3FF'},
          ].map(s=>(
            <div key={s.l} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'24px 16px',textAlign:'center'}}>
              <div className="fredoka" style={{fontSize:42,color:s.c,lineHeight:1}}>{s.n}</div>
              <div style={{color:'rgba(255,255,255,0.55)',fontSize:12,marginTop:8,fontWeight:700,letterSpacing:'.5px'}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',marginTop:56}}>
          {[
            {l:'Balance Test',c:'#FF6B00'},{l:'Shuttle Run',c:'#6EEB3C'},
            {l:'Throw & Catch',c:'#00C3FF'},{l:'Jump Distance',c:'#FF2D87'},
            {l:'Motor Score™',c:'#FFE600'},{l:'Parent Reports',c:'#D4AF37'},
          ].map(f=>(
            <div key={f.l} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:50,padding:'10px 20px',color:'rgba(255,255,255,0.75)',fontSize:13,fontWeight:700}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:f.c,display:'inline-block'}}/>
              {f.l}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
