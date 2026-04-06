// ============================================================
// 数据存储层 — localStorage 封装
// 原则：只存原始输入数据，所有计算属性由规则引擎派生
// ============================================================
import {
  INITIAL_EXAM_RECORDS,
  INITIAL_INTEL_RECORDS,
  INITIAL_SAMPLE_RECORDS,
  INITIAL_TARGETS,
  INITIAL_MANUAL_JUDGMENTS,
} from './initialData'

const KEY_EXAMS    = 'potato_exams'
const KEY_INTELS   = 'potato_intels'
const KEY_SAMPLES  = 'potato_samples'
const KEY_TARGETS  = 'potato_targets'
const KEY_JUDGMENTS = 'potato_judgments'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

export function initStore() {
  if (!localStorage.getItem(KEY_EXAMS)) {
    save(KEY_EXAMS, INITIAL_EXAM_RECORDS)
  }
  if (!localStorage.getItem(KEY_INTELS)) {
    save(KEY_INTELS, INITIAL_INTEL_RECORDS)
  }
  if (!localStorage.getItem(KEY_SAMPLES)) {
    save(KEY_SAMPLES, INITIAL_SAMPLE_RECORDS)
  }
  if (!localStorage.getItem(KEY_TARGETS)) {
    save(KEY_TARGETS, INITIAL_TARGETS)
  }
  if (!localStorage.getItem(KEY_JUDGMENTS)) {
    save(KEY_JUDGMENTS, INITIAL_MANUAL_JUDGMENTS)
  }
}

// ---------- 考试记录 ----------
export function getExamRecords() {
  return load(KEY_EXAMS, [])
}

export function saveExamRecords(records) {
  save(KEY_EXAMS, records)
}

export function addExamRecord(record) {
  const records = getExamRecords()
  const newRecord = { ...record, id: 'exam-' + Date.now(), createdAt: Date.now() }
  saveExamRecords([newRecord, ...records])
  return newRecord
}

export function updateExamRecord(id, fields) {
  const records = getExamRecords()
  const updated = records.map(r => r.id === id ? { ...r, ...fields } : r)
  saveExamRecords(updated)
}

export function deleteExamRecord(id) {
  saveExamRecords(getExamRecords().filter(r => r.id !== id))
}

// ---------- 情报记录 ----------
export function getIntelRecords() {
  return load(KEY_INTELS, [])
}

export function saveIntelRecords(records) {
  save(KEY_INTELS, records)
}

export function addIntelRecord(record) {
  const records = getIntelRecords()
  const newRecord = { ...record, id: 'intel-' + Date.now(), createdAt: Date.now() }
  saveIntelRecords([newRecord, ...records])
  return newRecord
}

export function updateIntelRecord(id, fields) {
  const records = getIntelRecords()
  saveIntelRecords(records.map(r => r.id === id ? { ...r, ...fields } : r))
}

export function deleteIntelRecord(id) {
  saveIntelRecords(getIntelRecords().filter(r => r.id !== id))
}

// ---------- 实验样本 ----------
export function getSampleRecords() {
  return load(KEY_SAMPLES, [])
}

export function saveSampleRecords(records) {
  save(KEY_SAMPLES, records)
}

export function addSampleRecord(record) {
  const records = getSampleRecords()
  const newRecord = { ...record, id: 'sample-' + Date.now(), createdAt: Date.now() }
  saveSampleRecords([newRecord, ...records])
  return newRecord
}

export function updateSampleRecord(id, fields) {
  const records = getSampleRecords()
  saveSampleRecords(records.map(r => r.id === id ? { ...r, ...fields } : r))
}

export function deleteSampleRecord(id) {
  saveSampleRecords(getSampleRecords().filter(r => r.id !== id))
}

// ---------- 目标分数 ----------
export function getTargets() {
  return load(KEY_TARGETS, {})
}

export function saveTargets(targets) {
  save(KEY_TARGETS, targets)
}

// ---------- 主观判断项 ----------
export function getManualJudgments() {
  return load(KEY_JUDGMENTS, {})
}

export function saveManualJudgments(judgments) {
  save(KEY_JUDGMENTS, judgments)
}
