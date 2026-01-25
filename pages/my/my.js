// pages/my/my.js
Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    
    // 用户信息
    userInfo: {
      avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      name: '美食爱好者',
      id: '10086',
      height: 170,
      weight: 65,
      bmi: 22.5,
      bmiStatus: 'normal', // normal, low, high
      bmiText: '标准'
    },
    
    // 健康目标
    healthGoal: {
      target: '保持健康',
      targetWeight: 65,
      targetBMI: 21.5,
      dailyCalories: 1800
    },
    
    // 我的内容统计
    myContent: {
      collections: 28,
      recipes: 12
    }
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 计算导航栏高度，使其与胶囊对齐
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });
    
    // 加载用户数据
    this.loadUserData();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadUserData();
  },

  // 加载用户数据
  loadUserData() {
    // 这里可以从本地存储或服务器获取用户数据
    // 示例：从本地存储获取
    const userInfo = wx.getStorageSync('userInfo');
    const healthGoal = wx.getStorageSync('healthGoal');
    const myContent = wx.getStorageSync('myContent');
    
    if (userInfo) {
      this.setData({ userInfo });
    }
    
    if (healthGoal) {
      this.setData({ healthGoal });
    }
    
    if (myContent) {
      this.setData({ myContent });
    }
  },

  // 编辑健康目标
  editHealthGoal() {
    wx.showToast({
      title: '编辑健康目标',
      icon: 'none'
    });
    // 可以跳转到编辑页面或显示弹窗
    // wx.navigateTo({
    //   url: '/pages/edit-goal/edit-goal'
    // });
  },

  // 页面导航
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    
    // 特殊处理饮食日记页面
    if (page === '/pages/diet-diary/diet-diary') {
      wx.navigateTo({
        url: page
      });
      return;
    }
    
    // 检查页面是否存在
    const pages = [
      '/pages/health-profile/health-profile',
      '/pages/data-stats/data-stats',
      '/pages/my-collection/my-collection',
      '/pages/my-recipe/my-recipe',
      '/pages/settings/settings'
    ];
    
    if (pages.includes(page)) {
      wx.navigateTo({
        url: page,
        fail: () => {
          wx.showToast({
            title: '页面开发中',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '页面开发中',
        icon: 'none'
      });
    }
  }
})
