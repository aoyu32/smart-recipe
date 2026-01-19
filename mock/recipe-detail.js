// mock/recipe-detail.js - 食谱详情模拟数据

const recipeDetails = {
  '1': {
    id: '1',
    name: '清蒸鲈鱼',
    category: '低脂高蛋白',
    image: 'https://images.unsplash.com/photo-1580959375944-1ab5b8c78f5e?w=800',
    likes: 1234,
    collections: 567,
    views: 8900,
    nutrition: {
      calories: 180,
      protein: 28,
      carbs: 5,
      fat: 6
    },
    description: '清蒸鲈鱼是一道经典的粤菜，以其鲜嫩的口感和清淡的味道而闻名。这道菜保留了鱼肉的原汁原味，营养丰富，特别适合减脂期食用。鲈鱼富含优质蛋白质和不饱和脂肪酸，对心血管健康有益。',
    ingredients: [
      { name: '鲈鱼', amount: '1条(约500g)' },
      { name: '生姜', amount: '3片' },
      { name: '葱', amount: '2根' },
      { name: '料酒', amount: '1勺' },
      { name: '蒸鱼豉油', amount: '2勺' },
      { name: '食用油', amount: '适量' }
    ],
    steps: [
      {
        text: '将鲈鱼清洗干净，在鱼身两侧各划几刀，方便入味。',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400'
      },
      {
        text: '在鱼身上抹上料酒和少许盐，腌制10分钟去腥。',
        image: ''
      },
      {
        text: '将姜片和葱段铺在盘底，把鱼放在上面，鱼身上也放一些姜丝。',
        image: ''
      },
      {
        text: '水烧开后，将鱼放入蒸锅，大火蒸8-10分钟（根据鱼的大小调整时间）。',
        image: ''
      },
      {
        text: '蒸好后倒掉盘中的水，撒上新鲜葱丝，淋上蒸鱼豉油。',
        image: ''
      },
      {
        text: '烧热食用油，趁热浇在葱丝上，激发出香味即可。',
        image: ''
      }
    ]
  },
  '2': {
    id: '2',
    name: '鸡胸肉沙拉',
    category: '减脂餐',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    likes: 2156,
    collections: 892,
    views: 12300,
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 18,
      fat: 8
    },
    description: '鸡胸肉沙拉是健身人士的最爱，低脂高蛋白，搭配新鲜蔬菜，营养均衡。鸡胸肉是优质蛋白质来源，配合多种蔬菜提供丰富的维生素和膳食纤维，既美味又健康。',
    ingredients: [
      { name: '鸡胸肉', amount: '150g' },
      { name: '生菜', amount: '100g' },
      { name: '圣女果', amount: '8颗' },
      { name: '黄瓜', amount: '半根' },
      { name: '紫甘蓝', amount: '50g' },
      { name: '橄榄油', amount: '1勺' },
      { name: '黑胡椒', amount: '适量' },
      { name: '柠檬汁', amount: '1勺' }
    ],
    steps: [
      {
        text: '鸡胸肉洗净，用黑胡椒和少许盐腌制15分钟。',
        image: ''
      },
      {
        text: '平底锅加少许橄榄油，中火煎鸡胸肉，每面煎5-6分钟至熟透。',
        image: ''
      },
      {
        text: '将生菜、紫甘蓝洗净撕成小块，黄瓜切片，圣女果对半切。',
        image: ''
      },
      {
        text: '煎好的鸡胸肉切成条状，放凉备用。',
        image: ''
      },
      {
        text: '将所有蔬菜放入大碗中，加入鸡胸肉。',
        image: ''
      },
      {
        text: '淋上橄榄油和柠檬汁，撒上黑胡椒，拌匀即可享用。',
        image: ''
      }
    ]
  },
  '3': {
    id: '3',
    name: '燕麦粥',
    category: '健康早餐',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800',
    likes: 3421,
    collections: 1234,
    views: 18900,
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 55,
      fat: 6
    },
    description: '燕麦粥是一道营养丰富的健康早餐，富含膳食纤维和β-葡聚糖，有助于降低胆固醇，稳定血糖。搭配坚果和水果，提供全面的营养，让你精力充沛地开始新的一天。',
    ingredients: [
      { name: '燕麦片', amount: '50g' },
      { name: '牛奶', amount: '200ml' },
      { name: '香蕉', amount: '半根' },
      { name: '蓝莓', amount: '适量' },
      { name: '核桃', amount: '3颗' },
      { name: '蜂蜜', amount: '1勺' }
    ],
    steps: [
      {
        text: '将燕麦片放入锅中，加入适量水，中火煮5分钟。',
        image: ''
      },
      {
        text: '倒入牛奶，继续煮2-3分钟，搅拌均匀。',
        image: ''
      },
      {
        text: '香蕉切片，核桃切碎备用。',
        image: ''
      },
      {
        text: '将煮好的燕麦粥盛入碗中。',
        image: ''
      },
      {
        text: '摆上香蕉片、蓝莓和核桃碎。',
        image: ''
      },
      {
        text: '最后淋上蜂蜜，即可享用美味又健康的早餐。',
        image: ''
      }
    ]
  },
  '4': {
    id: '4',
    name: '牛油果吐司',
    category: '快手早餐',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    likes: 2890,
    collections: 1056,
    views: 15600,
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 38,
      fat: 24
    },
    description: '牛油果吐司是一道简单快手的营养早餐，牛油果富含健康脂肪和多种维生素，搭配全麦吐司和水煮蛋，提供均衡的营养，是健身人士的理想选择。',
    ingredients: [
      { name: '全麦吐司', amount: '2片' },
      { name: '牛油果', amount: '1个' },
      { name: '鸡蛋', amount: '1个' },
      { name: '柠檬汁', amount: '少许' },
      { name: '黑胡椒', amount: '适量' },
      { name: '海盐', amount: '适量' }
    ]
  },
  '5': {
    id: '5',
    name: '糙米三文鱼饭',
    category: '增肌餐',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
    likes: 1987,
    collections: 743,
    views: 11200,
    nutrition: {
      calories: 560,
      protein: 38,
      carbs: 52,
      fat: 18
    },
    description: '糙米三文鱼饭是一道营养均衡的增肌餐，三文鱼富含优质蛋白质和Omega-3脂肪酸，糙米提供复合碳水化合物，搭配新鲜蔬菜，是健身增肌的完美选择。',
    ingredients: [
      { name: '三文鱼', amount: '150g' },
      { name: '糙米', amount: '100g' },
      { name: '西兰花', amount: '80g' },
      { name: '胡萝卜', amount: '50g' },
      { name: '柠檬', amount: '半个' },
      { name: '橄榄油', amount: '1勺' }
    ]
  },
  '6': {
    id: '6',
    name: '番茄鸡蛋汤',
    category: '家常汤羹',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    likes: 4521,
    collections: 1678,
    views: 23400,
    nutrition: {
      calories: 160,
      protein: 10,
      carbs: 12,
      fat: 8
    },
    description: '番茄鸡蛋汤是一道经典的家常汤品，酸甜可口，营养丰富。番茄富含番茄红素和维生素C，鸡蛋提供优质蛋白质，简单易做，老少皆宜。',
    ingredients: [
      { name: '番茄', amount: '2个' },
      { name: '鸡蛋', amount: '2个' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '香油', amount: '少许' }
    ]
  },
  '7': {
    id: '7',
    name: '水果沙拉',
    category: '轻食',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
    likes: 3156,
    collections: 1289,
    views: 17800,
    nutrition: {
      calories: 150,
      protein: 3,
      carbs: 35,
      fat: 2
    },
    description: '水果沙拉是一道清爽健康的轻食，富含维生素、矿物质和膳食纤维。多种水果搭配，色彩缤纷，口感丰富，是下午茶或餐后甜点的理想选择。',
    ingredients: [
      { name: '苹果', amount: '1个' },
      { name: '香蕉', amount: '1根' },
      { name: '奇异果', amount: '2个' },
      { name: '草莓', amount: '8颗' },
      { name: '酸奶', amount: '100ml' },
      { name: '蜂蜜', amount: '1勺' }
    ]
  },
  '8': {
    id: '8',
    name: '蒜蓉西兰花',
    category: '快手菜',
    image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=800',
    likes: 2734,
    collections: 956,
    views: 14500,
    nutrition: {
      calories: 120,
      protein: 6,
      carbs: 15,
      fat: 4
    },
    description: '蒜蓉西兰花是一道简单快手的健康蔬菜，西兰花富含维生素C、K和膳食纤维，蒜蓉增添香味，清淡爽口，是减脂期的理想配菜。',
    ingredients: [
      { name: '西兰花', amount: '300g' },
      { name: '大蒜', amount: '5瓣' },
      { name: '盐', amount: '适量' },
      { name: '橄榄油', amount: '1勺' }
    ]
  },
  '9': {
    id: '9',
    name: '红烧肉',
    category: '家常菜',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    likes: 5678,
    collections: 2134,
    views: 28900,
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 18,
      fat: 38
    },
    description: '红烧肉是一道经典的中式家常菜，色泽红亮，肥而不腻，入口即化。五花肉经过慢炖，吸收了酱汁的香味，配上米饭，是最地道的中国味道。',
    ingredients: [
      { name: '五花肉', amount: '500g' },
      { name: '冰糖', amount: '30g' },
      { name: '生抽', amount: '3勺' },
      { name: '老抽', amount: '1勺' },
      { name: '料酒', amount: '2勺' },
      { name: '八角', amount: '2个' },
      { name: '桂皮', amount: '1块' },
      { name: '姜片', amount: '3片' }
    ]
  },
  '10': {
    id: '10',
    name: '宫保鸡丁',
    category: '川菜',
    image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=800',
    likes: 4321,
    collections: 1567,
    views: 21200,
    nutrition: {
      calories: 380,
      protein: 32,
      carbs: 24,
      fat: 18
    },
    description: '宫保鸡丁是一道经典川菜，鸡肉鲜嫩，花生酥脆，酸甜微辣，口感丰富。这道菜色香味俱全，是中餐馆的必点菜品。',
    ingredients: [
      { name: '鸡胸肉', amount: '250g' },
      { name: '花生米', amount: '80g' },
      { name: '干辣椒', amount: '10个' },
      { name: '花椒', amount: '1勺' },
      { name: '葱姜蒜', amount: '适量' },
      { name: '生抽', amount: '2勺' },
      { name: '醋', amount: '1勺' },
      { name: '糖', amount: '1勺' }
    ]
  },
  '11': {
    id: '11',
    name: '麻婆豆腐',
    category: '川菜',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    likes: 3890,
    collections: 1423,
    views: 19600,
    nutrition: {
      calories: 220,
      protein: 15,
      carbs: 12,
      fat: 14
    },
    description: '麻婆豆腐是四川名菜，豆腐嫩滑，麻辣鲜香。豆腐富含优质蛋白质，搭配肉末和豆瓣酱，味道浓郁，下饭神器。',
    ingredients: [
      { name: '嫩豆腐', amount: '400g' },
      { name: '猪肉末', amount: '100g' },
      { name: '豆瓣酱', amount: '2勺' },
      { name: '花椒粉', amount: '1勺' },
      { name: '葱姜蒜', amount: '适量' },
      { name: '生抽', amount: '1勺' }
    ]
  },
  '12': {
    id: '12',
    name: '糖醋排骨',
    category: '家常菜',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    likes: 4567,
    collections: 1789,
    views: 23400,
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 35,
      fat: 22
    },
    description: '糖醋排骨是一道酸甜可口的家常菜，排骨外酥里嫩，酱汁浓郁。这道菜色泽红亮，酸甜适中，深受大人小孩喜爱。',
    ingredients: [
      { name: '排骨', amount: '500g' },
      { name: '白糖', amount: '3勺' },
      { name: '醋', amount: '2勺' },
      { name: '生抽', amount: '2勺' },
      { name: '料酒', amount: '1勺' },
      { name: '姜片', amount: '3片' }
    ]
  },
  '13': {
    id: '13',
    name: '清炒时蔬',
    category: '素菜',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    likes: 2345,
    collections: 876,
    views: 12300,
    nutrition: {
      calories: 100,
      protein: 4,
      carbs: 18,
      fat: 2
    },
    description: '清炒时蔬是一道清淡健康的素菜，保留了蔬菜的原汁原味和营养。多种蔬菜搭配，色彩丰富，口感清脆，是减脂期的理想选择。',
    ingredients: [
      { name: '油菜', amount: '150g' },
      { name: '胡萝卜', amount: '50g' },
      { name: '木耳', amount: '30g' },
      { name: '大蒜', amount: '3瓣' },
      { name: '盐', amount: '适量' }
    ]
  },
  '14': {
    id: '14',
    name: '酸辣土豆丝',
    category: '快手菜',
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800',
    likes: 3678,
    collections: 1234,
    views: 16700,
    nutrition: {
      calories: 180,
      protein: 3,
      carbs: 32,
      fat: 5
    },
    description: '酸辣土豆丝是一道经典的快手菜，土豆丝爽脆，酸辣开胃。这道菜简单易做，5分钟就能上桌，是家常菜的代表。',
    ingredients: [
      { name: '土豆', amount: '2个' },
      { name: '青椒', amount: '1个' },
      { name: '干辣椒', amount: '5个' },
      { name: '醋', amount: '2勺' },
      { name: '盐', amount: '适量' }
    ]
  },
  '15': {
    id: '15',
    name: '水煮鱼',
    category: '川菜',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
    likes: 5234,
    collections: 2012,
    views: 26800,
    nutrition: {
      calories: 420,
      protein: 38,
      carbs: 15,
      fat: 24
    },
    description: '水煮鱼是一道经典川菜，鱼肉鲜嫩，麻辣鲜香。鱼片在滚烫的红油中保持鲜嫩，配上豆芽和各种蔬菜，是麻辣爱好者的最爱。',
    ingredients: [
      { name: '草鱼', amount: '1条' },
      { name: '豆芽', amount: '200g' },
      { name: '豆瓣酱', amount: '3勺' },
      { name: '干辣椒', amount: '20个' },
      { name: '花椒', amount: '2勺' },
      { name: '葱姜蒜', amount: '适量' }
    ]
  },
  '16': {
    id: '16',
    name: '紫菜蛋花汤',
    category: '汤羹',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    likes: 2890,
    collections: 1045,
    views: 14200,
    nutrition: {
      calories: 115,
      protein: 8,
      carbs: 6,
      fat: 6
    },
    description: '紫菜蛋花汤是一道简单营养的家常汤，紫菜富含碘和多种矿物质，鸡蛋提供优质蛋白质。这道汤清淡鲜美，制作简单，适合日常饮用。',
    ingredients: [
      { name: '紫菜', amount: '10g' },
      { name: '鸡蛋', amount: '2个' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '适量' },
      { name: '香油', amount: '少许' }
    ]
  },
  '17': {
    id: '17',
    name: '冬瓜排骨汤',
    category: '汤羹',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800',
    likes: 3456,
    collections: 1289,
    views: 17800,
    nutrition: {
      calories: 280,
      protein: 22,
      carbs: 12,
      fat: 16
    },
    description: '冬瓜排骨汤是一道清热解暑的养生汤，冬瓜清淡爽口，排骨鲜香，汤汁清澈。这道汤营养丰富，特别适合夏天饮用。',
    ingredients: [
      { name: '排骨', amount: '300g' },
      { name: '冬瓜', amount: '400g' },
      { name: '姜片', amount: '3片' },
      { name: '葱段', amount: '2根' },
      { name: '盐', amount: '适量' }
    ]
  },
  '18': {
    id: '18',
    name: '凉拌黄瓜',
    category: '凉菜',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800',
    likes: 2678,
    collections: 945,
    views: 13400,
    nutrition: {
      calories: 40,
      protein: 2,
      carbs: 8,
      fat: 1
    },
    description: '凉拌黄瓜是一道清爽开胃的凉菜，黄瓜脆嫩多汁，低热量高水分。这道菜简单快手，酸甜可口，是夏日必备凉菜。',
    ingredients: [
      { name: '黄瓜', amount: '2根' },
      { name: '大蒜', amount: '3瓣' },
      { name: '醋', amount: '2勺' },
      { name: '生抽', amount: '1勺' },
      { name: '香油', amount: '少许' },
      { name: '辣椒油', amount: '适量' }
    ]
  },
  '19': {
    id: '19',
    name: '小米粥',
    category: '主食',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800',
    likes: 3123,
    collections: 1156,
    views: 15600,
    nutrition: {
      calories: 120,
      protein: 4,
      carbs: 24,
      fat: 2
    },
    description: '小米粥是一道养胃健脾的传统主食，小米富含B族维生素和矿物质。这道粥口感细腻，易于消化，特别适合早餐或病后调养。',
    ingredients: [
      { name: '小米', amount: '100g' },
      { name: '水', amount: '适量' },
      { name: '红枣', amount: '5颗' },
      { name: '枸杞', amount: '适量' }
    ]
  },
  '20': {
    id: '20',
    name: '全麦面包',
    category: '烘焙',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    likes: 2890,
    collections: 1034,
    views: 14500,
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 32,
      fat: 3
    },
    description: '全麦面包是一道健康的主食选择，富含膳食纤维和B族维生素。相比白面包，全麦面包升糖指数更低，更适合减脂和控糖人群。',
    ingredients: [
      { name: '全麦粉', amount: '300g' },
      { name: '酵母', amount: '5g' },
      { name: '水', amount: '180ml' },
      { name: '盐', amount: '5g' },
      { name: '橄榄油', amount: '20ml' }
    ]
  }
};

// 根据ID获取食谱详情
function getRecipeById(id) {
  return recipeDetails[id] || null;
}

// 获取所有食谱列表
function getAllRecipes() {
  return Object.values(recipeDetails);
}

module.exports = {
  recipeDetails,
  getRecipeById,
  getAllRecipes
};
