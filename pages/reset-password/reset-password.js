// pages/reset-password/reset-password.js
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

  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    });
  },

  clearEmail() {
    this.setData({
      email: ''
    });
  },

  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },

  clearCode() {
    this.setData({
      code: ''
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  sendCode() {
    if (this.data.codeSending || this.data.countdown > 0) {
      return;
    }

    const { email } = this.data;

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

      this.setData({
        codeSending: false,
        countdown: 60
      });

      this.startCountdown();
    }, 1000);
  },

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

  handleReset() {
    const { email, code, password, confirmPassword } = this.data;

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

    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入新密码',
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

    if (!confirmPassword) {
      wx.showToast({
        title: '请确认新密码',
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

    wx.showLoading({
      title: '重置中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '密码重置成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  goBack() {
    wx.navigateBack();
  },

  goToLogin() {
    wx.navigateBack();
  }
})
