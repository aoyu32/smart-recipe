// index.js
const { banners, todayRecipe, rankings } = require('../../mock/index.js');

Page({
  data: {
    searchKeyword: '',
    statusBarHeight: 0,
    menuButtonInfo: {},
    headerPaddingTop: 0,
    
    // 食谱卡片展开状态
    recipeCardExpanded: false,
    
    // AI生成状态
    isGenerating: false,
    
    // 长按编辑状态
    editingMealType: '', // 当前正在编辑的餐次类型
    editingItemIndex: -1, // 当前正在编辑的食物索引
    
    // 轮播图数据
    banners: [],
    
    // 今日食谱数据
    todayRecipe: null,
    
    // 打卡状态
    checkinMeals: [
      { type: 'breakfast', label: '早餐', checked: false, icon: '/assets/icons/home/breakfast.png' },
      { type: 'lunch', label: '午餐', checked: false, icon: '/assets/icons/home/lunch.png' },
      { type: 'dinner', label: '晚餐', checked: false, icon: '/assets/icons/home/dinner.png' }
    ],
    
    // 排行榜数据
    rankings: []
  },

  // 获取当前日期和星期几
  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    return {
      date: `${year}年${month}月${day}日`,
      weekday: weekday
    };
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const headerPaddingTop = menuButtonInfo.top;
    
    // 获取当前日期和星期几
    const { date, weekday } = this.getCurrentDate();
    
    // 更新今日食谱数据中的日期和星期几
    const updatedTodayRecipe = {
      ...todayRecipe,
      date: date,
      weekday: weekday
    };
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      headerPaddingTop: headerPaddingTop,
      banners: banners,
      todayRecipe: updatedTodayRecipe,
      rankings: rankings
    });
  },

  onShow() {
    // 检查是否有替换食物的操作
    const replaceMeal = wx.getStorageSync('replaceMeal');
    if (replaceMeal && replaceMeal.mealType && replaceMeal.newFood) {
      const { mealType, index, newFood } = replaceMeal;
      const todayRecipe = this.data.todayRecipe;
      
      // 替换指定索引的食物
      todayRecipe.meals[mealType].foods[index] = newFood;
      
      // 重新计算该餐次的总热量
      const totalCalories = todayRecipe.meals[mealType].foods.reduce((sum, food) => sum + food.calories, 0);
      todayRecipe.meals[mealType].calories = totalCalories;
      
      // 重新计算今日总热量
      const dailyCalories = todayRecipe.meals.breakfast.calories + 
                           todayRecipe.meals.lunch.calories + 
                           todayRecipe.meals.dinner.calories;
      todayRecipe.totalCalories = dailyCalories;
      
      this.setData({
        todayRecipe: todayRecipe
      });
      
      // 清除缓存
      wx.removeStorageSync('replaceMeal');
      wx.removeStorageSync('editingMeal');
      
      wx.showToast({
        title: '替换成功',
        icon: 'success'
      });
    }
    
    // 检查是否有添加食物的操作
    const addMeal = wx.getStorageSync('addMeal');
    if (addMeal && addMeal.mealType && addMeal.newFood) {
      const { mealType, newFood } = addMeal;
      const todayRecipe = this.data.todayRecipe;
      
      // 添加新食物到指定餐次
      todayRecipe.meals[mealType].foods.push(newFood);
      
      // 重新计算该餐次的总热量
      const totalCalories = todayRecipe.meals[mealType].foods.reduce((sum, food) => sum + food.calories, 0);
      todayRecipe.meals[mealType].calories = totalCalories;
      
      // 重新计算今日总热量
      const dailyCalories = todayRecipe.meals.breakfast.calories + 
                           todayRecipe.meals.lunch.calories + 
                           todayRecipe.meals.dinner.calories;
      todayRecipe.totalCalories = dailyCalories;
      
      this.setData({
        todayRecipe: todayRecipe
      });
      
      // 清除缓存
      wx.removeStorageSync('addMeal');
      wx.removeStorageSync('addingMeal');
      
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
    }
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  onSearch(e) {
    const keyword = e.detail.value;
    this.performSearch(keyword);
  },

  onSearchBtn() {
    this.performSearch(this.data.searchKeyword);
  },

  performSearch(keyword) {
    if (keyword && keyword.trim()) {
      // 跳转到搜索页面
      wx.navigateTo({
        url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
      });
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  },

  // AI智能生成
  onAIGenerate(e) {
    // 阻止事件冒泡，避免触发展开/收起
    if (e) {
      e.stopPropagation();
    }
    
    // 先取消编辑状态
    this.cancelEdit();
    
    // 如果正在生成，不重复触发
    if (this.data.isGenerating) {
      return;
    }
    
    this.setData({
      isGenerating: true
    });
    
    wx.showLoading({ title: '智能生成中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        isGenerating: false
      });
      wx.showToast({
        title: '生成成功！',
        icon: 'success'
      });
      // 这里可以重新加载食谱数据
    }, 2000);
  },

  // 切换食谱卡片展开/收起
  toggleRecipeCard() {
    // 先取消编辑状态
    this.cancelEdit();
    
    this.setData({
      recipeCardExpanded: !this.data.recipeCardExpanded
    });
  },

  // 查看更多食谱
  onViewMoreRecipes() {
    // 先取消编辑状态
    this.cancelEdit();
    
    wx.navigateTo({
      url: '/pages/recipe/recipe'
    });
  },

  // 点击餐次
  onMealTap(e) {
    // 先取消编辑状态
    this.cancelEdit();
    
    const type = e.currentTarget.dataset.type;
    console.log('查看餐次:', type);
    wx.showToast({
      title: '查看食谱详情',
      icon: 'none'
    });
  },

  // 长按食物项
  onFoodLongPress(e) {
    const { mealType, index } = e.currentTarget.dataset;
    
    // 如果已经在编辑同一个项，则取消编辑
    if (this.data.editingMealType === mealType && this.data.editingItemIndex === index) {
      this.cancelEdit();
    } else {
      this.setData({
        editingMealType: mealType,
        editingItemIndex: index
      });
    }
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      editingMealType: '',
      editingItemIndex: -1
    });
  },

  // 点击页面其他区域取消编辑
  onPageTap() {
    if (this.data.editingMealType || this.data.editingItemIndex >= 0) {
      this.cancelEdit();
    }
  },

  // 删除食物项
  deleteFoodItem(e) {
    const { mealType, index } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食物吗？',
      success: (res) => {
        if (res.confirm) {
          const todayRecipe = this.data.todayRecipe;
          
          // 删除指定索引的食物
          todayRecipe.meals[mealType].foods.splice(index, 1);
          
          // 重新计算该餐次的总热量
          const totalCalories = todayRecipe.meals[mealType].foods.reduce((sum, food) => sum + food.calories, 0);
          todayRecipe.meals[mealType].calories = totalCalories;
          
          // 重新计算今日总热量
          const dailyCalories = todayRecipe.meals.breakfast.calories + 
                               todayRecipe.meals.lunch.calories + 
                               todayRecipe.meals.dinner.calories;
          todayRecipe.totalCalories = dailyCalories;
          
          this.setData({
            todayRecipe: todayRecipe,
            editingMealType: '',
            editingItemIndex: -1
          });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        } else {
          // 用户点击取消，也关闭编辑状态
          this.cancelEdit();
        }
      }
    });
  },

  // 编辑食物项（跳转到食谱页选择）
  editFoodItem(e) {
    const { mealType, index } = e.currentTarget.dataset;
    
    // 先取消编辑状态
    this.cancelEdit();
    
    // 保存当前编辑信息到全局数据或本地存储
    wx.setStorageSync('editingMeal', {
      mealType: mealType,
      index: index
    });
    
    // 使用switchTab跳转到tabbar页面
    wx.switchTab({
      url: '/pages/recipe/recipe',
      success: () => {
        // 跳转成功后，通过事件或全局变量通知recipe页面
        const pages = getCurrentPages();
        const recipePage = pages.find(page => page.route === 'pages/recipe/recipe');
        if (recipePage && recipePage.setMode) {
          recipePage.setMode('replace');
        }
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 添加食谱
  addRecipe(e) {
    const { mealType } = e.currentTarget.dataset;
    
    // 先取消编辑状态
    this.cancelEdit();
    
    // 保存当前添加的餐次类型
    wx.setStorageSync('addingMeal', {
      mealType: mealType
    });
    
    // 使用switchTab跳转到tabbar页面
    wx.switchTab({
      url: '/pages/recipe/recipe',
      success: () => {
        // 跳转成功后，通过事件或全局变量通知recipe页面
        const pages = getCurrentPages();
        const recipePage = pages.find(page => page.route === 'pages/recipe/recipe');
        if (recipePage && recipePage.setMode) {
          recipePage.setMode('add');
        }
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 快捷入口导航
  onNavigate(e) {
    // 先取消编辑状态
    this.cancelEdit();
    
    const page = e.currentTarget.dataset.page;
    
    if (page === 'diary') {
      wx.navigateTo({
        url: '/pages/diet-diary/diet-diary'
      });
    } else if (page === 'health') {
      wx.navigateTo({
        url: '/pages/health-profile/health-profile'
      });
    }
  },

  // 饮食打卡
  onCheckin(e) {
    // 先取消编辑状态
    this.cancelEdit();
    
    const type = e.currentTarget.dataset.type;
    const checkinMeals = this.data.checkinMeals.map(item => {
      if (item.type === type) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    
    this.setData({ checkinMeals });
    
    const meal = checkinMeals.find(item => item.type === type);
    wx.showToast({
      title: meal.checked ? '打卡成功！' : '取消打卡',
      icon: meal.checked ? 'success' : 'none'
    });
  },

  // 查看排行榜
  onViewRanking() {
    // 先取消编辑状态
    this.cancelEdit();
    
    wx.showToast({
      title: '查看完整排行榜',
      icon: 'none'
    });
  },

  // 点击食谱
  // 跳转到食谱详情页
  navigateToRecipeDetail(e) {
    // 先取消编辑状态
    this.cancelEdit();
    
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    });
  },

  // 点击食谱（保留兼容）
  onRecipeTap(e) {
    this.navigateToRecipeDetail(e);
  },

  // 阻止冒泡
  stopPropagation() {}
})
