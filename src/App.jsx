import { useState, useEffect } from 'react'
import { initStore, getExamRecords, addExamRecord, deleteExamRecord,
         getIntelRecords, addIntelRecord, deleteIntelRecord,
         getSampleRecords, addSampleRecord, deleteSampleRecord,
         getTargets, saveTargets, getManualJudgments, saveManualJudgments } from './data/store'
import Overview from './pages/Overview'
import Exam from './pages/Exam'
import Subject from './pages/Subject'
import Intel from './pages/Intel'
import HeaderNav from './components/HeaderNav'
import QuickAdd from './components/QuickAdd'
import ExamForm from './components/ExamForm'
import IntelForm from './components/IntelForm'
import SampleForm from './components/SampleForm'

export default function App() {
  const [page, setPage] = useState('overview')
  const [exams, setExams] = useState([])
  const [intels, setIntels] = useState([])
  const [samples, setSamples] = useState([])
  const [targets, setTargets] = useState({})
  const [manual, setManual] = useState({})
  const [strategyMode, setStrategyMode] = useState('auto') // 'auto' | 'aggressive' | 'conservative'
  const [addMode, setAddMode] = useState(null) // 'exam' | 'intel' | 'sample' | null

  useEffect(() => {
    initStore()
    setExams(getExamRecords())
    setIntels(getIntelRecords())
    setSamples(getSampleRecords())
    setTargets(getTargets())
    setManual(getManualJudgments())
  }, [])

  function refresh() {
    setExams(getExamRecords())
    setIntels(getIntelRecords())
    setSamples(getSampleRecords())
    setTargets(getTargets())
    setManual(getManualJudgments())
  }

  function handleAddExam(record) {
    addExamRecord(record)
    refresh()
  }

  function handleDeleteExam(id) {
    deleteExamRecord(id)
    refresh()
  }

  function handleAddIntel(record) {
    addIntelRecord(record)
    refresh()
  }

  function handleDeleteIntel(id) {
    deleteIntelRecord(id)
    refresh()
  }

  function handleAddSample(record) {
    addSampleRecord(record)
    refresh()
  }

  function handleDeleteSample(id) {
    deleteSampleRecord(id)
    refresh()
  }

  function handleToggleJudgment(rule) {
    const key = rule === 'R4' ? 'teacherPositiveFeedback' : 'carelessLossControlled'
    const updated = { ...manual, [key]: !manual[key] }
    saveManualJudgments(updated)
    setManual(updated)
  }

  const pageTitle = { overview:'总览', exam:'考试', subject:'学科', intel:'情报' }

  if (addMode === 'exam') {
    return (
      <div style={{ background:'#0A1628', minHeight:'100vh', color:'#fff', fontFamily:"'PingFang SC','Helvetica Neue',Arial,sans-serif" }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'16px', fontWeight:'600' }}>📋 新增考试记录</span>
          <button onClick={()=>setAddMode(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer'}}>✕</button>
        </div>
        <ExamForm onSave={r=>{handleAddExam(r);setAddMode(null)}} onCancel={()=>setAddMode(null)}/>
      </div>
    )
  }

  if (addMode === 'intel') {
    return (
      <div style={{ background:'#0A1628', minHeight:'100vh', color:'#fff', fontFamily:"'PingFang SC','Helvetica Neue',Arial,sans-serif" }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'16px', fontWeight:'600' }}>🔍 新增情报</span>
          <button onClick={()=>setAddMode(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer'}}>✕</button>
        </div>
        <IntelForm onSave={r=>{handleAddIntel(r);setAddMode(null)}} onCancel={()=>setAddMode(null)}/>
      </div>
    )
  }

  if (addMode === 'sample') {
    return (
      <div style={{ background:'#0A1628', minHeight:'100vh', color:'#fff', fontFamily:"'PingFang SC','Helvetica Neue',Arial,sans-serif" }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'16px', fontWeight:'600' }}>★ 新增样本</span>
          <button onClick={()=>setAddMode(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer'}}>✕</button>
        </div>
        <SampleForm onSave={r=>{handleAddSample(r);setAddMode(null)}} onCancel={()=>setAddMode(null)}/>
      </div>
    )
  }

  return (
    <div style={{ background:'#0A1628', minHeight:'100vh', color:'#fff', fontFamily:"'PingFang SC','Helvetica Neue',Arial,sans-serif" }}>
      {/* 顶部导航 */}
      <div style={{ background:'#0F2847', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.08)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontSize:'16px', fontWeight:'600' }}>🥔 土豆成长追踪</div>
        <div style={{ fontSize:'11px', opacity:0.5 }}>v3 · 数据驱动版</div>
      </div>

      {/* 页面内容 */}
      <div style={{ minHeight:'calc(100vh - 60px)' }}>
        {page === 'overview' && <Overview exams={exams} targets={targets} manual={manual} onToggleJudgment={handleToggleJudgment} strategyMode={strategyMode} onStrategyModeChange={setStrategyMode}/>}
        {page === 'exam' && <Exam exams={exams} onAdd={handleAddExam} onDelete={handleDeleteExam}/>}
        {page === 'subject' && <Subject exams={exams} targets={targets}/>}
        {page === 'intel' && <Intel intels={intels} samples={samples} onAddIntel={handleAddIntel} onDeleteIntel={handleDeleteIntel} onAddSample={handleAddSample} onDeleteSample={handleDeleteSample}/>}
      </div>

      {/* 底部导航 */}
      <HeaderNav page={page} onChange={setPage}/>

      {/* 浮动新增按钮（考试页可直接新增，其他页切换到对应tab） */}
      {page !== 'exam' && (
        <button
          onClick={() => page === 'intel' ? setAddMode('intel') : setAddMode('exam')}
          style={{
            position:'fixed', bottom:'76px', right:'20px', width:'48px', height:'48px', borderRadius:'50%',
            background:'#1565C0', color:'#fff', border:'none', fontSize:'22px', cursor:'pointer',
            boxShadow:'0 4px 16px rgba(21,101,192,0.5)', zIndex:900, display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >+</button>
      )}
    </div>
  )
}
