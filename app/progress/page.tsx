import Nav from '@/components/Nav'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

const gradeColor: Record<string,string> = {
  Excellent:'#D4AF37', Good:'#6EEB3C', Average:'#FFE600', 'Needs Support':'#FF2D87',
}
const testMeta: Record<string,{icon:string,label:string,unit:string}> = {
  balance:    {icon:'⚖️',label:'BALANCE',     unit:'seconds'},
  shuttle_run:{icon:'🏃',label:'SHUTTLE RUN', unit:'secs (lower=better)'},
  throw_catch:{icon:'🎯',label:'THROW & CATCH',unit:'/10'},
  jump:       {icon:'🦘',label:'JUMP DISTANCE',unit:'cm'},
}

function initials(name:string){ return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) }
const avatarGrads = ['linear-gradient(135deg,#FF6B00,#FFE600)','linear-gradient(135deg,#FF2D87,#FF6B00)','linear-gradient(135deg,#00C3FF,#6EEB3C)','linear-gradient(135deg,#6EEB3C,#00C3FF)','linear-gradient(135deg,#FFE600,#FF2D87)','linear-gradient(135deg,#FF2D87,#6EEB3C)']
const barColors = ['#FF6B00','#6EEB3C','#00C3FF','#FF2D87']

export default async function Progress({ searchParams }: { searchParams: Promise<{child?:string}> }) {
  const { child: childId } = await searchParams

  const { data: allChildren } = await supabase.from('children').select('id,full_name,date_of_birth,schools(name)').order('created_at')

  // Default to first child
  const selectedId = childId ?? allChildren?.[0]?.id
  const selectedChild = allChildren?.find(c=>c.id===selectedId) ?? allChildren?.[0]

  let assessments: any[] = []
  let resultsBySession: Record<string,any[]> = {}

  if (selectedId) {
    const { data: a } = await supabase.from('assessments').select('*').eq('child_id',selectedId).order('assessed_on')
    assessments = a ?? []
    for (const asmt of assessments) {
      const { data: r } = await supabase.from('assessment_results').select('*').eq('assessment_id',asmt.id)
      resultsBySession[asmt.id] = r ?? []
    }
  }

  const scores = assessments.map(a=>a.motor_score)
  const latest = assessments[assessments.length-1]
  const prev = assessments[assessments.length-2]
  const delta = latest && prev ? latest.motor_score - prev.motor_score : null
  const trend = delta === null ? 'No trend yet' : delta > 0 ? `↑ +${delta} pts` : delta < 0 ? `↓ ${delta} pts` : '→ No change'
  const trendColor = delta === null ? '#fff' : delta > 0 ? '#6EEB3C' : delta < 0 ? '#FF2D87' : '#FFE600'

  // Build per-test bar data
  const testKeys = ['balance','shuttle_run','throw_catch','jump']
  const perTest: Record<string,{val:number,unit:string}[]> = {}
  testKeys.forEach(tk=>{
    perTest[tk] = assessments.map(a=>{
      const r = resultsBySession[a.id]?.find((r:any)=>r.test_name===tk)
      return {val: r?.raw_value??0, unit:r?.unit??''}
    })
  })

  // SVG chart points (600x140 viewport)
  const chartW=580,chartH=120,padL=20
  const minS=Math.max(0, Math.min(...scores)-10)
  const maxS=Math.min(100,Math.max(...scores)+10)
  const toX=(i:number)=>padL+(i/(Math.max(scores.length-1,1)))*(chartW-padL)
  const toY=(s:number)=>chartH-((s-minS)/(maxS-minS||1))*chartH

  const pts = scores.map((s,i)=>`${toX(i)},${toY(s)}`).join(' ')
  const area = scores.length>1 ? `M ${toX(0)},${toY(scores[0])} ${scores.map((s,i)=>`L ${toX(i)},${toY(s)}`).join(' ')} L ${toX(scores.length-1)},${chartH} L ${toX(0)},${chartH} Z` : ''

  return (
    <>
      <Nav />
      <main className="page-pad" style={{position:'relative',zIndex:1}}>
        <div className="fredoka" style={{fontSize:'clamp(32px,5vw,52px)',color:'#fff',marginBottom:6}}>Progress Tracker 📈</div>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:15,fontWeight:600,marginBottom:32}}>Longitudinal motor development across assessments</p>

        {/* Child selector */}
        <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:8,marginBottom:28}}>
          {allChildren?.map((c,i)=>(
            <Link key={c.id} href={`/progress?child=${c.id}`} style={{
              background: c.id===selectedId ? 'rgba(255,107,0,0.1)':'rgba(255,255,255,0.06)',
              border: `1.5px solid ${c.id===selectedId?'#FF6B00':'rgba(255,255,255,0.1)'}`,
              borderRadius:16,padding:'14px 20px',cursor:'pointer',flexShrink:0,textAlign:'center',textDecoration:'none',display:'block',
            }}>
              <div style={{width:36,height:36,borderRadius:10,background:avatarGrads[i%6],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Fredoka One,cursive',fontSize:16,color:'#fff',margin:'0 auto 6px'}}>
                {initials(c.full_name)}
              </div>
              <div style={{fontWeight:700,fontSize:13,color:'#fff'}}>{c.full_name.split(' ')[0]}</div>
            </Link>
          ))}
        </div>

        {assessments.length === 0 ? (
          <div className="glass" style={{textAlign:'center',padding:48}}>
            <div style={{fontSize:48,marginBottom:16}}>📋</div>
            <div className="fredoka" style={{fontSize:24,color:'#fff',marginBottom:12}}>No Assessments Yet</div>
            <p style={{color:'rgba(255,255,255,0.5)',marginBottom:24}}>Complete an assessment for {selectedChild?.full_name} to start tracking progress.</p>
            <Link href="/assess" className="btn-primary">✏️ Start Assessment</Link>
          </div>
        ) : (
          <>
            {/* Score chart */}
            <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:24,padding:28,marginBottom:24}}>
              <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
                <div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:700,letterSpacing:.5}}>Current Motor Score</div>
                  <div className="fredoka" style={{fontSize:64,color:'#fff',lineHeight:1}}>{latest?.motor_score??'—'}</div>
                  <div style={{fontSize:13,fontWeight:700,color:trendColor,marginTop:4}}>{trend}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',fontWeight:700}}>Trend</div>
                  <div className="fredoka" style={{fontSize:22,color:gradeColor[latest?.overall_rating]??'#FFE600',marginTop:6}}>{assessments.length>1?'IMPROVING':'BASELINE'}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4}}>{assessments.length} assessment{assessments.length!==1?'s':''} tracked</div>
                </div>
              </div>
              {/* SVG Line Chart */}
              <div style={{width:'100%',height:160,position:'relative'}}>
                <svg viewBox={`0 0 600 ${chartH+40}`} style={{width:'100%',height:'100%'}} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0.2,0.5,0.8].map(r=>(
                    <line key={r} x1={padL} y1={chartH*r} x2={chartW} y2={chartH*r} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  ))}
                  {area && <path d={area} fill="url(#areaGrad)"/>}
                  {scores.length > 1 && <polyline points={pts} fill="none" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
                  {scores.map((s,i)=>(
                    <g key={i}>
                      <circle cx={toX(i)} cy={toY(s)} r="7" fill={i===scores.length-1?'#6EEB3C':'#FF6B00'}/>
                      <text x={toX(i)} y={toY(s)-12} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Nunito" fontWeight="700">{s}</text>
                      <text x={toX(i)} y={chartH+14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Nunito">
                        {new Date(assessments[i].assessed_on).toLocaleDateString('en-ZA',{month:'short',year:'numeric'})}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Per-test bars */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginBottom:24}}>
              {testKeys.map((tk,ti)=>{
                const vals = perTest[tk]
                const maxVal = Math.max(...vals.map(v=>v.val),1)
                const tm = testMeta[tk]
                const first = vals[0]?.val
                const last = vals[vals.length-1]?.val
                const isLower = tk==='shuttle_run'
                const improved = isLower ? last<first : last>first
                return (
                  <div key={tk} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:20}}>
                    <div style={{fontSize:20}}>{tm.icon}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',fontWeight:700,letterSpacing:.5,marginTop:8}}>{tm.label} ({tm.unit})</div>
                    <div style={{display:'flex',gap:4,alignItems:'flex-end',height:60,marginTop:14}}>
                      {vals.map((v,i)=>(
                        <div key={i} style={{flex:1,borderRadius:'4px 4px 0 0',minWidth:12,
                          height:`${(v.val/maxVal)*100}%`,
                          background: barColors[ti],
                          opacity: 0.4 + (i/vals.length)*0.6,
                        }}/>
                      ))}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>Start: {first}{vals[0]?.unit?.[0]}</div>
                      <div style={{fontSize:14,fontWeight:800,color:'#fff'}}>
                        Now: {last}{vals[vals.length-1]?.unit?.[0]} {vals.length>1 && <span style={{color:improved?'#6EEB3C':'#FF2D87'}}>{improved?'↑':'↓'}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Timeline */}
            <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:24,padding:28}}>
              <div className="fredoka" style={{fontSize:22,color:'#fff',marginBottom:20}}>Assessment History</div>
              {[...assessments].reverse().map((a,i)=>{
                const res = resultsBySession[a.id]??[]
                const col = gradeColor[a.overall_rating]??'#FFE600'
                const isLatest = i===0
                return (
                  <div key={a.id} style={{display:'flex',gap:16,padding:'16px 0',borderBottom:i<assessments.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                      <div style={{width:14,height:14,borderRadius:'50%',background:col,flexShrink:0,marginTop:2}}/>
                      {i<assessments.length-1&&<div style={{flex:1,width:1,background:'rgba(255,255,255,0.1)',marginTop:6}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:700,letterSpacing:.5,textTransform:'uppercase'}}>
                        {new Date(a.assessed_on).toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'})}
                        {isLatest&&' — Most Recent'}
                      </div>
                      <div className="fredoka" style={{fontSize:28,color:'#fff',marginTop:4}}>
                        {a.motor_score} <span style={{fontSize:16,color:col}}>{a.overall_rating.toUpperCase()}</span>
                      </div>
                      <div style={{display:'flex',gap:12,marginTop:8,flexWrap:'wrap'}}>
                        {res.map((r:any)=>{
                          const tm=testMeta[r.test_name]
                          const uMap: Record<string,string>={seconds:'s',count:'/10',cm:'cm'}
                          return <div key={r.id} style={{background:'rgba(255,255,255,0.07)',borderRadius:10,padding:'6px 12px',fontSize:12,color:'rgba(255,255,255,0.7)',fontWeight:700}}>{tm?.icon} {r.raw_value}{uMap[r.unit]??''}</div>
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </>
  )
}
