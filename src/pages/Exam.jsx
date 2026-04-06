import { useState, useEffect, useMemo } from 'react'
import ExamForm from '../components/ExamForm'
import { computeTrendJudgment } from '../rules/engine'
import { SUBJECT_KEYS, SUBJECTS_META, EXAM_NODES, getExamNodeStatus } from '../data/initialData'

// 节点颜色映射
const NODE_COLORS = {
  past:     { dot: '#BDBDBD', tag: '#F5F5F5', tagText: '#9E9E9E', text: '#9E9E9E' },
  current:  { dot: '#1565C0', tag: '#E3F2FD', tagText: '#1565C0', text: '#1565C0' },
  upcoming:  { dot: '#42A5F5', tag: '#E3F2FD', tagText: '#1976D2', text: '#333' },
  future:    { dot: '#90CAF9', tag: '#F5F5F5', tagText: '#757575', text: '#555' },
  unknown:   { dot: '#BDBDBD', tag: '#F5F5F5', tagText: '#9E9E9E', text: '#9E9E9E' },
}

export default function Exam({ exams, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [now, setNow] = useState(Date.now())
  const trend = computeTrendJudgment(exams)

  // 每分钟更新一次当前时间，保持节点状态新鲜
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  // 实时计算每个节点状态
  const nodeStatuses = useMemo(() => {
    return EXAM_NODES.map(n => ({ ...n, status: getExamNodeStatus(n) }))
  }, [now])

  if (showForm || editing) {
    return (
      <div style={{background:'#0A1628',minHeight:'100vh'}}>
        <ExamForm initial={editing} onSave={r=>{onAdd(r);setShowForm(false);setEditing(null)}} onCancel={()=>{setShowForm(false);setEditing(null)}}/>
      </div>
    )
  }

  return (
    <div style={{padding:'16px',paddingBottom:'80px',display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{background:'#1565C0',borderRadius:'14px',padding:'16px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'18px',fontWeight:'700'}}>📋 考试记录</div>
          <div style={{fontSize:'12px',opacity:0.85,marginTop:'2px'}}>共 {exams.length} 条记录</div>
        </div>
        <button onClick={()=>setShowForm(true)} style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.4)',borderRadius:'10px',padding:'10px 16px',color:'#fff',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>+ 新增考试</button>
      </div>

      {exams.length === 0 && (
        <div style={{background:'#fff',borderRadius:'14px',padding:'40px',textAlign:'center',color:'#999'}}>
          <div style={{fontSize:'40px',marginBottom:'8px'}}>📋</div>
          <div style={{fontSize:'15px'}}>还没有考试记录</div>
          <div style={{fontSize:'13px',marginTop:'4px'}}>点击上方按钮录入第一次成绩</div>
        </div>
      )}

      {exams.map(exam => (
        <div key={exam.id} style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
            <div>
              <div style={{fontSize:'16px',fontWeight:'700',color:'#1565C0'}}>{exam.name}</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>{exam.date}{exam.rank?.grade?' · 年级'+exam.rank.grade:''}</div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>setEditing(exam)} style={{background:'#E3F2FD',border:'none',borderRadius:'6px',padding:'4px 10px',fontSize:'12px',color:'#1565C0',cursor:'pointer'}}>编辑</button>
              <button onClick={()=>onDelete(exam.id)} style={{background:'#FFEBEE',border:'none',borderRadius:'6px',padding:'4px 10px',fontSize:'12px',color:'#C62828',cursor:'pointer'}}>删除</button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'6px',marginBottom:'8px'}}>
            {SUBJECT_KEYS.map(k=>(
              <div key={k} style={{background:SUBJECTS_META[k].color,borderRadius:'8px',padding:'6px 4px',textAlign:'center'}}>
                <div style={{fontSize:'10px',color:'#888'}}>{SUBJECTS_META[k].icon} {SUBJECTS_META[k].label}</div>
                <div style={{fontSize:'16px',fontWeight:'800',color:SUBJECTS_META[k].statusColor}}>{exam.subjects?.[k]?.score!=null?exam.subjects[k].score:'-'}</div>
              </div>
            ))}
          </div>
          {exam.teacherFeedback && <div style={{fontSize:'12px',color:'#666',background:'#FFFDE7',borderRadius:'6px',padding:'6px 8px',marginBottom:'4px'}}>💬 {exam.teacherFeedback}</div>}
          {exam.notes && <div style={{fontSize:'12px',color:'#888',fontStyle:'italic'}}>备注：{exam.notes}</div>}
        </div>
      ))}

      {exams.length >= 2 && (
        <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
          <div style={{fontSize:'14px',fontWeight:'700',color:'#7B1FA2',marginBottom:'10px'}}>📈 趋势判断（近{Math.min(exams.length,3)}次）</div>
          <div style={{marginBottom:'8px'}}>
            {trend.items.map((item,i)=>{
              const borderColor = item.satisfied ? '#4CAF50' : '#e0e0e0'
              const bg = item.satisfied ? '#4CAF50' : 'transparent'
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 0',borderBottom:i<trend.items.length-1?'1px solid #f0f0f0':'none'}}>
                  <div style={{width:'18px',height:'18px',borderRadius:'50%',border:'2px solid '+borderColor,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {item.satisfied && <span style={{color:'#fff',fontSize:'10px'}}>✓</span>}
                  </div>
                  <span style={{fontSize:'12px',color:item.satisfied?'#2E7D32':'#999'}}>{item.label}{item.skipped?'（数据不足）':''}</span>
                </div>
              )
            })}
          </div>
          <div style={{fontSize:'13px',color:'#1565C0',fontWeight:'600'}}>判断结果：{trend.score}/{trend.total} 条满足</div>
        </div>
      )}

      <div style={{background:'#fff',borderRadius:'14px',padding:'16px'}}>
        <div style={{fontSize:'14px',fontWeight:'700',color:'#1565C0',marginBottom:'16px'}}>◎ 关键考试节点</div>
        <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
          {nodeStatuses.map((node,idx)=>{
            const c = NODE_COLORS[node.status] || NODE_COLORS.unknown
            return (
            <div key={node.num} style={{display:'flex',gap:'14px'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'36px'}}>
                <div style={{
                  width:'32px',height:'32px',borderRadius:'50%',
                  background: c.dot, color:'#fff',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:'14px',fontWeight:'700',flexShrink:0,
                  boxShadow: node.status === 'current' ? `0 0 0 3px ${c.dot}44` : 'none',
                }}>
                  {node.status === 'past' ? '✓' : node.num}
                </div>
                {idx<nodeStatuses.length-1&&<div style={{width:'2px',flex:1,background:c.dot,mixBlendMode:'multiply',minHeight:'30px',margin:'4px 0',opacity:0.3}}/>}
              </div>
              <div style={{paddingBottom:idx<nodeStatuses.length-1?'16px':'0',flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontWeight:'700',fontSize:'15px',color: c.text}}>{node.name}</span>
                  <span style={{background: c.tag, color: c.tagText, borderRadius:'20px',padding:'2px 8px',fontSize:'12px'}}>
                    {node.status === 'past' ? '已结束' : node.status === 'current' ? '🔥 进行中' : node.dateStart ? node.dateStart.replace(/-/g, '/').replace(/^2026\//,'').replace(/^2027\//,'') + (node.dateEnd && node.dateEnd !== node.dateStart ? '–' + node.dateEnd.slice(-2) : '') : '日期待定'}
                  </span>
                  <span style={{background:'#1565C0',color:'#fff',borderRadius:'20px',padding:'2px 10px',fontSize:'12px',fontWeight:'600'}}>{node.action}</span>
                </div>
                <div style={{marginTop:'4px',fontSize:'12px',color:c.text,opacity:0.7}}>→ {node.check1}</div>
                <div style={{fontSize:'12px',color:c.text,opacity:0.7}}>→ {node.check2}</div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}
