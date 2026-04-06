// ============================================================
// 规则引擎 — 所有计算属性由此生成
// 输入：原始数据（考试记录、情报、样本、目标、手动判断）
// 输出：派生状态（趋势、策略、学科状态、权重）
// ============================================================
import { ZONE_THRESHOLDS } from '../data/initialData'
import { SUBJECT_KEYS } from '../data/initialData'

function recent(arr, n = 3) {
  return arr.slice(0, n)
}

// ---------- 1. 单科分数趋势 ----------
export function computeSubjectTrend(examRecords, subject) {
  const scores = examRecords
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => e.subjects?.[subject]?.score)
    .filter(s => s !== undefined && s !== null)
  if (scores.length < 2) return 'unknown'
  const last = scores[scores.length - 1]
  const prev = scores[scores.length - 2]
  if (last > prev) return 'up'
  if (last < prev) return 'down'
  return 'stable'
}

// ---------- 2. 单科当前状态标签 ----------
export function computeSubjectStatus(examRecords, subject, targets) {
  const sorted = examRecords.sort((a, b) => b.date.localeCompare(a.date))
  const latestExam = sorted[0]
  const latestScore = latestExam?.subjects?.[subject]?.score
  if (!latestScore) return { label: '暂无数据', color: '#9E9E9E' }
  // 单元测只影响数学
  if (latestExam?.examType === 'unit' && subject === 'math') {
    return { label: '⚠️ 待验证', color: '#FF9800' }
  }
  if (subject === 'daozheng') {
    return { label: '✅ 稳定优势', color: '#4CAF50' }
  }
  if (subject === 'english') {
    if (latestScore >= 96) return { label: '✅ 领先', color: '#4CAF50' }
    if (latestScore >= 90) return { label: '↑ 进步中', color: '#2196F3' }
    return { label: '⚠️ 待提升', color: '#FF9800' }
  }
  if (subject === 'chinese') {
    if (latestScore >= 95) return { label: '✅ 已达标', color: '#4CAF50' }
    if (latestScore >= 90) return { label: '➔ 稳中可提', color: '#8BC34A' }
    return { label: '⚠️ 待提升', color: '#FF9800' }
  }
  if (subject === 'physics') {
    if (latestScore >= 90) return { label: '⚡ 突破中', color: '#FF9800' }
    return { label: '⚡ 待爆发', color: '#FFC107' }
  }
  if (latestScore >= 98) return { label: '✅ 领先', color: '#4CAF50' }
  if (latestScore >= 95) return { label: '↑ 待突破', color: '#FF9800' }
  if (latestScore >= 90) return { label: '➔ 接近目标', color: '#8BC34A' }
  if (latestScore < 85) return { label: '⚠️ 待提升', color: '#F44336' }
  return { label: '↑ 进步中', color: '#2196F3' }
}

// ---------- 3. 单科学科证据链 ----------
export function computeSubjectEvidence(examRecords, subject) {
  const sorted = examRecords.sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  const evidence = []
  if (latest) {
    const s = latest.subjects?.[subject]
    if (s?.score !== undefined) {
      evidence.push({ type: 'exam', text: `最近考试：${latest.name}，得分 ${s.score}分${s.majorLoss ? '，主要失分：' + s.majorLoss : ''}`, date: latest.date })
    }
  }
  if (latest?.teacherFeedback) {
    evidence.push({ type: 'teacher', text: `老师反馈：${latest.teacherFeedback}`, date: latest.date })
  }
  return evidence.slice(0, 4)
}

// ---------- 4. 单科下一步行动 ----------
export function computeSubjectAction(examRecords, subject) {
  const sorted = examRecords.sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  if (!latest) return '先录入一次考试成绩'
  const score = latest.subjects?.[subject]?.score
  const isUnit = latest.examType === 'unit'
  const actions = {
    math:    isUnit ? '八下期中才是第一次正式定位，单元测参考即可；继续压轴题训练，等期中考验证' : score >= 97 ? '继续保持压轴题训练，等待期中验证稳定性' : '加强速度训练，专题打通，附加题前两问必拿',
    chinese: '突击文言文，积累阅读题型模板，作文稳定发挥',
    english: '每天1篇阅读保持手感，降低情绪抗拒',
    physics: isUnit ? '八下期中才是正式成绩，物理基础需持续夯实；当天错题当天重做' : score < 90 ? '当天错题当天重做，建立物理题型模板' : '巩固题型，减少审题丢分',
    daozheng:'碎片时间巩固，整理大题答题结构',
  }
  return actions[subject] || '持续练习，保持状态'
}

// ---------- 5. 五科完整状态 ----------
export function computeAllSubjectStates(examRecords, targets) {
  const result = {}
  for (const key of SUBJECT_KEYS) {
    const latestExam = examRecords.sort((a, b) => b.date.localeCompare(a.date))[0]
    result[key] = {
      score: latestExam?.subjects?.[key]?.score ?? null,
      target: targets[key]?.target || null,
      ...computeSubjectStatus(examRecords, key, targets),
      trend: computeSubjectTrend(examRecords, key),
      evidence: computeSubjectEvidence(examRecords, key),
      action: computeSubjectAction(examRecords, key),
      shortboard: latestExam?.subjects?.[key]?.majorLoss || '待分析',
    }
  }
  return result
}

