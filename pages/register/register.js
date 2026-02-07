// pages/register/register.js
Page({
  data: {
    statusBarHeight: 0,
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    codeSending: false,
    countdown: 0,
    codeButtonText: '获取验证码'
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
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

  // 验证码输入
  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },

  // 清除验证码
  clearCode() {
    this.setData({
      code: ''
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 切换密码显示
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 切换确认密码显示
  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  // 发送验证码
  sendCode() {
    if (this.data.codeSending || this.data.countdown > 0) {
      return;
    }

    const { email } = this.data;

    // 验证邮箱
    if (!email) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      });
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }

    // Mock发送验证码
    this.setData({
      codeSending: true
    });

    wx.showLoading({
      title: '发送中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      });

      // 开始倒计时
      this.setData({
        codeSending: false,
        countdown: 60
      });

      this.startCountdown();
    }, 1000);
  },

  // 倒计时
  startCountdown() {
    const timer = setInterval(() => {
      const countdown = this.data.countdown - 1;
      
      if (countdown <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          codeButtonText: '获取验证码'
        });
      } else {
        this.setData({
          countdown: countdown,
          codeButtonText: `${countdown}s后重试`
        });
      }
    }, 1000);
  },

  // 注册
  handleRegister() {
    const { email, code, password, confirmPassword } = this.data;

    // 验证邮箱
    if (!email) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      });
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      });
      return;
    }

    // 验证验证码
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
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

    if (password.length < 6 || password.length > 20) {
      wx.showToast({
        title: '密码长度为6-20位',
        icon: 'none'
      });
      return;
    }

    // 验证确认密码
    if (!confirmPassword) {
      wx.showToast({
        title: '请确认密码',
        icon: 'none'
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    // Mock注册
    wx.showLoading({
      title: '注册中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '注册成功',
        icon: 'success'
      });

      // 延迟返回登录页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateBack();
  }
})
