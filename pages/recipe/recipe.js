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
        cover: 'https://images.unsplash.com/photo-1604908554020-8f0a9f2b805d?auto=format&fit=crop&w=1200&q=60'
      },
      {
        id: 'r5',
        name: '无糖酸奶坚果杯',
        kcal: 260,
        categoryId: 'dessert',
        tags: ['sugar', 'cut'],
        cover: 'https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1200&q=60'
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
    // 这里先占位：后续你做详情页时可跳转
    wx.showToast({ title: `打开食谱：${id}`, icon: 'none' });
  }
});
