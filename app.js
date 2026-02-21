// app.js
App({
  onLaunch() {
    // 检查登录状态
    const isLoggedIn = wx.getStorageSync('isLoggedIn');

    if (!isLoggedIn) {
      // 未登录，跳转到登录页
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }

    // 初始化收藏数据（如果不存在）
    const collectedRecipes = wx.getStorageSync('collectedRecipes');
    if (!collectedRecipes) {
      // 初始化一些示例收藏数据
      wx.setStorageSync('collectedRecipes', ['1', '2', '3']);
    }

    // 初始化我的内容统计
    const myContent = wx.getStorageSync('myContent');
    if (!myContent) {
      const collectedIds = wx.getStorageSync('collectedRecipes') || [];
      wx.setStorageSync('myContent', {
        collections: collectedIds.length,
        recipes: 12
      });
    }
  }
})
