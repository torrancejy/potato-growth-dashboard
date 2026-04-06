import { useState } from 'react'
const PATH_OPTIONS = ['统招','九上期末提前选拔','一模提前签约','其他']
const TYPE_OPTIONS = ['全面型','理科型','稳定型','偏才型']
const SIMILARITY_OPTIONS = ['高','中','低']
export default function SampleForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || {
    cohort:'2025届', path:'统招', gradeRank:'', districtRank:'', strongIn:'',
    hasCompetitionBg:false, type:'稳定型', similarToPotato:'中', notes:'',
  })
  function handleSubmit(e) { e.preventDefault(); onSave(form) }
  function toggle(k) { setForm(f => ({...f, [k]: !f[k]})) }
  const inputStyle = { width:'100%', padding:'8px 10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box', fontFamily:'inherit', outline:'none' }
  return (
    <div style={{ padding:'16px', maxHeight:'80vh', overflowY:'auto' }}>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        <div style={{ background:'#f5f5f5', borderRadius:'12px', padding:'14px', display:'flex', flexDirection:'column', gap:'10px' }}>
          <div style={{ fontWeight:'700', fontSize:'14px', color:'#1565C0' }}>★ 样本信息</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>届别</div>
              <input placeholder="如：2025届" value={form.cohort} onChange={e=>setForm(f=>({...f,cohort:e.target.value}))} style={inputStyle}/></div>
            <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>入学路径</div>
              <select value={form.path} onChange={e=>setForm(f=>({...f,path:e.target.value}))} style={inputStyle}>{PATH_OPTIONS.map(p=><option key={p}>{p}</option>)}</select></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>大概年级位置</div>
              <input placeholder="如：前100" value={form.gradeRank} onChange={e=>setForm(f=>({...f,gradeRank:e.target.value}))} style={inputStyle}/></div>
            <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>大概区排</div>
              <input placeholder="如：约1500" value={form.districtRank} onChange={e=>setForm(f=>({...f,districtRank:e.target.value}))} style={inputStyle}/></div>
          </div>
          <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>理科/文科强弱</div>
            <input placeholder="如：理科强" value={form.strongIn} onChange={e=>setForm(f=>({...f,strongIn:e.target.value}))} style={inputStyle}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px',background:'#fff',borderRadius:'8px',border:'1px solid #ddd'}}>
              <input type="checkbox" checked={form.hasCompetitionBg} onChange={()=>toggle('hasCompetitionBg')} style={{width:'16px',height:'16px'}}/>
              <span style={{fontSize:'13px'}}>竞赛背景</span></div>
            <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>学生类型</div>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inputStyle}>{TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>与土豆相似度</div>
            <div style={{display:'flex',gap:'4px'}}>{SIMILARITY_OPTIONS.map(s=>(
              <button key={s} type="button" onClick={()=>setForm(f=>({...f,similarToPotato:s}))}
                style={{flex:1,padding:'6px 0',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'600',
                  background: form.similarToPotato===s ? (s==='高'?'#4CAF50':'#e0e0e0') : '#e0e0e0',
                  color: form.similarToPotato===s ? '#fff':'#666'}}>{s}</button>))}</div></div>
          <div><div style={{fontSize:'12px',color:'#666',marginBottom:'2px'}}>备注</div>
            <textarea placeholder="补充说明..." rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{...inputStyle,resize:'vertical'}}/></div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button type="button" onClick={onCancel} style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid #ccc',background:'#f5f5f5',cursor:'pointer',fontSize:'15px'}}>取消</button>
          <button type="submit" style={{flex:2,padding:'12px',borderRadius:'10px',border:'none',background:'#1565C0',color:'#fff',cursor:'pointer',fontSize:'15px',fontWeight:'700'}}>★ 保存样本</button>
        </div>
      </form>
    </div>
  )
}
