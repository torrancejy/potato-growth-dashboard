import { useState, useEffect } from 'react'
import { computeOverview, computeStrategy } from '../rules/engine'
import { SUBJECTS_META, SUBJECT_KEYS } from '../data/initialData'

const MIDTERM = new Date('2026-04-21T00:00:00')

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = MIDTERM - now
  if (diff <= 0) return '已开始'
  const d = Math.floor(diff/86400000)
  const h = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0')
  const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0')
  const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0')
  return d > 0 ? `${d}天 ${h}:${m}:${s}` : `${h}:${m}:${s}`
}

export default function Overview({ exams, targets, manual, onToggleJudgment, strategyMode, onStrategyModeChange }) {
  const cd = useCountdown()
  // 策略模式：auto=自动判断，aggressive=强制激进，conservative=强制保守
  const effectiveMode = strategyMode === 'auto'
    ? (computeStrategy(exams, manual).mode === '激进' ? 'aggressive' : 'conservative')
    : strategyMode
  // 把用户手动选择传给 computeOverview，让权重也跟随用户选择
  const { zone, weights, judgment, states } = computeOverview(exams, targets, manual, effectiveMode)

  const gradeRank = exams[0]?.rank?.grade || '—'

  // 展示用策略内容
  const strategyMap = {
    aggressive: {
      modeLabel: '↑ 继续激进',
      color: '#2E7D32',
      advice: '实验继续留作主冲目标，仁泽重点盯但不提前绑定',
    },
    conservative: {
      modeLabel: '→ 稍微保守',
      color: '#E65100',
      advice: '别放弃冲高，但需要把仁泽和稳妥校的权重提上来',
    },
  }
  const displayStrategy = strategyMap[effectiveMode] || strategyMap.conservative

  return (
    <div style={{padding:'16px',paddingBottom:'80px',display:'flex',flexDirection:'column',gap:'14px'}}>

      {/* 主追踪卡 */}
      <div style={{background:'linear-gradient(135deg,#1565C0,#0D47A1)',borderRadius:'16px',padding:'20px',boxShadow:'0 4px 20px rgba(21,101,192,0.4)',color:'#fff'}}>
        <div style={{fontSize:'13px',opacity:0.85,marginBottom:'4px'}}>🦞 土豆成长追踪 · 初二下学期 · 2026</div>
        <div style={{fontSize:'22px',fontWeight:'700',marginBottom:'10px'}}>现阶段最对的做法</div>
        <div style={{fontSize:'14px',opacity:0.9,lineHeight:'1.6',marginBottom:'4px'}}>不是急着选学校，而是用这张表，把她送进<br/><span style={{color:'#FFD54F',fontWeight:'600'}}>「有资格挑」的区间</span>。</div>
        <div style={{fontSize:'12px',opacity:0.75,lineHeight:'1.5'}}>九上完全还有继续突破的可能，尤其对土豆这种「已经不差、而且还有上升趋势」的孩子</div>
        <div style={{display:'flex',gap:'8px',marginTop:'16px',flexWrap:'wrap'}}>
          {[
            {l:'目标', v:'北师大实验中学'},
            {l:'备选', v:'区排前1500 → 仁泽全奖'},
            {l:'现状', v:'年级'+gradeRank+'名'},
          ].map(i=>(
            <div key={i.l} style={{background:'rgba(255,255,255,0.12)',borderRadius:'8px',padding:'8px 12px',flex:'1 1 auto',minWidth:'130px'}}>
              <div style={{fontSize:'11px',opacity:0.7,marginBottom:'2px'}}>{i.l}</div>
              <div style={{fontSize:'13px',fontWeight:'600'}}>{i.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'14px',background:'rgba(255,255,255,0.15)',borderRadius:'12px',padding:'14px',textAlign:'center'}}>
          <div style={{fontSize:'36px',fontWeight:'800',color:'#FFD54F',lineHeight:1}}>{cd}</div>
          <div style={{fontSize:'12px',opacity:0.85,marginTop:'4px'}}>八下期中 · 4月21-23日</div>
        </div>
      </div>

      {/* 区间 */}
      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'12px',color:'#666',marginBottom:'6px',fontWeight:'600'}}>📍 当前区间（自动判断）</div>
        <div style={{background:zone.color+'22',border:'2px solid '+zone.color,borderRadius:'10px',padding:'12px',textAlign:'center'}}>
          <div style={{fontSize:'16px',fontWeight:'800',color:zone.color}}>{zone.label}</div>
          <div style={{fontSize:'11px',color:'#666',marginTop:'4px',lineHeight:'1.5'}}>{zone.desc}</div>
        </div>
      </div>

      {/* 策略（可手动切换） */}
      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'12px',color:'#666',marginBottom:'8px',fontWeight:'600'}}>🎯 当前策略</div>
        <div style={{display:'flex',gap:'6px',marginBottom:'10px'}}>
          {[
            {id:'aggressive', label:'↑ 继续激进'},
            {id:'conservative', label:'→ 稍微保守'},
          ].map(opt=>(
            <button key={opt.id} onClick={()=>onStrategyModeChange && onStrategyModeChange(opt.id)}
              style={{flex:1, padding:'9px 0', border:'none', borderRadius:'10px', cursor:'pointer',
                fontSize:'14px', fontWeight:'700',
                background: effectiveMode===opt.id ? (opt.id==='aggressive'?'#2E7D32':'#E65100') : '#e0e0e0',
                color: effectiveMode===opt.id ? '#fff' : '#666',
                transition:'all 0.2s'}}>
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{background:displayStrategy.color,borderRadius:'10px',padding:'12px',color:'#fff'}}>
          <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'4px'}}>{displayStrategy.modeLabel}</div>
          <div style={{fontSize:'12px',opacity:0.9,lineHeight:'1.5'}}>{displayStrategy.advice}</div>
        </div>
      </div>

      {/* 总控台 */}
      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'14px',fontWeight:'700',color:'#1565C0',marginBottom:'12px'}}>🎛️ 路径权重（{effectiveMode==='aggressive'?'激进模式':'保守模式'}）</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
          {[
            {l:'① 仁泽全奖权重',v:weights.renzheng,   c:'#C62828'},
            {l:'② 实验冲刺权重',v:weights.experiment,  c:'#E65100'},
            {l:'③ 稳妥校托底',v:weights.safe,        c:'#1565C0'},
            {l:'④ 隐性路径观察',v:weights.observe,    c:'#7B1FA2'},
          ].map(i=>(
            <div key={i.l} style={{background:'#f5f5f5',borderRadius:'10px',padding:'10px 12px'}}>
              <div style={{fontSize:'11px',color:'#666',marginBottom:'4px'}}>{i.l}</div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{flex:1,background:'#e0e0e0',borderRadius:'4px',height:'8px'}}><div style={{width:i.v+'%',background:i.c,height:'100%',borderRadius:'4px'}}/></div>
                <span style={{fontSize:'16px',fontWeight:'800',color:i.c,minWidth:'36px',textAlign:'right'}}>{i.v}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 核心判断清单（5条） */}
      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'14px',fontWeight:'700',color:'#1565C0',marginBottom:'4px'}}>✔ 核心判断清单</div>
        <div style={{fontSize:'11px',color:'#888',marginBottom:'10px'}}>
          满足5条里的3条 = 冲高成功趋势 · <b>{judgment.score}/{judgment.total}</b> {judgment.met?'✅':'⏳'}
          {judgment.score < 3 && '（需补充数据）'}
        </div>
        {judgment.items.map((item,i)=>(
          <div key={i}
            onClick={()=>item.manual && onToggleJudgment && onToggleJudgment(item.rule)}
            style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'7px 0',
              borderBottom: i < judgment.items.length-1 ? '1px solid #f0f0f0' : 'none',
              cursor: item.manual ? 'pointer' : 'default'}}>
            <div style={{width:'18px',height:'18px',borderRadius:'50%',border:'2px solid '+(item.satisfied?'#4CAF50':item.skipped?'#FFC107':'#e0e0e0'),
              background: item.satisfied ? '#4CAF50' : item.skipped ? '#FFF8E1' : 'transparent',
              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'1px'}}>
              {item.satisfied ? <span style={{color:'#fff',fontSize:'10px'}}>✓</span>
              : item.skipped ? <span style={{color:'#FF9800',fontSize:'10px',fontSize:'9px'}}>?</span> : null}
            </div>
            <div style={{flex:1}}>
              <span style={{fontSize:'12px',color: item.satisfied ? '#2E7D32' : item.skipped ? '#FF9800' : '#999'}}>
                {item.label}
              </span>
              {item.skipped && <span style={{fontSize:'10px',color:'#FF9800',marginLeft:'4px'}}>（数据不足）</span>}
              {item.manual && <span style={{fontSize:'10px',color:'#999',marginLeft:'4px'}}>（手动）</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 五科小卡 */}
      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'14px',fontWeight:'700',color:'#7B1FA2',marginBottom:'12px'}}>📊 五科状态</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:'8px'}}>
          {SUBJECT_KEYS.map(k=>{
            const s = states[k]
            const trendIcon = s?.trend==='up'?'↑':s?.trend==='down'?'↓':s?.trend==='stable'?'→':'?'
            return (
              <div key={k} style={{background:SUBJECTS_META[k].color,borderRadius:'10px',padding:'10px',border:'1.5px solid '+ (s?.statusColor||'#e0e0e0')}}>
                <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'2px'}}>{SUBJECTS_META[k].icon} {SUBJECTS_META[k].label}</div>
                <div style={{fontSize:'24px',fontWeight:'800',color:s?.statusColor||'#333'}}>{s?.score!=null && s?.score!==undefined ? s.score : '—'}</div>
                <div style={{fontSize:'11px',color:s?.statusColor||'#666',fontWeight:'600'}}>{s?.label||'暂无'}</div>
                <div style={{fontSize:'10px',color:'#999'}}>{trendIcon} 趋势 {s?.trend==='unknown'?'未知':''}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
