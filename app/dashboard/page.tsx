import Nav from '@/components/Nav'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ratingColor: Record<string, string> = {
  Excellent:'#D4AF37', Good:'#6EEB3C', Average:'#FFE600', 'Needs Support':'#FF2D87',
}
const avatarGrads = [
  'linear-gradient(135deg,#FF6B00,#FFE600)',
  'linear-gradient(135deg,#FF2D87,#FF6B00)',
  'linear-gradient(135deg,#00C3FF,#6EEB3C)',
  'linear-gradient(135deg,#6EEB3C,#00C3FF)',
  'linear-gradient(135deg,#FFE600,#FF2D87)',
  'linear-gradient(135deg,#FF2D87,#6EEB3C)',
]

function initials(name: string) {
  return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
}

export const revalidate = 0

export default async function Dashboard() {
  const [{ data: children }, { data: assessments }, { data: schools }] = await Promise.all([
    supabase.from('children').select('*, schools(name)').order('created_at', { ascending: false }),
    supabase.from('assessments').select('*').order('assessed_on', { ascending: false }),
    supabase.from('schools').select('id, name'),
  ])

  // Get latest assessment per child
  const latestByChild: Record<string, any> = {}
  assessments?.forEach(a => {
    if (!latestByChild[a.child_id]) latestByChild[a.child_id] = a
  })

  const totalKids = children?.length ?? 0
  const totalAssessments = assessments?.length ?? 0
  const avgScore = assessments?.length
    ? Math.round(assessments.reduce((s,a)=>s+a.motor_score,0)/assessments.length)
    : 0
  const totalSchools = schools?.length ?? 0

  return (
    <>
      <Nav />
      <main className="page-pad" style={{position:'relative',zIndex:1}}>
        <div className="fredoka" style={{fontSize:'clamp(32px,5vw,52px)',color:'#fff',marginBottom:6}}>Dashboard 🎯</div>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:15,fontWeight:600,marginBottom:32}}>Overview of your kinder kinetics programme</p>

        {/* Quick actions */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:32}}>
          {[
            {href:'/assess',label:'New Assessment',icon:'✏️'},
            {href:'/report',label:'Generate Report',icon:'📋'},
            {href:'/progress',label:'Track Progress',icon:'📈'},
            {href:'/assess',label:'Add Child',icon:'👶'},
          ].map(q=>(
            <Link key={q.label} href={q.href} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:18,textAlign:'center',textDecoration:'none',display:'block',transition:'all .2s',cursor:'pointer'}}>
              <div style={{fontSize:28,marginBottom:8}}>{q.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.8)'}}>{q.label}</div>
            </Link>
          ))}
        </div>

        {/* Metrics */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginBottom:32}}>
          {[
            {val:totalKids,   label:'Children Enrolled',  icon:'👦', c:'#FF6B00', trend:'↑ Live data'},
            {val:totalAssessments,label:'Assessments Done',icon:'📋', c:'#6EEB3C', trend:'↑ Live data'},
            {val:avgScore,    label:'Avg Motor Score',    icon:'⭐', c:'#00C3FF', trend:'→ Real-time'},
            {val:totalSchools,label:'Schools Active',     icon:'🏫', c:'#FF2D87', trend:'↑ Growing'},
          ].map(m=>(
            <div key={m.label} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:22,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:m.c}}/>
              <div style={{position:'absolute',top:18,right:18,fontSize:28,opacity:.5}}>{m.icon}</div>
              <div className="fredoka" style={{fontSize:52,color:'#fff',lineHeight:1}}>{m.val}</div>
              <div style={{color:'rgba(255,255,255,0.55)',fontSize:13,fontWeight:700,marginTop:6}}>{m.label}</div>
              <div style={{position:'absolute',bottom:14,right:14,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:50,background:`rgba(110,235,60,0.15)`,color:'#6EEB3C'}}>{m.trend}</div>
            </div>
          ))}
        </div>

        {/* Children grid */}
        <div className="fredoka" style={{fontSize:24,color:'#fff',margin:'32px 0 16px'}}>
          Recent <span style={{color:'#FF6B00'}}>Children</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
          {children?.slice(0,6).map((child, i) => {
            const latest = latestByChild[child.id]
            const score = latest?.motor_score ?? 0
            const scoreColor = score>=80?'#6EEB3C':score>=60?'#FFE600':'#FF2D87'
            return (
              <Link key={child.id} href={`/report?child=${child.id}`} style={{background:'rgba(255,255,255,0.055)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:20,cursor:'pointer',textDecoration:'none',display:'block',transition:'all .25s'}}>
                <div style={{width:52,height:52,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Fredoka One,cursive',fontSize:22,color:'#fff',marginBottom:12,background:avatarGrads[i%6]}}>
                  {initials(child.full_name)}
                </div>
                <div style={{fontWeight:800,fontSize:16,color:'#fff'}}>{child.full_name}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:3}}>
                  {child.schools?.name ?? 'No school'}
                </div>
                {latest && (
                  <div style={{marginTop:14,display:'flex',alignItems:'center',gap:8}}>
                    <div style={{flex:1,height:6,background:'rgba(255,255,255,0.1)',borderRadius:3,overflow:'hidden'}}>
                      <div style={{width:`${score}%`,height:'100%',borderRadius:3,background:scoreColor,transition:'width 1s'}}/>
                    </div>
                    <div className="fredoka" style={{fontSize:18,color:'#fff'}}>{score}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Recent activity */}
        <div className="fredoka" style={{fontSize:24,color:'#fff',margin:'32px 0 16px'}}>
          Recent <span style={{color:'#FF6B00'}}>Activity</span>
        </div>
        <div className="glass" style={{padding:'8px 20px'}}>
          {assessments?.slice(0,5).map(a => {
            const child = children?.find(c=>c.id===a.child_id)
            const col = ratingColor[a.overall_rating] ?? '#FFE600'
            return (
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{width:42,height:42,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,background:`${col}22`,flexShrink:0}}>📋</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:'#fff'}}>{child?.full_name ?? 'Unknown'} — Assessment</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:2}}>{new Date(a.assessed_on).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'})}</div>
                </div>
                <div style={{padding:'5px 12px',borderRadius:50,fontSize:11,fontWeight:700,letterSpacing:.5,background:`${col}22`,color:col,border:`1px solid ${col}`}}>
                  {a.overall_rating}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
