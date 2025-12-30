// mock/index.js - 首页模拟数据

// 轮播图数据
const banners = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
    title: '健康饮食'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
    title: '营养搭配'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    title: '美味食谱'
  }
];

// 今日食谱数据
const todayRecipe = {
  date: '2024年1月15日',
  weekday: '星期一',
  title: 'Today，我的食谱',
  description: '根据您的健康档案和饮食偏好，今日为您精心搭配了营养均衡的三餐方案。早餐注重能量补充，午餐强调蛋白质摄入，晚餐则以清淡易消化为主。整体热量控制在1850千卡，适合轻度运动的成年人。建议按时就餐，细嚼慢咽，餐后适当活动。',
  totalCalories: 1850,
  totalProtein: 95,
  totalCarbs: 220,
  totalFat: 55,
  meals: {
    breakfast: {
      time: '早餐',
      timeRange: '07:00-09:00',
      calories: 450,
      foods: [
        {
          id: 1,
          name: '全麦面包',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
          amount: '2片',
          calories: 18000,
          protein: 8000,
          carbs: 32,
          fat: 2,
          category: '主食'
        },
        {
          id: 2,
          name: '水煮蛋',
          image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=200&h=200&fit=crop',
          amount: '1个',
          calories: 80,
          protein: 7,
          carbs: 1,
          fat: 5,
          category: '蛋白质'
        },
        {
          id: 3,
          name: '牛奶',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
          amount: '250ml',
          calories: 150,
          protein: 8,
          carbs: 12,
          fat: 8,
          category: '饮品'
        },
        {
          id: 4,
          name: '香蕉',
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop',
          amount: '1根',
          calories: 40,
          protein: 1,
          carbs: 27,
          fat: 0,
          category: '水果'
        }
      ]
    },
    lunch: {
      time: '午餐',
      timeRange: '12:00-13:00',
      calories: 680,
      foods: [
        {
          id: 5,
          name: '糙米饭',
          image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&h=200&fit=crop',
          amount: '150g',
          calories: 180,
          protein: 4,
          carbs: 38,
          fat: 1,
          category: '主食'
        },
        {
          id: 6,
          name: '鸡胸肉',
          image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
          amount: '120g',
          calories: 200,
          protein: 35,
          carbs: 0,
          fat: 6,
          category: '肉类'
        },
        {
          id: 7,
          name: '西兰花',
          image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=200&h=200&fit=crop',
          amount: '100g',
          calories: 35,
          protein: 3,
          carbs: 7,
          fat: 0,
          category: '蔬菜'
        },
        {
          id: 8,
          name: '番茄炒蛋',
          image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=200&h=200&fit=crop',
          amount: '1份',
          calories: 150,
          protein: 10,
          carbs: 8,
          fat: 10,
          category: '菜肴'
        },
        {
          id: 9,
          name: '紫菜蛋花汤',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop',
          amount: '1碗',
          calories: 115,
          protein: 8,
          carbs: 5,
          fat: 7,
          category: '汤品'
        }
      ]
    },
    dinner: {
      time: '晚餐',
      timeRange: '18:00-19:00',
      calories: 520,
      foods: [
        {
          id: 10,
          name: '小米粥',
          image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=200&h=200&fit=crop',
          amount: '1碗',
          calories: 120,
          protein: 3,
          carbs: 25,
          fat: 1,
          category: '主食'
        },
        {
          id: 11,
          name: '清蒸鲈鱼',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=200&fit=crop',
          amount: '150g',
          calories: 180,
          protein: 28,
          carbs: 0,
          fat: 7,
          category: '海鲜'
        },
        {
          id: 12,
          name: '蒜蓉油麦菜',
          image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=200&h=200&fit=crop',
          amount: '1份',
          calories: 80,
          protein: 2,
          carbs: 8,
          fat: 5,
          category: '蔬菜'
        },
        {
          id: 13,
          name: '凉拌黄瓜',
          image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&h=200&fit=crop',
          amount: '1份',
          calories: 40,
          protein: 1,
          carbs: 8,
          fat: 1,
          category: '凉菜'
        },
        {
          id: 14,
          name: '豆腐汤',
          image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=200&h=200&fit=crop',
          amount: '1碗',
          calories: 100,
          protein: 8,
          carbs: 5,
          fat: 6,
          category: '汤品'
        }
      ]
    }
  }
};

// 今日三餐推荐（保留兼容）
const todayMeals = [
  {
    type: 'breakfast',
    time: '早餐',
    name: '营养燕麦粥',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&h=200&fit=crop',
    calories: 350,
    protein: 12,
    description: '富含膳食纤维，营养均衡'
  },
  {
    type: 'lunch',
    time: '午餐',
    name: '鸡胸肉沙拉',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
    calories: 520,
    protein: 35,
    description: '高蛋白低脂，健康美味'
  },
  {
    type: 'dinner',
    time: '晚餐',
    name: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=200&fit=crop',
    calories: 420,
    protein: 28,
    description: '清淡少油，易于消化'
  }
];

// 食物排行榜数据
const rankings = [
  { 
    id: 1, 
    rank: 1, 
    name: '番茄炒蛋', 
    image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=200&h=200&fit=crop',
    likes: 1234, 
    views: 5678,
    tags: ['家常菜', '简单']
  },
  { 
    id: 2, 
    rank: 2, 
    name: '宫保鸡丁', 
    image: 'https://images.unsplash.com/photo-1603073163308-9c0f6f0c0e5c?w=200&h=200&fit=crop',
    likes: 1123, 
    views: 4567,
    tags: ['川菜', '下饭']
  },
  { 
    id: 3, 
    rank: 3, 
    name: '红烧肉', 
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop',
    likes: 998, 
    views: 3456,
    tags: ['经典', '美味']
  },
  { 
    id: 4, 
    rank: 4, 
    name: '麻婆豆腐', 
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826d1e5?w=200&h=200&fit=crop',
    likes: 876, 
    views: 2345,
    tags: ['川菜', '麻辣']
  },
  { 
    id: 5, 
    rank: 5, 
    name: '糖醋排骨', 
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=200&h=200&fit=crop',
    likes: 765, 
    views: 1234,
    tags: ['酸甜', '下饭']
  },
  { 
    id: 6, 
    rank: 6, 
    name: '清炒时蔬', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
    likes: 654, 
    views: 1123,
    tags: ['健康', '清淡']
  },
  { 
    id: 7, 
    rank: 7, 
    name: '水煮鱼', 
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop',
    likes: 543, 
    views: 998,
    tags: ['川菜', '麻辣']
  },
  { 
    id: 8, 
    rank: 8, 
    name: '蒜蓉西兰花', 
    image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=200&h=200&fit=crop',
    likes: 432, 
    views: 876,
    tags: ['健康', '营养']
  },
  { 
    id: 9, 
    rank: 9, 
    name: '红烧茄子', 
    image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=200&h=200&fit=crop',
    likes: 321, 
    views: 765,
    tags: ['家常菜', '下饭']
  },
  { 
    id: 10, 
    rank: 10, 
    name: '酸辣土豆丝', 
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=200&h=200&fit=crop',
    likes: 298, 
    views: 654,
    tags: ['家常菜', '开胃']
  }
];

module.exports = {
  banners,
  todayRecipe,
  todayMeals,
  rankings
};
