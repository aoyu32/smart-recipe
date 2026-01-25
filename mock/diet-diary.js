// mock/diet-diary.js - 饮食日记模拟数据

// 饮食日记数据
const diaryRecords = [
  {
    date: '2026-01-25',
    weekday: '星期日',
    totalCalories: 1850,
    totalProtein: 95,
    totalCarbs: 220,
    totalFat: 55,
    checkedMeals: ['breakfast', 'lunch', 'dinner'],
    meals: {
      breakfast: {
        time: '早餐',
        timeRange: '08:30',
        calories: 450,
        checked: true,
        foods: [
          {
            id: 1,
            name: '全麦面包',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
            amount: '2片',
            calories: 180,
            protein: 8,
            carbs: 32,
            fat: 2
          },
          {
            id: 2,
            name: '水煮蛋',
            image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=200&h=200&fit=crop',
            amount: '1个',
            calories: 80,
            protein: 7,
            carbs: 1,
            fat: 5
          },
          {
            id: 3,
            name: '牛奶',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
            amount: '250ml',
            calories: 150,
            protein: 8,
            carbs: 12,
            fat: 8
          }
        ]
      },
      lunch: {
        time: '午餐',
        timeRange: '12:15',
        calories: 680,
        checked: true,
        foods: [
          {
            id: 5,
            name: '糙米饭',
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&h=200&fit=crop',
            amount: '150g',
            calories: 180,
            protein: 4,
            carbs: 38,
            fat: 1
          },
          {
            id: 6,
            name: '鸡胸肉',
            image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
            amount: '120g',
            calories: 200,
            protein: 35,
            carbs: 0,
            fat: 6
          },
          {
            id: 7,
            name: '西兰花',
            image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=200&h=200&fit=crop',
            amount: '100g',
            calories: 35,
            protein: 3,
            carbs: 7,
            fat: 0
          },
          {
            id: 8,
            name: '番茄炒蛋',
            image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 150,
            protein: 10,
            carbs: 8,
            fat: 10
          }
        ]
      },
      dinner: {
        time: '晚餐',
        timeRange: '18:45',
        calories: 520,
        checked: true,
        foods: [
          {
            id: 10,
            name: '小米粥',
            image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=200&h=200&fit=crop',
            amount: '1碗',
            calories: 120,
            protein: 3,
            carbs: 25,
            fat: 1
          },
          {
            id: 11,
            name: '清蒸鲈鱼',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=200&fit=crop',
            amount: '150g',
            calories: 180,
            protein: 28,
            carbs: 0,
            fat: 7
          },
          {
            id: 12,
            name: '蒜蓉油麦菜',
            image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 80,
            protein: 2,
            carbs: 8,
            fat: 5
          }
        ]
      }
    }
  },
  {
    date: '2026-01-24',
    weekday: '星期六',
    totalCalories: 1720,
    totalProtein: 88,
    totalCarbs: 205,
    totalFat: 48,
    checkedMeals: ['breakfast', 'lunch'],
    meals: {
      breakfast: {
        time: '早餐',
        timeRange: '07:45',
        calories: 420,
        checked: true,
        foods: [
          {
            id: 21,
            name: '燕麦粥',
            image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&h=200&fit=crop',
            amount: '1碗',
            calories: 150,
            protein: 6,
            carbs: 27,
            fat: 3
          },
          {
            id: 22,
            name: '煎蛋',
            image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=200&h=200&fit=crop',
            amount: '1个',
            calories: 90,
            protein: 7,
            carbs: 1,
            fat: 7
          },
          {
            id: 23,
            name: '苹果',
            image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop',
            amount: '1个',
            calories: 80,
            protein: 0,
            carbs: 21,
            fat: 0
          }
        ]
      },
      lunch: {
        time: '午餐',
        timeRange: '12:30',
        calories: 750,
        checked: true,
        foods: [
          {
            id: 25,
            name: '米饭',
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&h=200&fit=crop',
            amount: '1碗',
            calories: 200,
            protein: 4,
            carbs: 45,
            fat: 0
          },
          {
            id: 26,
            name: '红烧肉',
            image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop',
            amount: '100g',
            calories: 280,
            protein: 18,
            carbs: 5,
            fat: 22
          },
          {
            id: 27,
            name: '炒青菜',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 60,
            protein: 2,
            carbs: 8,
            fat: 3
          }
        ]
      },
      dinner: {
        time: '晚餐',
        timeRange: '未记录',
        calories: 0,
        checked: false,
        foods: []
      }
    }
  },
  {
    date: '2026-01-23',
    weekday: '星期五',
    totalCalories: 1950,
    totalProtein: 102,
    totalCarbs: 235,
    totalFat: 58,
    checkedMeals: ['breakfast', 'lunch', 'dinner'],
    meals: {
      breakfast: {
        time: '早餐',
        timeRange: '08:00',
        calories: 480,
        checked: true,
        foods: [
          {
            id: 31,
            name: '豆浆',
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
            amount: '300ml',
            calories: 120,
            protein: 9,
            carbs: 12,
            fat: 5
          },
          {
            id: 32,
            name: '油条',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop',
            amount: '1根',
            calories: 220,
            protein: 5,
            carbs: 28,
            fat: 10
          },
          {
            id: 33,
            name: '包子',
            image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&h=200&fit=crop',
            amount: '2个',
            calories: 140,
            protein: 6,
            carbs: 22,
            fat: 4
          }
        ]
      },
      lunch: {
        time: '午餐',
        timeRange: '12:00',
        calories: 720,
        checked: true,
        foods: [
          {
            id: 35,
            name: '炒面',
            image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 450,
            protein: 15,
            carbs: 65,
            fat: 15
          },
          {
            id: 36,
            name: '凉拌黄瓜',
            image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 40,
            protein: 1,
            carbs: 8,
            fat: 1
          }
        ]
      },
      dinner: {
        time: '晚餐',
        timeRange: '19:00',
        calories: 550,
        checked: true,
        foods: [
          {
            id: 38,
            name: '蔬菜沙拉',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
            amount: '1份',
            calories: 180,
            protein: 8,
            carbs: 15,
            fat: 12
          },
          {
            id: 39,
            name: '烤鸡胸肉',
            image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop',
            amount: '150g',
            calories: 250,
            protein: 45,
            carbs: 0,
            fat: 8
          }
        ]
      }
    }
  }
];

module.exports = {
  diaryRecords
};
