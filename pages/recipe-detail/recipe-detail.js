// pages/recipe-detail/recipe-detail.js
import { getRecipeDetailById, likeRecipe, unlikeRecipe, collectRecipe, uncollectRecipe } from '../../api/recipe';

Page({
  data: {
    recipeId: '',
    isCustom: false,
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
    const isCustom = options.custom === 'true';

    this.setData({
      recipeId: recipeId,
      isCustom: isCustom
    });

    // 加载食谱详情
    this.loadRecipeDetail(recipeId, isCustom);
  },

  // 加载食谱详情
  async loadRecipeDetail(id, isCustom) {
    if (isCustom) {
      // 从自定义食谱中获取
      const myRecipes = wx.getStorageSync('myRecipes') || [];
      const detail = myRecipes.find(item => item.id === id);

      if (detail) {
        const collectedRecipes = wx.getStorageSync('collectedRecipes') || [];
        const isCollected = collectedRecipes.includes(id);

        this.setData({
          recipeDetail: detail,
          isLiked: detail.isLiked || false,
          isCollected: isCollected
        });
      } else {
        wx.showToast({
          title: '食谱不存在',
          icon: 'none'
        });
      }
    } else {
      // 从后端获取
      try {
        const detail = await getRecipeDetailById(id);

        this.setData({
          recipeDetail: detail,
          isLiked: detail.isLiked || false,
          isCollected: detail.isCollected || false
        });
      } catch (error) {
        console.error('加载食谱详情失败：', error);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 切换点赞
  async toggleLike() {
    const { isCustom, recipeId, isLiked } = this.data;

    if (isCustom) {
      // 自定义食谱使用本地存储
      const recipeDetail = { ...this.data.recipeDetail };
      const newIsLiked = !isLiked;

      if (newIsLiked) {
        recipeDetail.likes += 1;
      } else {
        recipeDetail.likes -= 1;
      }

      this.setData({
        isLiked: newIsLiked,
        recipeDetail: recipeDetail
      });

      wx.showToast({
        title: newIsLiked ? '已点赞' : '已取消点赞',
        icon: 'success',
        duration: 1000
      });
    } else {
      // 系统食谱调用后端接口
      try {
        if (isLiked) {
          await unlikeRecipe(recipeId);
          this.setData({
            isLiked: false,
            'recipeDetail.likes': this.data.recipeDetail.likes - 1
          });
          wx.showToast({
            title: '已取消点赞',
            icon: 'success',
            duration: 1000
          });
        } else {
          await likeRecipe(recipeId);
          this.setData({
            isLiked: true,
            'recipeDetail.likes': this.data.recipeDetail.likes + 1
          });
          wx.showToast({
            title: '已点赞',
            icon: 'success',
            duration: 1000
          });
        }
      } catch (error) {
        console.error('点赞操作失败：', error);
      }
    }
  },

  // 切换收藏
  async toggleCollect() {
    const { isCustom, recipeId, isCollected } = this.data;

    if (isCustom) {
      // 自定义食谱使用本地存储
      const recipeDetail = { ...this.data.recipeDetail };
      const newIsCollected = !isCollected;

      if (newIsCollected) {
        recipeDetail.collections += 1;
        let collectedRecipes = wx.getStorageSync('collectedRecipes') || [];
        if (!collectedRecipes.includes(recipeId)) {
          collectedRecipes.push(recipeId);
          wx.setStorageSync('collectedRecipes', collectedRecipes);

          const myContent = wx.getStorageSync('myContent') || { collections: 0, recipes: 0 };
          myContent.collections = collectedRecipes.length;
          wx.setStorageSync('myContent', myContent);
        }
      } else {
        recipeDetail.collections -= 1;
        let collectedRecipes = wx.getStorageSync('collectedRecipes') || [];
        collectedRecipes = collectedRecipes.filter(id => id !== recipeId);
        wx.setStorageSync('collectedRecipes', collectedRecipes);

        const myContent = wx.getStorageSync('myContent') || { collections: 0, recipes: 0 };
        myContent.collections = collectedRecipes.length;
        wx.setStorageSync('myContent', myContent);
      }

      this.setData({
        isCollected: newIsCollected,
        recipeDetail: recipeDetail
      });

      wx.showToast({
        title: newIsCollected ? '已收藏' : '已取消收藏',
        icon: 'success',
        duration: 1000
      });
    } else {
      // 系统食谱调用后端接口
      try {
        if (isCollected) {
          await uncollectRecipe(recipeId);
          this.setData({
            isCollected: false,
            'recipeDetail.collections': this.data.recipeDetail.collections - 1
          });
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 1000
          });
        } else {
          await collectRecipe(recipeId);
          this.setData({
            isCollected: true,
            'recipeDetail.collections': this.data.recipeDetail.collections + 1
          });
          wx.showToast({
            title: '已收藏',
            icon: 'success',
            duration: 1000
          });
        }
      } catch (error) {
        console.error('收藏操作失败：', error);
      }
    }
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
  stopPropagation() { },

  // 加入餐食
  addToMeal(e) {
    const mealType = e.currentTarget.dataset.type;
    const mealNames = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐'
    };

    this.hideMealOptions();

    const editingMeal = wx.getStorageSync('editingMeal');
    const addingMeal = wx.getStorageSync('addingMeal');

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
      wx.setStorageSync('replaceMeal', {
        mealType: editingMeal.mealType,
        index: editingMeal.index,
        newFood: foodData
      });

      wx.showToast({
        title: '替换成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    } else if (addingMeal && addingMeal.mealType) {
      wx.setStorageSync('addMeal', {
        mealType: addingMeal.mealType,
        newFood: foodData
      });

      wx.showToast({
        title: `已加入${mealNames[addingMeal.mealType]}`,
        icon: 'success'
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    } else {
      wx.setStorageSync('addMeal', {
        mealType: mealType,
        newFood: foodData
      });

      wx.showToast({
        title: `已加入${mealNames[mealType]}`,
        icon: 'success'
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 500);
    }
  }
})
