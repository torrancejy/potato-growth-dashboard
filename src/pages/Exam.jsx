import { useState } from 'react'
import ExamForm from '../components/ExamForm'
import { computeTrendJudgment } from '../rules/engine'
import { SUBJECT_KEYS, SUBJECTS_META } from '../data/initialData'

const EXAM_NODES = [
  {num:'1',name:'八下期中',date:'4月21-23日',action:'初步定位',check1:'是否已显出向上趋势？',check2:'结构是否比上次更优？'},
  {num:'2',name:'八下期末',date:'6月底',action:'决定暑假主基调',check1:'暑假该不该按冲高配资源？',check2:'仁泽要不要开始重点盯？'},
  {num:'3',name:'九上期中',date:'待定',action:'验证八下是不是假象',check1:'趋势是否延续？',check2:'哪科真正突破？'},
  {num:'4',name:'九上期末/零模',date:'次年1月',action:'第一次真正分流',check1:'实验/仁泽/稳妥校三条线如何分配？',check2:'区排多少？是否达到目标？'},
]

export default function Exam({ exams, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const trend = computeTrendJudgment(exams)

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
          {EXAM_NODES.map((node,idx)=>(
            <div key={node.num} style={{display:'flex',gap:'14px'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'36px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:idx===0?'#1565C0':'#90CAF9',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:'700',flexShrink:0}}>{node.num}</div>
                {idx<EXAM_NODES.length-1&&<div style={{width:'2px',flex:1,background:'#E0E0E0',minHeight:'30px',margin:'4px 0'}}/>}
              </div>
              <div style={{paddingBottom:idx<EXAM_NODES.length-1?'16px':'0',flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontWeight:'700',fontSize:'15px'}}>{node.name}</span>
                  <span style={{background:'#E3F2FD',color:'#1565C0',borderRadius:'20px',padding:'2px 8px',fontSize:'12px'}}>{node.date}</span>
                  <span style={{background:'#1565C0',color:'#fff',borderRadius:'20px',padding:'2px 10px',fontSize:'12px',fontWeight:'600'}}>{node.action}</span>
                </div>
                <div style={{marginTop:'4px',fontSize:'12px',color:'#555'}}>→ {node.check1}</div>
                <div style={{fontSize:'12px',color:'#555'}}>→ {node.check2}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
