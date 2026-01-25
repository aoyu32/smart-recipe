// pages/recipe-detail/recipe-detail.js
const mockRecipeDetail = require('../../mock/recipe-detail.js');

Page({
  data: {
    recipeId: '',
    recipeDetail: {},
    isLiked: false,
    isCollected: false,
    showMealModal: false,
    statusBarHeight: 0,
    navBarHeight: 0
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 计算导航栏高度
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });
    
    const recipeId = options.id || '1';
    this.setData({
      recipeId: recipeId
    });
    
    // 加载食谱详情
    this.loadRecipeDetail(recipeId);
  },

  // 加载食谱详情
  loadRecipeDetail(id) {
    // 使用mock数据
    const detail = mockRecipeDetail.getRecipeById(id);
    
    if (detail) {
      this.setData({
        recipeDetail: detail,
        isLiked: detail.isLiked || false,
        isCollected: detail.isCollected || false
      });
    } else {
      wx.showToast({
        title: '食谱不存在',
        icon: 'none'
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 切换点赞
  toggleLike() {
    const isLiked = !this.data.isLiked;
    const recipeDetail = { ...this.data.recipeDetail };
    
    if (isLiked) {
      recipeDetail.likes += 1;
    } else {
      recipeDetail.likes -= 1;
    }
    
    this.setData({
      isLiked: isLiked,
      recipeDetail: recipeDetail
    });
    
    wx.showToast({
      title: isLiked ? '已点赞' : '已取消点赞',
      icon: 'success',
      duration: 1000
    });
  },

  // 切换收藏
  toggleCollect() {
    const isCollected = !this.data.isCollected;
    const recipeDetail = { ...this.data.recipeDetail };
    
    if (isCollected) {
      recipeDetail.collections += 1;
    } else {
      recipeDetail.collections -= 1;
    }
    
    this.setData({
      isCollected: isCollected,
      recipeDetail: recipeDetail
    });
    
    wx.showToast({
      title: isCollected ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1000
    });
  },

  // 显示餐次选择
  showMealOptions() {
    this.setData({
      showMealModal: true
    });
  },

  // 隐藏餐次选择
  hideMealOptions() {
    this.setData({
      showMealModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 加入餐食
  addToMeal(e) {
    const mealType = e.currentTarget.dataset.type;
    const mealNames = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐'
    };
    
    this.hideMealOptions();
    
    // 检查是否是从主页编辑或添加模式进入的
    const editingMeal = wx.getStorageSync('editingMeal');
    const addingMeal = wx.getStorageSync('addingMeal');
    
    // 构建食物数据
    const foodData = {
      id: this.data.recipeDetail.id,
      name: this.data.recipeDetail.name,
      image: this.data.recipeDetail.image,
      amount: '1份',
      calories: this.data.recipeDetail.nutrition.calories,
      protein: this.data.recipeDetail.nutrition.protein,
      carbs: this.data.recipeDetail.nutrition.carbs,
      fat: this.data.recipeDetail.nutrition.fat,
      category: this.data.recipeDetail.category
    };
    
    if (editingMeal && editingMeal.mealType) {
      // 替换模式
      wx.setStorageSync('replaceMeal', {
        mealType: editingMeal.mealType,
        index: editingMeal.index,
        newFood: foodData
      });
      
      wx.showToast({
        title: '替换成功',
        icon: 'success'
      });
      
      // 返回主页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    } else if (addingMeal && addingMeal.mealType) {
      // 添加模式（从空状态点击添加）
      wx.setStorageSync('addMeal', {
        mealType: addingMeal.mealType,
        newFood: foodData
      });
      
      wx.showToast({
        title: `已加入${mealNames[addingMeal.mealType]}`,
        icon: 'success'
      });
      
      // 返回主页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    } else {
      // 普通添加模式（用户手动选择餐次）
      wx.setStorageSync('addMeal', {
        mealType: mealType,
        newFood: foodData
      });
      
      wx.showToast({
        title: `已加入${mealNames[mealType]}`,
        icon: 'success'
      });
      
      // 返回主页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    }
  }
})
