// pages/search/search.js
const mockRecipeDetail = require('../../mock/recipe-detail.js');

Page({
  data: {
    keyword: '',
    searchResults: [],
    hasSearched: false,
    searchHistory: [],
    hotKeywords: ['减脂餐', '高蛋白', '低卡', '健康早餐', '快手菜', '营养午餐', '轻食', '增肌'],
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

    // 获取传入的搜索关键词，并解码
    if (options.keyword) {
      const decodedKeyword = decodeURIComponent(options.keyword);
      this.setData({
        keyword: decodedKeyword
      });
      // 自动执行搜索
      this.performSearch(decodedKeyword);
    }

    // 加载搜索历史
    this.loadSearchHistory();
  },

  // 加载搜索历史
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync('searchHistory') || [];
      this.setData({
        searchHistory: history
      });
    } catch (e) {
      console.error('加载搜索历史失败', e);
    }
  },

  // 保存搜索历史
  saveSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') return;
    
    try {
      let history = wx.getStorageSync('searchHistory') || [];
      
      // 移除重复项
      history = history.filter(item => item !== keyword);
      
      // 添加到开头
      history.unshift(keyword);
      
      // 最多保存10条
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      
      wx.setStorageSync('searchHistory', history);
      
      this.setData({
        searchHistory: history
      });
    } catch (e) {
      console.error('保存搜索历史失败', e);
    }
  },

  // 清空搜索历史
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('searchHistory');
            this.setData({
              searchHistory: []
            });
            wx.showToast({
              title: '已清空',
              icon: 'success'
            });
          } catch (e) {
            console.error('清空搜索历史失败', e);
          }
        }
      }
    });
  },

  // 输入变化
  onKeywordInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 执行搜索
  onSearch() {
    const keyword = this.data.keyword.trim();
    
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }

    this.performSearch(keyword);
    this.saveSearchHistory(keyword);
  },

  // 执行搜索逻辑
  performSearch(keyword) {
    wx.showLoading({
      title: '搜索中...'
    });

    // 模拟搜索延迟
    setTimeout(() => {
      // 使用mock数据进行搜索
      const allRecipes = mockRecipeDetail.getAllRecipes();
      const results = allRecipes.filter(recipe => {
        const searchText = keyword.toLowerCase();
        return recipe.name.toLowerCase().includes(searchText) ||
               recipe.category.toLowerCase().includes(searchText) ||
               recipe.description.toLowerCase().includes(searchText) ||
               recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchText));
      });

      this.setData({
        searchResults: results,
        hasSearched: true
      });

      wx.hideLoading();
    }, 300);
  },

  // 点击搜索历史
  onHistoryClick(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword: keyword
    });
    this.performSearch(keyword);
  },

  // 点击热门搜索
  onHotClick(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword: keyword
    });
    this.performSearch(keyword);
    this.saveSearchHistory(keyword);
  },

  // 跳转到详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})
