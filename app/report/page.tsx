import Nav from '@/components/Nav'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

const gradeColor: Record<string,string> = {
  Excellent:'#D4AF37', Good:'#6EEB3C', Average:'#FFE600', 'Needs Support':'#FF2D87',
}
const testMeta: Record<string,{icon:string,label:string}> = {
  balance:    {icon:'⚖️',label:'Balance'},
  shuttle_run:{icon:'🏃',label:'Shuttle Run'},
  throw_catch:{icon:'🎯',label:'Throw & Catch'},
  jump:       {icon:'🦘',label:'Jump Distance'},
}
const ratingBadge = (r:string) => {
  const m: Record<string,{bg:string,col:string,label:string}> = {
    'Good':       {bg:'rgba(110,235,60,.15)',col:'#6EEB3C',label:'✓ Good'},
    'Average':    {bg:'rgba(255,230,0,.15)', col:'#FFE600',label:'~ Average'},
    'Needs work': {bg:'rgba(255,45,135,.15)',col:'#FF2D87',label:'↓ Needs Work'},
  }
  return m[r] ?? m['Average']
}

function initials(name:string){ return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) }

const STRENGTHS: Record<string,string[]> = {
  balance:    ['Great balance & body control','Balance helps with confidence, posture, and coordination in all daily activities.'],
  throw_catch:['Strong hand-eye coordination','Catching well shows excellent visual tracking — a skill that supports reading and writing too!'],
  jump:       ['Explosive leg power','Strong jump distance reflects great lower body strength and coordination.'],
  shuttle_run:['Fast sprint speed','Quick shuttle run shows excellent cardiovascular fitness and agility.'],
}
const IMPROVEMENTS: Record<string,string[]> = {
  balance:    ['Balance needs more practice','Regular one-leg standing games will build core strength and spatial awareness.'],
  throw_catch:['Catching needs practice','Balloon or soft ball games at home will quickly build hand-eye coordination.'],
  jump:       ['Jump distance can grow','Frog jump and squat games build leg power in a fun, natural way.'],
  shuttle_run:['Running speed can improve','More running and chasing games will boost cardiovascular fitness and speed.'],
}
const ACTIVITIES: Record<string,string[]> = {
  balance:    ['Flamingo standing game','Stand on one foot while counting to 20. Challenge family members to beat your time!'],
  throw_catch:['Balloon catch & throw','Use a balloon indoors for slow, easy catching practice before graduating to a ball.'],
  jump:       ['Frog jump races','Frog jumps in the garden build leg power. Measure distance each week and beat your record!'],
  shuttle_run:['Sprint-and-tag','Set up two cones in the garden. Sprint back and forth for 2 minutes — make it a family race!'],
}

