import { useState } from 'react'

const CATEGORIES = ['奖学金', '政策', '高年级状态', '师资', '口碑', '替代指标']
const SOURCE_TYPES = [
  { value: 'officialDocument', label: '官网/官方文件' },
  { value: 'schoolStatement', label: '学校公告' },
  { value: 'teacherOral', label: '招生老师口头' },
  { value: 'parentReport', label: '家长转述' },
  { value: 'wordOfMouth', label: '家长圈口碑' },
  { value: 'unverified', label: '待核实传闻' },
]
const CREDIBILITY = ['高', '中', '低']

export default function IntelForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || {
    category: '奖学金',
    content: '',
    source: '',
    sourceType: 'teacherOral',
    credibility: '中',
    verified: false,
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.content.trim()) return
    onSave(form)
  }

  return (
    <div style={{ padding: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#C62828' }}>📋 情报信息</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>信息类别</div>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>日期</div>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>情报内容 *</div>
            <textarea required placeholder="记录具体信息..." rows={3}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>来源</div>
              <input placeholder="如：招生老师" value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>来源类型</div>
              <select value={form.sourceType} onChange={e => setForm(f => ({ ...f, sourceType: e.target.value }))} style={inputStyle}>
                {SOURCE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>可信度</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {CREDIBILITY.map(c => (
                  <button key={c} type="button"
                    onClick={() => setForm(f => ({ ...f, credibility: c }))}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: '600',
                      background: form.credibility === c ? (c === '高' ? '#4CAF50' : c === '中' ? '#FF9800' : '#F44336') : '#e0e0e0',
                      color: form.credibility === c ? '#fff' : '#666',
                    }}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>是否已验证</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px' }}>
                <input type="checkbox" checked={form.verified}
                  onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px' }}>{form.verified ? '✅ 已交叉验证' : '⏳ 未验证'}</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>备注</div>
            <input placeholder="补充说明..." value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer', fontSize: '15px' }}>取消</button>
          <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#C62828', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
            💾 保存情报
          </button>
        </div>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '14px',
  boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
}
