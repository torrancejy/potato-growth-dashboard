export default function HeaderNav({ page, onChange }) {
  const tabs = [
    { id:'overview',  label:'总览', icon:'🏠' },
    { id:'exam',      label:'考试', icon:'📋' },
    { id:'subject',   label:'学科', icon:'📊' },
    { id:'intel',     label:'情报', icon:'🔍' },
  ]
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff',
      display:'flex', borderTop:'1px solid #E0E0E0', zIndex:900, paddingBottom:'env(safe-area-inset-bottom)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)}
          style={{ flex:1, padding:'10px 4px', border:'none', background:'none', cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
          <span style={{ fontSize:'22px' }}>{t.icon}</span>
          <span style={{ fontSize:'11px', fontWeight: page===t.id?'700':'400',
            color: page===t.id?'#1565C0':'#9E9E9E' }}>{t.label}</span>
          {page===t.id && <div style={{ width:'20px', height:'3px', background:'#1565C0', borderRadius:'2px', marginTop:'1px' }}/>}
        </button>
      ))}
    </div>
  )
}
