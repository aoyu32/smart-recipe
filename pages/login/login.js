// pages/login/login.js
import api from '../../api/index'

Page({
  data: {
    email: '',
    password: '',
    showPassword: false
  },

  onLoad(options) {
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
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
  async handleLogin() {
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

    try {
      // 调用后端登录接口
      const result = await api.auth.login({
        email,
        password
      });

      // 登录成功，保存token和用户信息
      wx.setStorageSync('token', result.token);
      wx.setStorageSync('userInfo', result);
      wx.setStorageSync('isLoggedIn', true);

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 延迟跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    } catch (error) {
      // 错误已在request拦截器中处理
      console.error('登录失败：', error);
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
