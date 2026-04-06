import { useState } from 'react'
import IntelForm from '../components/IntelForm'
import SampleForm from '../components/SampleForm'

const CRED_MAP = { '高': '#4CAF50', '中': '#FF9800', '低': '#F44336' }
const CAT_COLORS = { '奖学金':'#C62828','政策':'#E65100','高年级状态':'#1565C0','师资':'#7B1FA2','口碑':'#2E7D32','替代指标':'#455A64' }

const SOURCE_TYPE_LABELS = {
  officialDocument:'官网/官方文件', schoolStatement:'学校公告',
  teacherOral:'招生老师口头', parentReport:'家长转述',
  wordOfMouth:'家长圈口碑', unverified:'待核实传闻',
}

const SAMPLE_PATH_LABELS = { '统招':'统招','九上期末提前选拔':'九上提前','一模提前签约':'一模签约','其他':'其他' }

export default function Intel({ intels, samples, onAddIntel, onDeleteIntel, onAddSample, onDeleteSample }) {
  const [tab, setTab] = useState('intel')
  const [showIntelForm, setShowIntelForm] = useState(false)
  const [showSampleForm, setShowSampleForm] = useState(false)

  if (showIntelForm) return <IntelForm onSave={r=>{onAddIntel(r);setShowIntelForm(false)}} onCancel={()=>setShowIntelForm(false)}/>
  if (showSampleForm) return <SampleForm onSave={r=>{onAddSample(r);setShowSampleForm(false)}} onCancel={()=>setShowSampleForm(false)}/>

  return (
    <div style={{padding:'16px',paddingBottom:'80px',display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{background:'#1565C0',borderRadius:'14px',padding:'16px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'18px',fontWeight:'700'}}>🔍 情报与样本</div>
          <div style={{fontSize:'12px',opacity:0.85,marginTop:'2px'}}>仁泽信息 · 实验样本追踪</div>
        </div>
        <button onClick={()=>tab==='intel'?setShowIntelForm(true):setShowSampleForm(true)}
          style={{background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.4)',borderRadius:'10px',padding:'10px 16px',color:'#fff',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>
          + 新增
        </button>
      </div>

      <div style={{display:'flex',background:'#f5f5f5',borderRadius:'10px',padding:'4px',gap:'4px'}}>
        {[['intel','📋 仁泽情报'],['sample','★ 实验样本']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{flex:1,padding:'8px',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:'600',
              background:tab===id?'#1565C0':'transparent',color:tab===id?'#fff':'#666',transition:'all 0.2s'}}>{label}</button>
        ))}
      </div>

      {tab === 'intel' && (
        <>
          {intels.length === 0 && (
            <div style={{background:'#fff',borderRadius:'14px',padding:'32px',textAlign:'center',color:'#999'}}>
              <div style={{fontSize:'40px',marginBottom:'8px'}}>🔍</div>
              <div>还没有情报记录</div>
            </div>
          )}
          {intels.map(it=>(
            <div key={it.id} style={{background:'#fff',borderRadius:'14px',padding:'14px',border:`2px solid ${CAT_COLORS[it.category]||'#e0e0e0'}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'12px',fontWeight:'700',background:CAT_COLORS[it.category]||'#666',color:'#fff',padding:'2px 8px',borderRadius:'20px'}}>{it.category}</span>
                  <span style={{fontSize:'11px',color:'#888'}}>{it.date}</span>
                  <span style={{fontSize:'11px',padding:'1px 6px',borderRadius:'4px',background:it.verified?'#E8F5E9':'#FFF3E0',color:it.verified?'#2E7D32':'#E65100'}}>{it.verified?'✅ 已验证':'⏳ 未验证'}</span>
                  <span style={{fontSize:'11px',padding:'1px 6px',borderRadius:'4px',background:CRED_MAP[it.credibility]+'22',color:CRED_MAP[it.credibility]}}>可信度：{it.credibility}</span>
                </div>
                <button onClick={()=>onDeleteIntel(it.id)} style={{background:'#FFEBEE',border:'none',borderRadius:'6px',padding:'3px 8px',fontSize:'11px',color:'#C62828',cursor:'pointer'}}>删除</button>
              </div>
              <div style={{fontSize:'14px',color:'#222',lineHeight:'1.6',marginBottom:'4px'}}>{it.content}</div>
              <div style={{fontSize:'11px',color:'#888'}}>来源：{SOURCE_TYPE_LABELS[it.sourceType]||it.sourceType} {it.source?'· '+it.source:''}</div>
              {it.notes && <div style={{fontSize:'11px',color:'#888',fontStyle:'italic',marginTop:'2px'}}>备注：{it.notes}</div>}
            </div>
          ))}
        </>
      )}

      {tab === 'sample' && (
        <>
          <div style={{background:'#E8F5E9',borderRadius:'10px',padding:'10px 14px',fontSize:'12px',color:'#2E7D32',lineHeight:'1.6'}}>
            💡 <b>最重要的一类样本：</b>和土豆画像接近（不一定是顶尖），但最终去了实验或仁泽的学生。这类样本比年级排名更有参考价值。
          </div>
          {samples.length === 0 && (
            <div style={{background:'#fff',borderRadius:'14px',padding:'32px',textAlign:'center',color:'#999'}}>
              <div style={{fontSize:'40px',marginBottom:'8px'}}>★</div>
              <div>还没有样本记录</div>
            </div>
          )}
          {samples.map(s=>(
            <div key={s.id} style={{background:'#fff',borderRadius:'14px',padding:'14px',border:'1px solid #E0E0E0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'#1565C0'}}>{s.cohort}</span>
                  <span style={{fontSize:'11px',background:'#E3F2FD',color:'#1565C0',padding:'1px 6px',borderRadius:'4px'}}>{SAMPLE_PATH_LABELS[s.path]||s.path}</span>
                  {s.similarToPotato==='高'&&<span style={{fontSize:'11px',background:'#4CAF50',color:'#fff',padding:'1px 6px',borderRadius:'4px'}}>⭐ 最像土豆</span>}
                  {s.similarToPotato==='中'&&<span style={{fontSize:'11px',background:'#FF9800',color:'#fff',padding:'1px 6px',borderRadius:'4px'}}>相似度中</span>}
                </div>
                <button onClick={()=>onDeleteSample(s.id)} style={{background:'#FFEBEE',border:'none',borderRadius:'6px',padding:'3px 8px',fontSize:'11px',color:'#C62828',cursor:'pointer'}}>删除</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px',fontSize:'12px',marginBottom:'4px'}}>
                {[
                  ['年级',s.gradeRank],
                  ['区排',s.districtRank],
                  ['类型',s.type],
                  ['强项',s.strongIn],
                ].map(([l,v])=>v?<div key={l}><span style={{color:'#888'}}>{l}：</span><span style={{color:'#333'}}>{v}</span></div>:null)}
              </div>
              {s.notes && <div style={{fontSize:'12px',color:'#666',fontStyle:'italic'}}>{s.notes}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
