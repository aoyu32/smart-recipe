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
  }
})
