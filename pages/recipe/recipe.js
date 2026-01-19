// pages/recipe/recipe.js
Page({
  data: {
    keyword: '',
    activeGoal: '',
    activeCategoryId: 'all',
    categories: [
      { id: 'all', name: '全部' },
      { id: 'homestyle', name: '家常菜' },
      { id: 'quick', name: '快手菜' },
      { id: 'salad', name: '沙拉' },
      { id: 'soup', name: '汤羹' },
      { id: 'staple', name: '主食' },
      { id: 'dessert', name: '甜品' }
    ],
    recipes: [
      {
        id: 'r1',
        name: '鸡胸肉蔬菜沙拉',
        kcal: 380,
        categoryId: 'salad',
        tags: ['cut', 'muscle'],
        cover: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r2',
        name: '牛油果鸡蛋吐司',
        kcal: 420,
        categoryId: 'quick',
        tags: ['muscle'],
        cover: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r3',
        name: '糙米三文鱼饭',
        kcal: 560,
        categoryId: 'staple',
        tags: ['bulk', 'muscle'],
        cover: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r4',
        name: '番茄鸡蛋汤',
        kcal: 160,
        categoryId: 'soup',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r5',
        name: '无糖酸奶坚果杯',
        kcal: 260,
        categoryId: 'dessert',
        tags: ['sugar', 'cut'],
        cover: 'https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r6',
        name: '红烧肉',
        kcal: 520,
        categoryId: 'homestyle',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r7',
        name: '宫保鸡丁',
        kcal: 380,
        categoryId: 'homestyle',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r8',
        name: '麻婆豆腐',
        kcal: 220,
        categoryId: 'homestyle',
        tags: ['cut'],
        cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r9',
        name: '糖醋排骨',
        kcal: 450,
        categoryId: 'homestyle',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r10',
        name: '蒜蓉西兰花',
        kcal: 120,
        categoryId: 'quick',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r11',
        name: '清炒时蔬',
        kcal: 100,
        categoryId: 'quick',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r12',
        name: '酸辣土豆丝',
        kcal: 180,
        categoryId: 'quick',
        tags: ['cut'],
        cover: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r13',
        name: '水煮鱼',
        kcal: 420,
        categoryId: 'homestyle',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r14',
        name: '紫菜蛋花汤',
        kcal: 115,
        categoryId: 'soup',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r15',
        name: '冬瓜排骨汤',
        kcal: 280,
        categoryId: 'soup',
        tags: ['cut'],
        cover: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r16',
        name: '凉拌黄瓜',
        kcal: 40,
        categoryId: 'salad',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r17',
        name: '水果沙拉',
        kcal: 150,
        categoryId: 'salad',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r18',
        name: '白米饭',
        kcal: 200,
        categoryId: 'staple',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r19',
        name: '小米粥',
        kcal: 120,
        categoryId: 'staple',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r20',
        name: '全麦面包',
        kcal: 180,
        categoryId: 'staple',
        tags: ['cut', 'muscle'],
        cover: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r21',
        name: '提拉米苏',
        kcal: 320,
        categoryId: 'dessert',
        tags: ['bulk'],
        cover: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r22',
        name: '芒果布丁',
        kcal: 180,
        categoryId: 'dessert',
        tags: ['sugar'],
        cover: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r23',
        name: '清蒸鲈鱼',
        kcal: 180,
        categoryId: 'homestyle',
        tags: ['cut', 'muscle'],
        cover: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r24',
        name: '蒜蓉油麦菜',
        kcal: 80,
        categoryId: 'quick',
        tags: ['cut', 'sugar'],
        cover: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=1200&q=60'
      }
    ]
  },

  onLoad() {
    this.updateFiltered();
  },

  updateFiltered() {
    const { recipes, activeCategoryId, keyword, activeGoal } = this.data;
    const kw = (keyword || '').trim().toLowerCase();

    const list = recipes.filter((r) => {
      const hitCategory = activeCategoryId === 'all' ? true : r.categoryId === activeCategoryId;
      const hitGoal = activeGoal ? (r.tags || []).includes(activeGoal) : true;
      const hitKeyword = kw ? (r.name || '').toLowerCase().includes(kw) : true;
      return hitCategory && hitGoal && hitKeyword;
    });

    this.setData({ filteredRecipes: list });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.updateFiltered());
  },

  onSearch() {
    this.updateFiltered();
  },

  onTapGoal(e) {
    const goal = e.currentTarget.dataset.goal;
    const { activeGoal } = this.data;
    this.setData({ activeGoal: activeGoal === goal ? '' : goal }, () => this.updateFiltered());
  },

  onChooseCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategoryId: id }, () => this.updateFiltered());
  },

  onOpenRecipe(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到食谱详情页
    // 将食谱ID映射到详情页ID（r1->1, r2->2, r3->3）
    const detailId = id.replace('r', '');
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${detailId}`
    });
  }
});