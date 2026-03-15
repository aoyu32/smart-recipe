// index.js
import { getRecipeRankings, generateDailyRecipe, getTodayRecipe, getRecipeDetailById, getTodayCheckin, deleteRecipeItem } from '../../api/recipe';
const { banners, todayRecipe } = require('../../mock/index.js');

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

    // 食谱加载状态
    isLoadingRecipe: false,

    // 生成弹窗状态
    showGenerateModal: false,
    generateInput: '', // 用户输入的生成想法

    // 长按编辑状态
    editingMealType: '', // 当前正在编辑的餐次类型
    editingItemIndex: -1, // 当前正在编辑的食物索引

    // 轮播图数据
    banners: [],

    // 今日食谱数据
    todayRecipe: null,

    // 打卡状态
    checkinMeals: [
      {
        type: 'breakfast',
        label: '早餐',
        checked: false,
        icon: '/assets/index/icon-zaocan.png',
        foods: [],
        calories: 0
      },
      {
        type: 'lunch',
        label: '午餐',
        checked: false,
        icon: '/assets/index/icon-wucan.png',
        foods: [],
        calories: 0
      },
      {
        type: 'dinner',
        label: '晚餐',
        checked: false,
        icon: '/assets/index/icon-wancan.png',
        foods: [],
        calories: 0
      }
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

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      headerPaddingTop: headerPaddingTop,
      banners: banners
    });

    // 加载排行榜数据
    this.loadRankings();

    // 加载今日打卡记录
    this.loadTodayCheckin();

    // 不再自动加载今日食谱，等待用户点击展开按钮
  },

  // 加载今日食谱
  async loadTodayRecipe() {
    this.setData({ isLoadingRecipe: true });

    try {
      const result = await getTodayRecipe();

      // 检查返回数据是否有效
      if (!result || !result.meals) {
        throw new Error('返回数据格式不正确');
      }

      const transformedRecipe = this.transformRecipeData(result);
      const { date, weekday } = this.getCurrentDate();

      this.setData({
        todayRecipe: {
          ...transformedRecipe,
          date,
          weekday,
          title: '今日食谱推荐'
        }
      });
    } catch (error) {
      console.error('加载今日食谱失败:', error);
      wx.showToast({
        title: error.message || '加载食谱失败，请重试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ isLoadingRecipe: false });
    }
  },

  // 加载排行榜数据
  async loadRankings() {
    try {
      const rankings = await getRecipeRankings();
      this.setData({ rankings });
    } catch (error) {
      console.error('加载排行榜失败:', error);
      // 失败时使用空数组
      this.setData({ rankings: [] });
    }
  },

  // 加载今日打卡记录
  async loadTodayCheckin() {
    try {
      const result = await getTodayCheckin();

      console.log('今日打卡记录：', result);

      // 转换数据格式
      const checkinMeals = result.meals.map(meal => {
        const foods = meal.foods.map(food => ({
          id: food.id,
          name: food.food_name,
          image: food.food_image,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          amount: food.amount
        }));

        return {
          type: meal.meal_type,
          label: meal.label,
          checked: meal.checked,
          icon: this.getMealIcon(meal.meal_type),
          foods: foods,
          calories: meal.calories
        };
      });

      this.setData({ checkinMeals });
    } catch (error) {
      console.error('加载今日打卡记录失败:', error);
      // 失败时保持默认数据
    }
  },

  // 获取餐次图标
  getMealIcon(mealType) {
    const iconMap = {
      'breakfast': '/assets/index/icon-zaocan.png',
      'lunch': '/assets/index/icon-wucan.png',
      'dinner': '/assets/index/icon-wancan.png'
    };
    return iconMap[mealType] || '';
  },

  onShow() {
    // 检查是否需要刷新打卡记录
    const app = getApp();
    if (app.globalData.needRefreshCheckin) {
      this.loadTodayCheckin();
      app.globalData.needRefreshCheckin = false;
    }

    // 检查是否需要刷新今日食谱推荐
    if (app.globalData.needRefreshDailyRecipe) {
      this.loadTodayRecipe();
      app.globalData.needRefreshDailyRecipe = false;
    }

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
        url: `/pages/search/search?keyword=${encodeURIComponent(keyword.trim())}`
      });
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  },

  // 点击生成按钮，打开输入弹窗
  onAIGenerate(e) {
    // 阻止事件冒泡，避免触发展开/收起
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    // 先取消编辑状态
    this.cancelEdit();

    // 打开生成弹窗
    this.setData({
      showGenerateModal: true,
      generateInput: ''
    });
  },

  // 关闭生成弹窗
  closeGenerateModal() {
    this.setData({
      showGenerateModal: false,
      generateInput: ''
    });
  },

  // 阻止事件冒泡（空方法）
  stopPropagation() {
    // 什么都不做，只是阻止事件冒泡
  },

  // 输入框内容变化
  onGenerateInputChange(e) {
    this.setData({
      generateInput: e.detail.value
    });
  },

  // 正常生成（使用默认提示）
  async onNormalGenerate() {
    this.closeGenerateModal();
    await this.performGenerate('给我推荐今日食谱');
  },

  // 今日想法生成（使用用户输入）
  async onCustomGenerate() {
    const input = this.data.generateInput.trim();
    if (!input) {
      wx.showToast({
        title: '请输入您的想法',
        icon: 'none'
      });
      return;
    }
    this.closeGenerateModal();
    await this.performGenerate(input);
  },

  // 执行生成
  async performGenerate(input) {
    // 如果正在生成，不重复触发
    if (this.data.isGenerating) {
      return;
    }

    this.setData({
      isGenerating: true
    });

    try {
      // 调用后端AI接口生成食谱
      const result = await generateDailyRecipe(input);

      // 检查返回数据是否有效
      if (!result || !result.meals) {
        throw new Error('AI生成失败，请稍后重试');
      }

      // 转换后端数据格式为前端格式
      const transformedRecipe = this.transformRecipeData(result);

      // 获取当前日期和星期几
      const { date, weekday } = this.getCurrentDate();

      // 更新今日食谱数据
      this.setData({
        todayRecipe: {
          ...transformedRecipe,
          date: date,
          weekday: weekday,
          title: '今日食谱推荐'
        },
        isGenerating: false
      });

      wx.showToast({
        title: '生成成功！',
        icon: 'success'
      });
    } catch (error) {
      console.error('生成失败：', error);
      this.setData({
        isGenerating: false
      });
      wx.showToast({
        title: error.message || '生成失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 转换后端数据格式为前端格式
  transformRecipeData(backendData) {
    // 使用 snake_case 字段名（与后端返回的一致）
    const {
      description,
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      meals
    } = backendData;

    // 转换三餐数据（后端已经包含所有详情，无需再次查询）
    const transformMeal = (mealData, mealType) => {
      const foods = [];

      // 检查是否有recipes数组
      if (mealData.recipes && Array.isArray(mealData.recipes)) {
        // 遍历每个食谱项（后端已经包含完整信息）
        for (const recipeItem of mealData.recipes) {
          const foodItem = {
            itemId: recipeItem.item_id,
            id: recipeItem.recipe_id,
            name: recipeItem.recipe_name,
            image: recipeItem.image,
            amount: recipeItem.amount,
            calories: recipeItem.calories,
            protein: recipeItem.protein,
            carbs: recipeItem.carbs,
            fat: recipeItem.fat,
            category: recipeItem.category
          };

          foods.push(foodItem);
        }
      }

      return {
        time: mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : '晚餐',
        timeRange: mealData.time_range || '',
        calories: mealData.meal_calories || 0,
        protein: mealData.meal_protein || 0,
        carbs: mealData.meal_carbs || 0,
        fat: mealData.meal_fat || 0,
        foods: foods
      };
    };

    // 转换三餐数据
    const breakfast = transformMeal(meals.breakfast, 'breakfast');
    const lunch = transformMeal(meals.lunch, 'lunch');
    const dinner = transformMeal(meals.dinner, 'dinner');

    return {
      description: description,
      totalCalories: total_calories,
      totalProtein: total_protein,
      totalCarbs: total_carbs,
      totalFat: total_fat,
      meals: {
        breakfast,
        lunch,
        dinner
      }
    };
  },

  // 切换食谱卡片展开/收起
  async toggleRecipeCard() {
    // 先取消编辑状态
    this.cancelEdit();

    const willExpand = !this.data.recipeCardExpanded;

    this.setData({
      recipeCardExpanded: willExpand
    });

    // 如果是展开操作且还没有加载过食谱数据，则加载
    if (willExpand && !this.data.todayRecipe) {
      await this.loadTodayRecipe();
    }
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
  async deleteFoodItem(e) {
    const { mealType, index } = e.currentTarget.dataset;
    const todayRecipe = this.data.todayRecipe;
    const foodItem = todayRecipe.meals[mealType].foods[index];

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食物吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用后端API删除
            if (foodItem.itemId) {
              wx.showLoading({
                title: '删除中...',
                mask: true
              });

              await deleteRecipeItem(foodItem.itemId);

              wx.hideLoading();

              // 重新加载今日食谱
              await this.loadTodayRecipe();

              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            } else {
              // 如果没有itemId，说明是本地数据，直接删除
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
                todayRecipe: todayRecipe
              });

              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }

            // 取消编辑状态
            this.cancelEdit();
          } catch (error) {
            wx.hideLoading();
            console.error('删除失败：', error);
            wx.showToast({
              title: error.message || '删除失败',
              icon: 'none',
              duration: 2000
            });
          }
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
  // 饮食打卡 - 跳转到拍一拍页面
  onCheckin(e) {
    // 先取消编辑状态
    this.cancelEdit();

    const type = e.currentTarget.dataset.type;

    // 跳转到拍一拍页面
    wx.switchTab({
      url: '/pages/take-picture/take-picture'
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
  stopPropagation() { }
})
