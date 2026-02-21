// mock/health-profile.js - 健康档案模拟数据

// 当前健康目标
const currentGoal = {
  id: 1,
  target: '保持健康',
  targetWeight: 65,
  targetBMI: 21.5,
  dailyCalories: 1800,
  startDate: '2026-01-01',
  endDate: '2026-06-30',
  status: 'active' // active, completed, cancelled
};

// 健康状况信息
const healthInfo = {
  height: 170,
  weight: 65,
  age: 28,
  gender: '女',
  bmi: 22.5,
  bmiStatus: 'normal',
  activityLevel: '轻度运动', // 久坐、轻度运动、中度运动、重度运动
  bloodPressure: '120/80', // 血压 mmHg
  bloodSugar: 5.2 // 血糖 mmol/L
};

// 历史健康目标
const goalHistory = [
  {
    id: 2,
    target: '减重5kg',
    targetWeight: 60,
    targetBMI: 20.8,
    dailyCalories: 1500,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    status: 'completed',
    result: '成功减重4.5kg'
  },
  {
    id: 3,
    target: '增肌',
    targetWeight: 68,
    targetMuscle: 48,
    dailyProtein: 120,
    dailyCalories: 2200,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'completed',
    result: '增重3kg，肌肉量提升'
  },
  {
    id: 4,
    target: '控制血糖',
    targetBloodSugar: 5.5,
    dailyCarbs: 180,
    dailyCalories: 1600,
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    status: 'cancelled',
    result: '中途放弃'
  }
];

// 特殊禁忌
const restrictions = [
  {
    id: 1,
    type: 'allergy', // allergy-过敏, disease-疾病
    name: '海鲜过敏',
    description: '对虾、蟹等海鲜过敏',
    severity: 'high', // high-严重, medium-中等, low-轻微
    addedDate: '2025-01-15'
  },
  {
    id: 2,
    type: 'disease',
    name: '乳糖不耐受',
    description: '不能食用含乳糖的乳制品',
    severity: 'medium',
    addedDate: '2025-02-20'
  }
];

// 健康目标模板
const goalTemplates = [
  {
    id: 1,
    name: '减重',
    description: '科学减重，健康瘦身',
    icon: '📉',
    caloriesRange: [1200, 1600]
  },
  {
    id: 2,
    name: '增重',
    description: '健康增重，强壮体魄',
    icon: '📈',
    caloriesRange: [2000, 2500]
  },
  {
    id: 3,
    name: '保持健康',
    description: '维持现状，均衡营养',
    icon: '⚖️',
    caloriesRange: [1600, 2000]
  },
  {
    id: 4,
    name: '增肌',
    description: '增加肌肉，提升力量',
    icon: '💪',
    caloriesRange: [2200, 2800]
  },
  {
    id: 5,
    name: '控糖',
    description: '控制血糖，预防糖尿病',
    icon: '🍬',
    caloriesRange: [1400, 1800]
  },
  {
    id: 6,
    name: '降压',
    description: '降低血压，保护心血管',
    icon: '❤️',
    caloriesRange: [1500, 1900]
  }
];

// 获取健康档案数据
function getHealthProfile() {
  return {
    currentGoal,
    healthInfo,
    goalHistory,
    restrictions,
    goalTemplates
  };
}

module.exports = {
  currentGoal,
  healthInfo,
  goalHistory,
  restrictions,
  goalTemplates,
  getHealthProfile
};
