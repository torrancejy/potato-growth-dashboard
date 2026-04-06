import { useState } from 'react'
import ExamForm from './ExamForm'
import IntelForm from './IntelForm'
import SampleForm from './SampleForm'
export default function QuickAdd({ onAddExam, onAddIntel, onAddSample }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('exam')
  if (!open) return (
    <button onClick={()=>setOpen(true)}
      style={{ position:'fixed', bottom:'80px', right:'20px', width:'56px', height:'56px', borderRadius:'50%',
        background:'#1565C0', color:'#fff', border:'none', fontSize:'28px', cursor:'pointer',
        boxShadow:'0 4px 16px rgba(21,101,192,0.4)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
  )
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTopLeftRadius:'20px', borderTopRightRadius:'20px',
      boxShadow:'0 -4px 30px rgba(0,0,0,0.2)', zIndex:1000, maxHeight:'85vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', padding:'14px 16px 0', gap:'4px' }}>
        <div style={{flex:1,textAlign:'center', padding:'8px 0', borderRadius:'8px 8px 0 0', fontSize:'13px', fontWeight:'700',
          background: tab==='exam'?'#E3F2FD':'transparent', color:tab==='exam'?'#1565C0':'#999', cursor:'pointer'}}
          onClick={()=>setTab('exam')}>📋 考试</div>
        <div style={{flex:1,textAlign:'center', padding:'8px 0', borderRadius:'8px 8px 0 0', fontSize:'13px', fontWeight:'700',
          background: tab==='intel'?'#FFEBEE':'transparent', color:tab==='intel'?'#C62828':'#999', cursor:'pointer'}}
          onClick={()=>setTab('intel')}>🔍 情报</div>
        <div style={{flex:1,textAlign:'center', padding:'8px 0', borderRadius:'8px 8px 0 0', fontSize:'13px', fontWeight:'700',
          background: tab==='sample'?'#E8F5E9':'transparent', color:tab==='sample'?'#2E7D32':'#999', cursor:'pointer'}}
          onClick={()=>setTab('sample')}>★ 样本</div>
        <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',fontSize:'20px',cursor:'pointer',padding:'4px 8px',color:'#999'}}>✕</button>
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        {tab==='exam' && <ExamForm onSave={r=>{onAddExam(r);setOpen(false)}} onCancel={()=>setOpen(false)}/>}
        {tab==='intel' && <IntelForm onSave={r=>{onAddIntel(r);setOpen(false)}} onCancel={()=>setOpen(false)}/>}
        {tab==='sample' && <SampleForm onSave={r=>{onAddSample(r);setOpen(false)}} onCancel={()=>setOpen(false)}/>}
      </div>
    </div>
  )
}
