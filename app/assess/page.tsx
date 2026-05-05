'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import { supabase, rateTest, calcMotorScore, getAge } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const TESTS = [
  { key:'balance',    icon:'⚖️', label:'Balance',      desc:'Stand on one leg — record seconds', unit:'secs', max:120, step:0.5, color:'#FF6B00' },
  { key:'shuttle_run',icon:'🏃', label:'Shuttle Run',  desc:'10m sprint and back — total seconds', unit:'secs', max:60, step:0.1, color:'#6EEB3C' },
  { key:'throw_catch',icon:'🎯', label:'Throw & Catch',desc:'10 attempts — how many caught',  unit:'/ 10', max:10, step:1, color:'#00C3FF' },
  { key:'jump',       icon:'🦘', label:'Jump Distance',desc:'Standing broad jump — centimetres', unit:'cm', max:250, step:1, color:'#FF2D87' },
]

export default function Assess() {
  const router = useRouter()
  const [schools, setSchools] = useState<{id:string,name:string}[]>([])
  const [childName,  setChildName]  = useState('')
  const [dob,        setDob]        = useState('')
  const [schoolId,   setSchoolId]   = useState('')
  const [gender,     setGender]     = useState('male')
  const [vals,       setVals]       = useState<Record<string,string>>({})
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)

  useEffect(() => {
    supabase.from('schools').select('id,name').then(({data})=>setSchools(data??[]))
  }, [])

  const age = dob ? getAge(dob) : 5
  const ratings = TESTS.map(t => {
    const v = parseFloat(vals[t.key])
    if (isNaN(v)) return null
    return rateTest(t.key, v, age)
  })
  const filledCount = ratings.filter(Boolean).length
  const motorResult = filledCount === 4
    ? calcMotorScore(ratings.map(r=>r!.points))
    : null

  const ratingLabel = (r: {rating:string}|null) => {
    if (!r) return null
    const map: Record<string,{label:string,bg:string,col:string}> = {
      'Good':       {label:'✓ Good',      bg:'rgba(110,235,60,.18)',  col:'#6EEB3C'},
      'Average':    {label:'~ Average',   bg:'rgba(255,230,0,.18)',   col:'#FFE600'},
      'Needs work': {label:'↓ Needs Work',bg:'rgba(255,45,135,.18)', col:'#FF2D87'},
    }
    return map[r.rating] ?? null
  }

  const handleSave = async () => {
    if (!childName || !schoolId || filledCount < 4) return
    setSaving(true)
    try {
      // Upsert child
      const { data: child, error: ce } = await supabase
        .from('children')
        .insert({ full_name:childName, date_of_birth:dob||'2020-01-01', school_id:schoolId, gender, unique_code:`P2P-${Date.now()}` })
        .select().single()
      if (ce) throw ce

      // Insert assessment
      const { data: asmt, error: ae } = await supabase
        .from('assessments')
        .insert({ child_id:child.id, assessed_on:new Date().toISOString().split('T')[0], motor_score:motorResult!.score, overall_rating:motorResult!.grade })
        .select().single()
      if (ae) throw ae

      // Insert results
      const results = TESTS.map(t => ({
        assessment_id: asmt.id,
        test_name: t.key,
        raw_value: parseFloat(vals[t.key]),
        unit: t.unit.replace('/ ',''),
        score_points: ratings[TESTS.indexOf(t)]!.points,
        rating: ratings[TESTS.indexOf(t)]!.rating,
      }))
      await supabase.from('assessment_results').insert(results)

      setSaved(true)
      setTimeout(()=> router.push(`/report?child=${child.id}`), 800)
    } catch(e) {
      console.error(e)
      alert('Save failed — check console')
    } finally { setSaving(false) }
  }

  return (
    <>
      <Nav />
      <main className="page-pad" style={{position:'relative',zIndex:1}}>
        <div className="fredoka" style={{fontSize:'clamp(32px,5vw,52px)',color:'#fff',marginBottom:6}}>New Assessment ✏️</div>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:15,fontWeight:600,marginBottom:32}}>Fill in all 4 tests — takes less than 60 seconds</p>

        <div style={{maxWidth:680,margin:'0 auto'}}>
          {/* Tip bar */}
          <div style={{background:'rgba(255,230,0,0.08)',border:'1px solid rgba(255,230,0,0.2)',borderRadius:16,padding:'16px 20px',marginBottom:24,display:'flex',gap:12}}>
            <span style={{fontSize:20,flexShrink:0}}>💡</span>
            <span style={{fontSize:13,color:'rgba(255,255,255,0.65)',lineHeight:1.6}}>Ratings calculate automatically against age standards. Complete all 4 for a full Motor Score™.</span>
          </div>

          {/* Child info */}
          <div className="glass" style={{marginBottom:20}}>
            <div className="fredoka" style={{fontSize:20,color:'#fff',marginBottom:20}}>Child Information</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Full Name</label>
                <input value={childName} onChange={e=>setChildName(e.target.value)} placeholder="e.g. Liam Mokoena"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Date of Birth</label>
                <input type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>School</label>
                <select value={schoolId} onChange={e=>setSchoolId(e.target.value)}>
                  <option value="">Select school</option>
                  {schools.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Gender</label>
                <select value={gender} onChange={e=>setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tests */}
          {TESTS.map((t,i) => {
            const r = ratingLabel(ratings[i])
            return (
              <div key={t.key} style={{background:'rgba(255,255,255,0.055)',border:`1px solid ${vals[t.key]?t.color:'rgba(255,255,255,0.1)'}`,borderRadius:24,padding:26,marginBottom:18,transition:'all .2s'}}>
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
                  <div style={{width:50,height:50,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,background:`${t.color}22`,flexShrink:0}}>{t.icon}</div>
                  <div style={{flex:1}}>
                    <div className="fredoka" style={{fontSize:20,color:'#fff'}}>{t.label}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:2}}>{t.desc}</div>
                  </div>
                  {r && <div style={{padding:'6px 14px',borderRadius:50,fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:'uppercase',background:r.bg,color:r.col}}>{r.label}</div>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <input
                    type="number" min={0} max={t.max} step={t.step}
                    placeholder="0"
                    value={vals[t.key]??''}
                    onChange={e=>setVals(v=>({...v,[t.key]:e.target.value}))}
                    style={{fontSize:30,fontWeight:900,textAlign:'center',padding:'12px 20px'}}
                  />
                  <span style={{color:'rgba(255,255,255,0.45)',fontSize:13,fontWeight:700,minWidth:40}}>{t.unit}</span>
                </div>
              </div>
            )
          })}

          {/* Motor score preview */}
          {motorResult && (
            <div className="glass" style={{textAlign:'center',padding:28,marginTop:8,marginBottom:8}}>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Calculated Motor Score™</div>
              <div className="fredoka" style={{fontSize:72,color:'#fff',lineHeight:1}}>{motorResult.score}</div>
              <div className="fredoka" style={{fontSize:22,marginTop:4,color:motorResult.grade==='Excellent'?'#D4AF37':motorResult.grade==='Good'?'#6EEB3C':motorResult.grade==='Average'?'#FFE600':'#FF2D87'}}>{motorResult.grade}</div>
            </div>
          )}

          {saved && <div style={{textAlign:'center',padding:16,color:'#6EEB3C',fontWeight:700,fontSize:16}}>✅ Saved! Redirecting to report…</div>}

          <div style={{display:'flex',gap:16,justifyContent:'flex-end',marginTop:32}}>
            <button className="btn-secondary" onClick={()=>router.push('/dashboard')}>← Back</button>
            <button
              className="btn-green"
              onClick={handleSave}
              disabled={saving||!childName||!schoolId||filledCount<4}
              style={{opacity:(!childName||!schoolId||filledCount<4)?0.5:1}}
            >
              {saving?'Saving…':'📋 Save & Generate Report'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
