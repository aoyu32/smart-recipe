// pages/login/login.js
Page({
  data: {
    email: 'user@qq.com',
    password: '123456',
    showPassword: false
  },

  onLoad(options) {
    // 检查是否已登录
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    if (isLoggedIn) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 邮箱输入
  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    });
  },

  // 清除邮箱
  clearEmail() {
    this.setData({
      email: ''
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 切换密码显示
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 登录
  handleLogin() {
    const { email, password } = this.data;

    // 验证邮箱
    if (!email) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      });
      return;
    }

    // 简单的邮箱格式验证
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }

    // 验证密码
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    // Mock登录验证 - 使用 user@qq.com 和 123456
    if (email === 'user@qq.com' && password === '123456') {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 保存登录状态
      wx.setStorageSync('isLoggedIn', true);
      wx.setStorageSync('userEmail', email);

      // 延迟跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    } else {
      wx.showToast({
        title: '邮箱或密码错误',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  // 跳转到重置密码页面
  goToResetPassword() {
    wx.navigateTo({
      url: '/pages/reset-password/reset-password'
    });
  }
})
