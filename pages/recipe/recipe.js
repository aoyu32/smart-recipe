// pages/recipe/recipe.js
import { getAllCategories, getAllRecipes, getRecipesByCategory, getRecipesByGoalTag, getRecipesByCategoryAndGoalTag } from '../../api/recipe';

Page({
  data: {
    keyword: '',
    activeGoal: '',
    activeCategoryId: 'all',
    categories: [],
    recipes: [],
    filteredRecipes: [],
    mockRecipes: [
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

  async onLoad() {
    await this.loadCategories();
    await this.loadRecipes();
  },

  // 加载分类列表
  async loadCategories() {
    try {
      const categories = await getAllCategories();
      // 在前面添加"全部"选项
      const allCategories = [{ id: 'all', name: '全部' }, ...categories];
      this.setData({ categories: allCategories });
    } catch (error) {
      console.error('加载分类失败：', error);
      wx.showToast({
        title: '加载分类失败',
        icon: 'none'
      });
    }
  },

  // 加载食谱列表
  async loadRecipes() {
    try {
      const { activeCategoryId, activeGoal } = this.data;
      let recipes = [];

      // 根据不同条件调用不同接口
      if (activeCategoryId === 'all' && !activeGoal) {
        // 查询所有食谱
        recipes = await getAllRecipes();
      } else if (activeCategoryId !== 'all' && !activeGoal) {
        // 根据分类查询
        recipes = await getRecipesByCategory(activeCategoryId);
      } else if (activeCategoryId === 'all' && activeGoal) {
        // 根据健康目标查询
        recipes = await getRecipesByGoalTag(activeGoal);
      } else {
        // 根据分类和健康目标查询
        recipes = await getRecipesByCategoryAndGoalTag(activeCategoryId, activeGoal);
      }

      this.setData({
        recipes: recipes,
        filteredRecipes: recipes
      });
    } catch (error) {
      console.error('加载食谱失败：', error);
      wx.showToast({
        title: '加载食谱失败',
        icon: 'none'
      });
    }
  },

  updateFiltered() {
    const { recipes, keyword } = this.data;
    const kw = (keyword || '').trim().toLowerCase();

    // 只进行关键词筛选，分类和目标筛选由后端完成
    const list = recipes.filter((r) => {
      const hitKeyword = kw ? (r.name || '').toLowerCase().includes(kw) : true;
      return hitKeyword;
    });

    this.setData({ filteredRecipes: list });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.updateFiltered());
  },

  onSearch() {
    const keyword = this.data.keyword.trim();
    if (keyword) {
      // 跳转到搜索页面
      wx.navigateTo({
        url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
      });
    } else {
      // 如果没有关键词，只更新本地筛选
      this.updateFiltered();
    }
  },

  onTapGoal(e) {
    const goal = e.currentTarget.dataset.goal;
    const { activeGoal } = this.data;
    const newGoal = activeGoal === goal ? '' : goal;
    this.setData({ activeGoal: newGoal }, async () => {
      await this.loadRecipes();
    });
  },

  onChooseCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategoryId: id }, async () => {
      await this.loadRecipes();
    });
  },

  onOpenRecipe(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到食谱详情页，直接使用后端返回的ID
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    });
  }
});