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
  }
};

// 根据ID获取食谱详情
function getRecipeById(id) {
  return recipeDetails[id] || null;
}

module.exports = {
  recipeDetails,
  getRecipeById
};