export default async function Report({ searchParams }: { searchParams: Promise<{child?:string}> }) {
  const { child: childId } = await searchParams

  let child = null, assessment = null, results: any[] = []

  if (childId) {
    const { data: c } = await supabase.from('children').select('*,schools(name)').eq('id',childId).single()
    child = c
    const { data: a } = await supabase.from('assessments').select('*').eq('child_id',childId).order('assessed_on',{ascending:false}).limit(1).single()
    assessment = a
    if (assessment) {
      const { data: r } = await supabase.from('assessment_results').select('*').eq('assessment_id',assessment.id)
      results = r ?? []
    }
  }

  // Fallback to demo child
  if (!child) {
    const { data: c } = await supabase.from('children').select('*,schools(name)').eq('unique_code','P2P-001').single()
    child = c
    if (c) {
      const { data: a } = await supabase.from('assessments').select('*').eq('child_id',c.id).order('assessed_on',{ascending:false}).limit(1).single()
      assessment = a
      if (a) {
        const { data: r } = await supabase.from('assessment_results').select('*').eq('assessment_id',a.id)
        results = r ?? []
      }
    }
  }

  if (!child || !assessment) {
    return (
      <><Nav/>
      <main className="page-pad" style={{zIndex:1,position:'relative',textAlign:'center',paddingTop:160}}>
        <div className="fredoka" style={{fontSize:48,color:'#fff'}}>No Report Found</div>
        <p style={{color:'rgba(255,255,255,0.5)',margin:'16px 0 32px'}}>Complete an assessment first to generate a report.</p>
        <Link href="/assess" className="btn-primary">✏️ Start Assessment</Link>
      </main></>
    )
  }

  const goodTests = results.filter(r=>r.rating==='Good').map(r=>r.test_name)
  const needsTests = results.filter(r=>r.rating==='Needs work').map(r=>r.test_name)
  const gradeCol = gradeColor[assessment.overall_rating] ?? '#FFE600'
  const ringDash = 471
  const ringOffset = ringDash - (ringDash * (assessment.motor_score / 100))

  return (
    <>
      <Nav />
      <main className="page-pad" style={{position:'relative',zIndex:1}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          {/* Hero */}
          <div style={{textAlign:'center',padding:'20px 0 40px'}}>
            <div style={{width:90,height:90,borderRadius:'50%',margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Fredoka One,cursive',fontSize:36,color:'#fff',background:'linear-gradient(135deg,#FF6B00,#FFE600)',border:'3px solid #D4AF37'}}>
              {initials(child.full_name)}
            </div>
            <div className="fredoka" style={{fontSize:44,color:'#fff'}}>{child.full_name}</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:14,marginTop:6}}>
              {child.schools?.name} · Assessed {new Date(assessment.assessed_on).toLocaleDateString('en-ZA',{day:'numeric',month:'long',year:'numeric'})}
            </div>
            <div style={{display:'inline-block',background:'rgba(212,175,55,.12)',border:'1px solid rgba(212,175,55,.4)',color:'#F0D060',padding:'6px 18px',borderRadius:50,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginTop:14}}>
              Official Motor Report
            </div>
          </div>

          {/* Score ring */}
          <div style={{position:'relative',width:180,height:180,margin:'32px auto'}}>
            <svg viewBox="0 0 180 180" style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B00"/>
                  <stop offset="50%" stopColor="#FFE600"/>
                  <stop offset="100%" stopColor="#6EEB3C"/>
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r="75" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14"/>
              <circle cx="90" cy="90" r="75" fill="none" stroke="url(#rg)" strokeWidth="14"
                strokeLinecap="round" strokeDasharray={ringDash} strokeDashoffset={ringOffset}/>
            </svg>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
              <div className="fredoka" style={{fontSize:54,color:'#fff',lineHeight:1}}>{assessment.motor_score}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.45)',fontWeight:700,letterSpacing:1}}>MOTOR SCORE</div>
              <div className="fredoka" style={{fontSize:18,color:gradeCol}}>{assessment.overall_rating.toUpperCase()}</div>
            </div>
          </div>

          {/* Test breakdown */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,margin:'28px 0'}}>
            {results.map(r => {
              const tm = testMeta[r.test_name]
              const rb = ratingBadge(r.rating)
              const unitMap: Record<string,string> = {seconds:'s',count:'/10',cm:'cm'}
              const dispUnit = unitMap[r.unit]??r.unit
              return (
                <div key={r.id} style={{background:'rgba(255,255,255,0.05)',borderRadius:18,padding:18,textAlign:'center'}}>
                  <div style={{fontSize:28}}>{tm?.icon}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:6,fontWeight:600}}>{tm?.label}</div>
                  <div className="fredoka" style={{fontSize:28,color:'#fff',marginTop:2}}>{r.raw_value}{dispUnit}</div>
                  <div style={{marginTop:8,display:'inline-block',padding:'5px 14px',borderRadius:50,fontSize:11,fontWeight:700,background:rb.bg,color:rb.col}}>{rb.label}</div>
                </div>
              )
            })}
          </div>

          {/* What this means */}
          <div className="glass" style={{marginBottom:24}}>
            <div className="fredoka" style={{fontSize:22,color:'#fff',marginBottom:12}}>What This Means 📖</div>
            <p style={{color:'rgba(255,255,255,0.65)',fontSize:14,lineHeight:1.75}}>
              <strong style={{color:'#fff'}}>{child.full_name}</strong> scored{' '}
              <strong style={{color:'#fff'}}>{assessment.motor_score} out of 100</strong> — placing them in the{' '}
              <strong style={{color:gradeCol}}>{assessment.overall_rating}</strong> range.{' '}
              {assessment.overall_rating === 'Excellent' && 'Outstanding movement skills across all areas!'}
              {assessment.overall_rating === 'Good' && 'Solid motor development with some great strengths.'}
              {assessment.overall_rating === 'Average' && 'On track with room to grow through regular practice.'}
              {assessment.overall_rating === 'Needs Support' && 'Targeted activities will make a big difference quickly.'}
            </p>
          </div>

          {/* Strengths */}
          {goodTests.length > 0 && (
            <div style={{marginBottom:24}}>
              <div className="fredoka" style={{fontSize:22,color:'#fff',marginBottom:14}}>🌟 Strengths</div>
              {goodTests.map(t=>(
                <div key={t} style={{borderLeft:'4px solid #6EEB3C',borderRadius:'0 16px 16px 0',padding:'16px 22px',marginBottom:12,background:'rgba(110,235,60,0.05)'}}>
                  <div style={{fontWeight:800,fontSize:14,color:'#fff'}}>{STRENGTHS[t]?.[0]}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginTop:5,lineHeight:1.6}}>{STRENGTHS[t]?.[1]}</div>
                </div>
              ))}
            </div>
          )}

          {/* Areas to grow */}
          {needsTests.length > 0 && (
            <div style={{marginBottom:24}}>
              <div className="fredoka" style={{fontSize:22,color:'#fff',marginBottom:14}}>🎯 Areas to Grow</div>
              {needsTests.map(t=>(
                <div key={t} style={{borderLeft:'4px solid #FF2D87',borderRadius:'0 16px 16px 0',padding:'16px 22px',marginBottom:12,background:'rgba(255,45,135,0.05)'}}>
                  <div style={{fontWeight:800,fontSize:14,color:'#fff'}}>{IMPROVEMENTS[t]?.[0]}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginTop:5,lineHeight:1.6}}>{IMPROVEMENTS[t]?.[1]}</div>
                </div>
              ))}
            </div>
          )}

          {/* Activities */}
          <div style={{marginBottom:24}}>
            <div className="fredoka" style={{fontSize:22,color:'#fff',marginBottom:14}}>🏡 Activities to Try at Home</div>
            {(needsTests.length>0 ? needsTests : ['balance','jump']).map(t=>(
              <div key={t} style={{borderLeft:'4px solid #00C3FF',borderRadius:'0 16px 16px 0',padding:'16px 22px',marginBottom:12,background:'rgba(0,195,255,0.05)'}}>
                <div style={{fontWeight:800,fontSize:14,color:'#fff'}}>{ACTIVITIES[t]?.[0]}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginTop:5,lineHeight:1.6}}>{ACTIVITIES[t]?.[1]}</div>
              </div>
            ))}
          </div>

          {/* Next assessment */}
          <div className="lux" style={{textAlign:'center',margin:'28px 0'}}>
            <div style={{color:'#F0D060',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:8}}>Next Recommended Assessment</div>
            <div className="fredoka" style={{fontSize:32,color:'#fff'}}>3 Months</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:14,marginTop:6}}>Reassess all 4 tests to track growth</div>
          </div>

          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginTop:40}}>
            <Link href="/progress" className="btn-primary">📈 View Progress</Link>
            <Link href="/assess" className="btn-secondary">✏️ New Assessment</Link>
            <Link href="/dashboard" className="btn-green">📊 Dashboard</Link>
          </div>
        </div>
      </main>
    </>
  )
}
