// pages/account-security/account-security.js
Page({
  data: {
    nickname: '美食爱好者',
    email: 'user@qq.com',
    showNicknameModal: false,
    showEmailModal: false,
    showPasswordModal: false,
    newNickname: '',
    newEmail: '',
    code: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    codeSending: false,
    countdown: 0,
    codeButtonText: '获取验证码'
  },

  onLoad(options) {
    // 从本地存储获取用户信息
    const userEmail = wx.getStorageSync('userEmail') || 'user@qq.com';
    const userNickname = wx.getStorageSync('userNickname') || '美食爱好者';
    
    this.setData({
      email: userEmail,
      nickname: userNickname
    });
  },

  // 修改昵称
  editNickname() {
    this.setData({
      showNicknameModal: true,
      newNickname: this.data.nickname
    });
  },

  onNicknameInput(e) {
    this.setData({
      newNickname: e.detail.value
    });
  },

  closeNicknameModal() {
    this.setData({
      showNicknameModal: false,
      newNickname: ''
    });
  },

  confirmNickname() {
    const { newNickname } = this.data;

    if (!newNickname || !newNickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 保存昵称
    wx.setStorageSync('userNickname', newNickname);
    
    this.setData({
      nickname: newNickname,
      showNicknameModal: false
    });

    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },

  // 换绑邮箱
  changeEmail() {
    this.setData({
      showEmailModal: true,
      newEmail: '',
      code: ''
    });
  },

  onEmailInput(e) {
    this.setData({
      newEmail: e.detail.value
    });
  },

  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },

  closeEmailModal() {
    this.setData({
      showEmailModal: false,
      newEmail: '',
      code: '',
      countdown: 0,
      codeButtonText: '获取验证码'
    });
  },

  sendCode() {
    if (this.data.codeSending || this.data.countdown > 0) {
      return;
    }

    const { newEmail } = this.data;

    if (!newEmail) {
      wx.showToast({
        title: '请输入新邮箱',
        icon: 'none'
      });
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(newEmail)) {
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

  confirmEmail() {
    const { newEmail, code } = this.data;

    if (!newEmail) {
      wx.showToast({
        title: '请输入新邮箱',
        icon: 'none'
      });
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(newEmail)) {
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

    // Mock换绑
    wx.showLoading({
      title: '换绑中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      
      // 保存新邮箱
      wx.setStorageSync('userEmail', newEmail);
      
      this.setData({
        email: newEmail,
        showEmailModal: false
      });

      wx.showToast({
        title: '换绑成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 修改密码
  changePassword() {
    this.setData({
      showPasswordModal: true,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    });
  },

  onOldPasswordInput(e) {
    this.setData({
      oldPassword: e.detail.value
    });
  },

  onNewPasswordInput(e) {
    this.setData({
      newPassword: e.detail.value
    });
  },

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  toggleOldPassword() {
    this.setData({
      showOldPassword: !this.data.showOldPassword
    });
  },

  toggleNewPassword() {
    this.setData({
      showNewPassword: !this.data.showNewPassword
    });
  },

  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  closePasswordModal() {
    this.setData({
      showPasswordModal: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  },

  confirmPassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data;

    if (!oldPassword) {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      });
      return;
    }

    // Mock验证原密码（实际应该调用后端验证）
    if (oldPassword !== '123456') {
      wx.showToast({
        title: '原密码错误',
        icon: 'none'
      });
      return;
    }

    if (!newPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 20) {
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

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    if (oldPassword === newPassword) {
      wx.showToast({
        title: '新密码不能与原密码相同',
        icon: 'none'
      });
      return;
    }

    // Mock修改密码
    wx.showLoading({
      title: '修改中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      
      this.setData({
        showPasswordModal: false
      });

      wx.showToast({
        title: '密码修改成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#B6CF99',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          wx.removeStorageSync('isLoggedIn');
          wx.removeStorageSync('userEmail');
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });

          // 跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }, 1500);
        }
      }
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  }
})
