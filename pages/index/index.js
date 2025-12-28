// index.js
Page({
  data: {
    searchKeyword: '',
    statusBarHeight: 0,
    menuButtonInfo: {},
    headerPaddingTop: 0
  },

  onLoad() {
    // 获取状态栏高度和胶囊按钮信息
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 计算header的padding-top，让内容从胶囊按钮顶部开始
    const headerPaddingTop = menuButtonInfo.top;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      headerPaddingTop: headerPaddingTop
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
      console.log('搜索关键词:', keyword);
      // TODO: 实现搜索功能
      wx.showToast({
        title: `搜索: ${keyword}`,
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  }
})
