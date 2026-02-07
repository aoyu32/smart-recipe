// mock/data-stats.js - 数据统计页面Mock数据

// 近7天数据
const weekData = {
  avgCalories: 1650,
  checkinDays: 6,
  weightChange: -1.2,
  caloriesData: [1520, 1680, 1590, 1720, 1650, 1580, 1810],
  dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  mealData: [
    { name: '早餐', value: 450 },
    { name: '午餐', value: 650 },
    { name: '晚餐', value: 550 }
  ],
  checkinData: [3, 3, 2, 3, 3, 3, 2],
  weightData: [65.2, 65.0, 64.8, 64.5, 64.3, 64.2, 64.0]
};

// 近30天数据
const monthData = {
  avgCalories: 1680,
  checkinDays: 25,
  weightChange: -2.5,
  caloriesData: [
    1520, 1680, 1590, 1720, 1650, 1580, 1810, 1650, 1720, 1580, 
    1690, 1750, 1620, 1580, 1700, 1650, 1720, 1680, 1590, 1650,
    1720, 1680, 1590, 1720, 1650, 1580, 1810, 1650, 1720, 1680
  ],
  dates: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
  mealData: [
    { name: '早餐', value: 480 },
    { name: '午餐', value: 680 },
    { name: '晚餐', value: 520 }
  ],
  checkinData: [
    3, 3, 2, 3, 3, 3, 2, 3, 2, 3, 
    3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 
    3, 3, 3, 2, 3, 3, 3, 2, 3, 2
  ],
  weightData: [
    67.0, 66.9, 66.8, 66.7, 66.6, 66.5, 66.4, 66.3, 66.2, 66.1,
    66.0, 65.9, 65.8, 65.7, 65.6, 65.5, 65.4, 65.3, 65.2, 65.1,
    65.0, 64.9, 64.8, 64.7, 64.6, 64.5, 64.4, 64.3, 64.2, 64.5
  ]
};

module.exports = {
  getStatsData: (timeRange) => {
    return timeRange === 'week' ? weekData : monthData;
  },
  weekData,
  monthData
};
