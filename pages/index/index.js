// index.js
const { banners, todayRecipe, rankings } = require('../../mock/index.js');

Page({
  data: {
    searchKeyword: '',
    statusBarHeight: 0,
    menuButtonInfo: {},
    headerPaddingTop: 0,
    
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
  onAIGenerate() {
    wx.showLoading({ title: '智能生成中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '生成成功！',
        icon: 'success'
      });
    }, 1500);
  },

  // 查看更多食谱
  onViewMoreRecipes() {
    wx.navigateTo({
      url: '/pages/recipe/recipe'
    });
  },

  // 点击餐次
  onMealTap(e) {
    const type = e.currentTarget.dataset.type;
    console.log('查看餐次:', type);
    wx.showToast({
      title: '查看食谱详情',
      icon: 'none'
    });
  },

  // 快捷入口导航
  onNavigate(e) {
    const page = e.currentTarget.dataset.page;
    console.log('导航到:', page);
    wx.showToast({
      title: `进入${page === 'diary' ? '饮食日记' : '健康档案'}`,
      icon: 'none'
    });
  },

  // 饮食打卡
  onCheckin(e) {
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
    wx.showToast({
      title: '查看完整排行榜',
      icon: 'none'
    });
  },

  // 点击食谱
  // 跳转到食谱详情页
  navigateToRecipeDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    });
  },

  // 点击食谱（保留兼容）
  onRecipeTap(e) {
    this.navigateToRecipeDetail(e);
  }
})
