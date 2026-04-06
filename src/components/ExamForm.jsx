import { useState } from 'react'
import { SUBJECT_KEYS, SUBJECTS_META } from '../data/initialData'

const SOURCE_TYPES = [
  { value: 'officialDocument', label: '官方文件/成绩单' },
  { value: 'schoolStatement', label: '学校公告' },
  { value: 'teacherOral', label: '招生老师口头' },
  { value: 'parentReport', label: '家长转述' },
  { value: 'wordOfMouth', label: '家长圈口碑' },
  { value: 'unverified', label: '待核实' },
]

export default function ExamForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || {
    name: '',
    date: '',
    examType: 'formal',
    rank: { grade: '', gradeSource: 'GPT推算', class: '', classSource: '班级数据' },
    subjects: SUBJECT_KEYS.reduce((acc, k) => ({ ...acc, [k]: { score: '', majorLoss: '', carelessLoss: 0 } }), {}),
    source: '',
    sourceType: 'officialDocument',
    teacherFeedback: '',
    childState: '',
    notes: '',
  })

  function setSubject(key, field, value) {
    setForm(f => ({
      ...f,
      subjects: { ...f.subjects, [key]: { ...f.subjects[key], [field]: value } },
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const parsed = {
      ...form,
      rank: {
        ...form.rank,
        grade: form.rank.grade,
      },
      subjects: Object.fromEntries(
        SUBJECT_KEYS.map(k => [k, {
          ...form.subjects[k],
          score: form.subjects[k].score === '' ? null : Number(form.subjects[k].score),
          carelessLoss: Number(form.subjects[k].carelessLoss || 0),
        }])
      ),
      examType: form.examType || 'formal',
    }
    onSave(parsed)
  }

  return (
    <div style={{ padding: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* 基础信息 */}
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#1565C0' }}>📋 考试信息</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <Field label="考试名称" required>
              <input required placeholder="如：八下期中" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </Field>
            <Field label="考试日期" required>
              <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </Field>
            <Field label="考试类型">
              <select value={form.examType || 'formal'} onChange={e => setForm(f => ({ ...f, examType: e.target.value }))} style={inputStyle}>
                <option value="formal">正式成绩</option>
                <option value="unit">单元测</option>
                <option value="quiz">随堂测验</option>
              </select>
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Field label="年级排名">
              <input placeholder="如：约60" value={form.rank.grade} onChange={e => setForm(f => ({ ...f, rank: { ...f.rank, grade: e.target.value } }))} style={inputStyle} />
            </Field>
            <Field label="年级排名来源">
              <select value={form.rank.gradeSource} onChange={e => setForm(f => ({ ...f, rank: { ...f.rank, gradeSource: e.target.value } }))} style={inputStyle}>
                <option>GPT推算</option>
                <option>成绩单</option>
                <option>老师告知</option>
                <option>自估</option>
              </select>
            </Field>
            <Field label="班内排名">
              <input placeholder="如：前10" value={form.rank.class} onChange={e => setForm(f => ({ ...f, rank: { ...f.rank, class: e.target.value } }))} style={inputStyle} />
            </Field>
            <Field label="班排来源">
              <select value={form.rank.classSource} onChange={e => setForm(f => ({ ...f, rank: { ...f.rank, classSource: e.target.value } }))} style={inputStyle}>
                <option>班级数据</option>
                <option>成绩单</option>
                <option>老师告知</option>
              </select>
            </Field>
          </div>
        </div>

        {/* 五科分数 */}
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#7B1FA2' }}>📊 五科分数</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            {SUBJECT_KEYS.map(k => (
              <div key={k} style={{ background: '#fff', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{SUBJECTS_META[k].icon} {SUBJECTS_META[k].label}</div>
                <input type="number" placeholder="分数" min="0" max="100"
                  value={form.subjects[k].score}
                  onChange={e => setSubject(k, 'score', e.target.value)}
                  style={{ ...inputStyle, fontSize: '16px', fontWeight: '700', textAlign: 'center' }}
                />
                <input placeholder="主要失分点" value={form.subjects[k].majorLoss}
                  onChange={e => setSubject(k, 'majorLoss', e.target.value)}
                  style={{ ...inputStyle, fontSize: '11px', marginTop: '3px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 反馈信息 */}
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#E65100' }}>💬 反馈与备注</div>
          <Field label="信息来源">
            <select value={form.sourceType} onChange={e => setForm(f => ({ ...f, sourceType: e.target.value }))} style={inputStyle}>
              {SOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="老师原话">
            <textarea placeholder="老师具体说了什么？" rows={2}
              value={form.teacherFeedback}
              onChange={e => setForm(f => ({ ...f, teacherFeedback: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
          <Field label="孩子状态">
            <input placeholder="如：越来越通，不靠死撑" value={form.childState}
              onChange={e => setForm(f => ({ ...f, childState: e.target.value }))}
              style={inputStyle}
            />
          </Field>
          <Field label="其他备注">
            <textarea placeholder="任何想记录的信息..." rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '10px', paddingBottom: '8px' }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer', fontSize: '15px' }}>取消</button>
          <button type="submit" style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#1565C0', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: '700' }}>
            💾 保存考试记录
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>{label}</div>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  outline: 'none',
}
