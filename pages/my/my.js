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
      bmiText: '标准',
      birthday: '1995-01-01',
      gender: '男'
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
    },
    
    // 编辑弹窗
    showEditModal: false,
    tempAvatar: '',
    tempName: '',
    tempHeight: '',
    tempWeight: '',
    tempBirthday: '',
    tempGender: 0 // 0:男, 1:女
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

  // 编辑个人信息
  editProfile() {
    const userInfo = this.data.userInfo;
    const genderIndex = userInfo.gender === '女' ? 1 : 0;
    
    this.setData({
      showEditModal: true,
      tempAvatar: userInfo.avatar,
      tempName: userInfo.name,
      tempHeight: userInfo.height.toString(),
      tempWeight: userInfo.weight.toString(),
      tempBirthday: userInfo.birthday,
      tempGender: genderIndex
    });
  },

  // 关闭编辑弹窗
  closeEditModal() {
    this.setData({
      showEditModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          tempAvatar: tempFilePath
        });
      }
    });
  },

  // 昵称输入
  onNameInput(e) {
    this.setData({
      tempName: e.detail.value
    });
  },

  // 身高输入
  onHeightInput(e) {
    this.setData({
      tempHeight: e.detail.value
    });
  },

  // 体重输入
  onWeightInput(e) {
    this.setData({
      tempWeight: e.detail.value
    });
  },

  // 生日选择
  onBirthdayChange(e) {
    this.setData({
      tempBirthday: e.detail.value
    });
  },

  // 性别选择
  onGenderChange(e) {
    this.setData({
      tempGender: parseInt(e.detail.value)
    });
  },

  // 确认编辑
  confirmEdit() {
    const { tempName, tempHeight, tempWeight, tempAvatar, tempBirthday, tempGender } = this.data;
    
    // 验证昵称
    if (!tempName || tempName.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }
    
    // 验证身高
    const height = parseFloat(tempHeight);
    if (isNaN(height) || height < 100 || height > 250) {
      wx.showToast({
        title: '请输入有效身高(100-250cm)',
        icon: 'none'
      });
      return;
    }
    
    // 验证体重
    const weight = parseFloat(tempWeight);
    if (isNaN(weight) || weight < 30 || weight > 200) {
      wx.showToast({
        title: '请输入有效体重(30-200kg)',
        icon: 'none'
      });
      return;
    }
    
    // 更新用户信息
    const userInfo = this.data.userInfo;
    userInfo.avatar = tempAvatar;
    userInfo.name = tempName.trim();
    userInfo.height = height;
    userInfo.weight = weight;
    userInfo.birthday = tempBirthday;
    userInfo.gender = tempGender === 1 ? '女' : '男';
    
    // 重新计算BMI
    this.calculateBMI(userInfo);
    
    this.setData({ userInfo });
    wx.setStorageSync('userInfo', userInfo);
    
    this.closeEditModal();
    
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },

  // 计算BMI
  calculateBMI(userInfo) {
    const height = userInfo.height / 100; // 转换为米
    const weight = userInfo.weight;
    const bmi = (weight / (height * height)).toFixed(1);
    
    userInfo.bmi = parseFloat(bmi);
    
    // 判断BMI状态
    if (bmi < 18.5) {
      userInfo.bmiStatus = 'low';
      userInfo.bmiText = '偏瘦';
    } else if (bmi >= 18.5 && bmi < 24) {
      userInfo.bmiStatus = 'normal';
      userInfo.bmiText = '标准';
    } else {
      userInfo.bmiStatus = 'high';
      userInfo.bmiText = '偏胖';
    }
  },

  // 页面导航
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    
    // 特殊处理已开发的页面
    const developedPages = [
      '/pages/diet-diary/diet-diary',
      '/pages/health-profile/health-profile',
      '/pages/account-security/account-security'
    ];
    
    if (developedPages.includes(page)) {
      wx.navigateTo({
        url: page
      });
      return;
    }
    
    // 其他页面显示开发中
    wx.showToast({
      title: '页面开发中',
      icon: 'none'
    });
  }
})
