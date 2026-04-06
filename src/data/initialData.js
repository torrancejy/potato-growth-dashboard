// ============================================================
// 初始种子数据
// 作用：第一次加载时填充默认值，之后全部由用户录入
// ============================================================

export const SUBJECTS_META = {
  math:    { label: '数学',   color: '#FFF3E0', statusColor: '#FF9800', icon: '📐' },
  chinese: { label: '语文',   color: '#E8F5E9', statusColor: '#4CAF50', icon: '📖' },
  english: { label: '英语',   color: '#E8F5E9', statusColor: '#2196F3', icon: '🔤' },
  physics: { label: '物理',   color: '#FFF8E1', statusColor: '#FFC107', icon: '⚡' },
  daozheng:{ label: '道法',   color: '#E8F5E9', statusColor: '#4CAF50', icon: '⚖️' },
}

export const SUBJECT_KEYS = Object.keys(SUBJECTS_META)

// 考试记录初始数据（来自截图）
export const INITIAL_EXAM_RECORDS = [
  {
    id: 'init-1',
    name: '八下期中',
    date: '2026-04-21',
    rank: { grade: '约60', gradeSource: 'GPT参考评估', class: '前10', classSource: '班级数据' },
    subjects: {
      math:    { score: 97, carelessLoss: 2, majorLoss: '压轴题第三问临场发挥' },
      chinese: { score: 92, carelessLoss: 1, majorLoss: '文言文阅读题型模板' },
      english: { score: 93, carelessLoss: 0, majorLoss: '阅读篇幅长有心理抗拒' },
      physics: { score: 84, carelessLoss: 3, majorLoss: '审题丢分、基础有漏洞' },
      daozheng:{ score: 98, carelessLoss: 1, majorLoss: '大题点没写全' },
    },
    source: '成绩单',
    sourceType: 'officialDocument',
    teacherFeedback: '班级第二，几何模型已背熟，专题打通，还能往上走',
    childState: '越来越通，不靠死撑',
    notes: '一次单元考突破，尚需期中验证稳定性',
    examType: 'unit', // 标记为单元测，不作为正式成绩依据
    createdAt: Date.now(),
  },
]

// 情报记录初始数据
export const INITIAL_INTEL_RECORDS = [
  {
    id: 'intel-1',
    category: '奖学金',
    content: '2025届全奖门槛区排约1400名，全奖和部分奖都有真实学生样本',
    source: '招生老师口头',
    sourceType: 'teacherOral',
    credibility: '中',
    verified: false,
    date: '2026-03-15',
    notes: '口头信息，待核实官网文件',
  },
  {
    id: 'intel-2',
    category: '政策',
    content: '目前仍在区1500-1700区间内招生，暂无明显收紧迹象',
    source: '家长圈口碑',
    sourceType: 'wordOfMouth',
    credibility: '中',
    verified: false,
    date: '2026-03-20',
    notes: '',
  },
  {
    id: 'intel-3',
    category: '口碑',
    content: '管理团队稳定，教学团队来源持续兑现，口碑不错',
    source: '在校家长',
    sourceType: 'parentReport',
    credibility: '高',
    verified: true,
    date: '2026-03-18',
    notes: '已交叉核实',
  },
]

// 实验样本初始数据
export const INITIAL_SAMPLE_RECORDS = [
  {
    id: 'sample-1',
    cohort: '2025届',
    path: '统招',
    gradeRank: '前30',
    districtRank: '约800',
    strongIn: '理科',
    hasCompetitionBg: true,
    type: '理科型',
    similarToPotato: '低',
    notes: '竞赛型，土豆不具备此背景',
  },
  {
    id: 'sample-2',
    cohort: '2025届',
    path: '九上期末提前选拔',
    gradeRank: '前100',
    districtRank: '约1500',
    strongIn: '理科',
    hasCompetitionBg: false,
    type: '稳定型',
    similarToPotato: '高',
    notes: '最像土豆的样本，语文英语也很强，综合型稳定输出',
  },
]

// 目标配置
export const INITIAL_TARGETS = {
  math:    { target: 98, label: '目标' },
  chinese: { target: 95, label: '目标' },
  english: { target: 96, label: '目标' },
  physics: { target: 94, label: '目标' },
  daozheng:{ target: 100, label: '目标' },
}

// 判断规则阈值配置（可调）
export const ZONE_THRESHOLDS = {
  mathStrong:        97,    // 数学强科门槛
  strongSubjectScore: 93,   // 强科分数门槛
  strongSubjectCount: 2,   // 需要几科达到强科门槛
  stableMath:        95,   // 数学稳定门槛
}

// 主观补充备注（用户可手动勾选/填写的判断项）
export const INITIAL_MANUAL_JUDGMENTS = {
  carelessLossControlled: false, // 会做的不丢（粗心失分<5%）
  teacherPositiveFeedback: true, // 老师反馈含正向词
  strongSubjectStable: true,     // 强科稳住
  weakSubjectImproving: true,    // 弱科至少一门改善（物理）
}
