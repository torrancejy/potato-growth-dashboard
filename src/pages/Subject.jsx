import { computeAllSubjectStates } from '../rules/engine'
import { SUBJECTS_META, SUBJECT_KEYS } from '../data/initialData'

export default function Subject({ exams, targets }) {
  const states = computeAllSubjectStates(exams, targets)

  return (
    <div style={{padding:'16px',paddingBottom:'80px',display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{background:'#7B1FA2',borderRadius:'14px',padding:'16px',color:'#fff'}}>
        <div style={{fontSize:'18px',fontWeight:'700'}}>📊 五科状态追踪</div>
        <div style={{fontSize:'12px',opacity:0.85,marginTop:'2px'}}>数据驱动 · 自动计算 · 实时更新</div>
      </div>

      {SUBJECT_KEYS.map(k => {
        const s = states[k]
        const pct = s?.score && s?.target ? Math.round((s.score / s.target) * 100) : null
        const barColor = s?.statusColor || '#e0e0e0'
        return (
          <div key={k} style={{background:'#fff',borderRadius:'14px',padding:'16px',border:'2px solid '+barColor}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
              <div>
                <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'2px'}}>{SUBJECTS_META[k].icon} {SUBJECTS_META[k].label}</div>
                <div style={{fontSize:'12px',color:'#888'}}>证据来源：{s?.evidence?.length || 0} 条</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'32px',fontWeight:'800',color:barColor,lineHeight:1}}>
                  {s?.score !== null && s?.score !== undefined ? s.score : '—'}
                  <span style={{fontSize:'14px',fontWeight:'400',color:'#999'}}>/{s?.target||'?'}</span>
                </div>
                <div style={{fontSize:'12px',fontWeight:'600',color:barColor,marginTop:'2px'}}>{s?.label || '暂无数据'}</div>
              </div>
            </div>

            {pct !== null && (
              <div style={{background:'#e0e0e0',borderRadius:'4px',height:'8px',marginBottom:'10px'}}>
                <div style={{width:pct+'%',background:barColor,height:'100%',borderRadius:'4px',transition:'width 0.5s'}}/>
              </div>
            )}

            {s?.evidence?.map((ev,i)=>(
              <div key={i} style={{fontSize:'12px',color:'#555',background:'#FAFAFA',borderRadius:'6px',padding:'6px 8px',marginBottom:'3px',display:'flex',gap:'6px',alignItems:'flex-start'}}>
                <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'4px',flexShrink:0,
                  background: ev.type==='exam' ? '#E3F2FD' : ev.type==='teacher' ? '#FFF3E0' : '#F5F5F5',
                  color:    ev.type==='exam' ? '#1565C0' : ev.type==='teacher' ? '#E65100' : '#666',
                }}>{ev.type==='exam'?'考试':ev.type==='teacher'?'老师':'其他'}</span>
                <span style={{lineHeight:'1.5'}}>{ev.text}</span>
              </div>
            ))}

            <div style={{marginTop:'8px',padding:'8px',background:'#FFF8E1',borderRadius:'6px'}}>
              <div style={{fontSize:'11px',color:'#E65100',fontWeight:'600',marginBottom:'2px'}}>→ 行动建议</div>
              <div style={{fontSize:'13px',color:'#333',lineHeight:'1.5'}}>{s?.action || '先录入考试成绩'}</div>
            </div>

            {s?.shortboard && s.shortboard !== '待分析' && (
              <div style={{marginTop:'6px',fontSize:'12px',color:'#C62828'}}>⚠️ 短板：{s.shortboard}</div>
            )}

            {s?.competitive && (
              <div style={{marginTop:'8px',padding:'6px 10px',borderRadius:'6px',background:s.competitive.color+'18',border:'1px solid '+s.competitive.color+'44',display:'flex',alignItems:'center',gap:'6px'}}>
                <span style={{fontSize:'12px',color:s.competitive.color,fontWeight:'600'}}>{s.competitive.label}</span>
                <span style={{fontSize:'11px',color:'#888'}}>{s.competitive.rankType === 'grade' ? '年级' : '班级'}排位约前{s.competitive.pct}%</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