// ---------- 6. 趋势判断 ----------
export function computeTrendJudgment(examRecords) {
  const sorted = examRecords.sort((a, b) => b.date.localeCompare(a.date))
  const last3 = recent(sorted, 3)
  const scores = last3.map(e => SUBJECT_KEYS.reduce((sum, k) => sum + (e.subjects?.[k]?.score || 0), 0))
  const r1Satisfied = scores.length >= 2 ? (() => { let up = 0; for (let i = 0; i < scores.length - 1; i++) if (scores[i] > scores[i + 1]) up++; return up >= 1 })() : false
  const r2Satisfied = scores.length >= 2 ? scores[0] >= scores[scores.length - 1] : false
  const r3Skipped = examRecords.length < 2
  const mathTrend = computeSubjectTrend(examRecords, 'math')
  const physicsTrend = computeSubjectTrend(examRecords, 'physics')
  const r3Satisfied = !r3Skipped && (mathTrend === 'up' || mathTrend === 'stable') && physicsTrend === 'up'
  const items = [
    { rule: 'R1', label: '最近3次重要考试，2次以上比前一次更好', satisfied: r1Satisfied, skipped: scores.length < 2 },
    { rule: 'R2', label: '班内相对位置在上移（不只是一次考好）', satisfied: r2Satisfied, skipped: scores.length < 2 },
    { rule: 'R3', label: '强科稳住，弱科至少一门在改善', satisfied: r3Satisfied, skipped: r3Skipped },
  ]
  return { score: items.filter(i => i.satisfied).length, total: 5, items }
}

// ---------- 7. 手动判断项 ----------
export function applyManualJudgments(baseScore, manual) {
  const items = [
    { rule: 'R4', label: '老师反馈出现"前列""上升明显"等正向词', satisfied: !!manual.teacherPositiveFeedback, manual: true },
    { rule: 'R5', label: '会做的不丢，中档题拿稳', satisfied: !!manual.carelessLossControlled, manual: true },
  ]
  return { score: baseScore + items.filter(i => i.satisfied).length, total: 5, items }
}

// ---------- 8. 综合判断清单 ----------
export function computeJudgmentList(examRecords, manual) {
  const trend = computeTrendJudgment(examRecords)
  const withManual = applyManualJudgments(trend.score, manual)
  const allItems = [...trend.items, ...withManual.items]
  return { score: withManual.score, total: withManual.total, items: allItems, met: withManual.score >= 3 }
}

// ---------- 9. 策略判断 ----------
export function computeStrategy(examRecords, manual) {
  const j = computeJudgmentList(examRecords, manual)
  if (j.score >= 3) {
    return { mode: '激进', signal: '八下到九上，成绩总体趋势向上；数学、物理没有明显短板；语文没有持续拖后腿；老师反馈出现"还能往上走"；土豆越来越通，不靠死撑。', advice: '实验继续留作主冲目标，仁泽重点盯但不提前绑定' }
  }
  return { mode: '保守', signal: '连续两三次考试位置差不多，冲不上去；弱科一直补不起来；每次都靠临场发挥，不稳定；孩子明显疲惫、焦虑、效率下滑；实验样本显示偏竞赛/偏理科，土豆不匹配。', advice: '别放弃冲高，但需要把仁泽和稳妥校的权重提上来' }
}

// ---------- 10. 区间自动判断 ----------
export function computeZone(examRecords, targets) {
  const states = computeAllSubjectStates(examRecords, targets)
  const math = states.math
  const strongCount = SUBJECT_KEYS.filter(k => (states[k].score || 0) >= ZONE_THRESHOLDS.strongSubjectScore).length
  if (math.score >= 97 && strongCount >= 3) return { label: '🚀 高位突破区', color: '#4CAF50', desc: '数学领先，多科同步强势，具备冲击实验的真实实力' }
  if (math.score >= 95 && strongCount >= 2) return { label: '⚡ 高位未稳一梯队区', color: '#FF9800', desc: '已在一梯队边缘，但稳定性和压轴题能力待验证' }
  if (math.score >= 90) return { label: '📈 稳二梯队优势区', color: '#2196F3', desc: '二梯队头部，数学是主力，物理若提分可冲一梯队' }
  return { label: '🔍 观察中', color: '#9E9E9E', desc: '数据不足或趋势不明确，持续跟踪' }
}

// ---------- 11. 动态权重 ----------
// modeOverride: 'aggressive' | 'conservative' | null（null=按数据自动判断）
export function computeWeights(examRecords, manual, modeOverride) {
  // 优先使用用户手动选择，否则按数据自动判断
  let mode
  if (modeOverride === 'aggressive' || modeOverride === 'conservative') {
    mode = modeOverride === 'aggressive' ? '激进' : '保守'
  } else {
    mode = computeStrategy(examRecords, manual).mode
  }
  if (mode === '激进') {
    return { experiment: 75, renzheng: 90, safe: 60, observe: 20 }
  }
  return { experiment: 70, renzheng: 85, safe: 65, observe: 15 }
}

// ---------- 12. 总览数据 ----------
export function computeOverview(examRecords, targets, manual, strategyModeOverride) {
  const strategy = computeStrategy(examRecords, manual)
  const zone = computeZone(examRecords, targets)
  const weights = computeWeights(examRecords, manual, strategyModeOverride)
  const judgment = computeJudgmentList(examRecords, manual)
  const states = computeAllSubjectStates(examRecords, targets)
  return { strategy, zone, weights, judgment, states }
}
