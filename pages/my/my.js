// pages/my/my.js
import api from '../../api/index'
import { getCurrentHealthGoal } from '../../api/user'

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,

    // 用户信息
    userInfo: {
      avatar: '',
      name: '',
      id: '',
      height: 0,
      weight: 0,
      bmi: 0,
      bmiStatus: 'normal',
      bmiText: '标准',
      birthday: '',
      gender: '未知'
    },

    // 健康目标
    healthGoal: {
      hasGoal: false,
      target: '未设置',
      fields: []
    },

    // 我的内容统计
    myContent: {
      collections: 0,
      recipes: 0
    },

    // 编辑弹窗
    showEditModal: false,
    tempAvatar: '',
    tempName: '',
    tempHeight: '',
    tempWeight: '',
    tempBirthday: '',
    tempGender: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

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
  async loadUserData() {
    try {
      // 并行获取用户信息和健康目标
      const [profile, currentGoal] = await Promise.all([
        api.user.getUserProfile(),
        getCurrentHealthGoal()
      ]);

      // 处理用户信息
      const userInfo = {
        avatar: profile.avatar || 'https://smart-recipe.oss-cn-beijing.aliyuncs.com/default-avatar.png',
        name: profile.nickname || '用户',
        id: profile.id ? profile.id.toString() : '',
        height: profile.height ? parseFloat(profile.height) : 0,
        weight: profile.weight ? parseFloat(profile.weight) : 0,
        bmi: profile.bmi ? parseFloat(profile.bmi) : 0,
        bmiStatus: this.getBmiStatus(profile.bmiStatus),
        bmiText: this.getBmiText(profile.bmiStatus),
        birthday: profile.birthday || '',
        gender: this.getGenderText(profile.gender)
      };

      // 处理健康目标
      const healthGoal = this.formatHealthGoal(currentGoal);

      this.setData({
        userInfo,
        healthGoal
      });

      // 保存到本地存储
      wx.setStorageSync('userProfile', userInfo);
      wx.setStorageSync('healthGoal', healthGoal);

    } catch (error) {
      console.error('获取用户信息失败：', error);

      // 如果获取失败，尝试从本地存储读取
      const cachedProfile = wx.getStorageSync('userProfile');
      const cachedGoal = wx.getStorageSync('healthGoal');

      if (cachedProfile) {
        this.setData({ userInfo: cachedProfile });
      }
      if (cachedGoal) {
        this.setData({ healthGoal: cachedGoal });
      }
    }

    // 加载其他数据（从本地存储）
    const myContent = wx.getStorageSync('myContent');
    if (myContent) {
      this.setData({ myContent });
    }
  },

  // 格式化健康目标数据
  formatHealthGoal(goal) {
    if (!goal) {
      return {
        hasGoal: false,
        target: '未设置',
        fields: []
      };
    }

    const goalType = goal.goalType;
    let fields = [];

    // 根据目标类型显示对应的三个字段
    if (goalType === 'lose_weight' || goalType === 'gain_weight' || goalType === 'maintain') {
      // 减重/增重/保持健康：目标体重、目标BMI、每日热量
      fields = [
        { label: '目标体重', value: goal.targetWeight ? goal.targetWeight + 'kg' : '--' },
        { label: '目标BMI', value: goal.targetBMI || '--' },
        { label: '每日热量', value: goal.dailyCalories ? goal.dailyCalories + 'kcal' : '--' }
      ];
    } else if (goalType === 'gain_muscle') {
      // 增肌：目标体重、目标肌肉量、每日蛋白质
      fields = [
        { label: '目标体重', value: goal.targetWeight ? goal.targetWeight + 'kg' : '--' },
        { label: '目标肌肉量', value: goal.targetMuscle ? goal.targetMuscle + 'kg' : '--' },
        { label: '每日蛋白质', value: goal.dailyProtein ? goal.dailyProtein + 'g' : '--' }
      ];
    } else if (goalType === 'control_sugar') {
      // 控糖：目标血糖、每日碳水、每日热量
      fields = [
        { label: '目标血糖', value: goal.targetBloodSugar ? goal.targetBloodSugar + 'mmol/L' : '--' },
        { label: '每日碳水', value: goal.dailyCarbs ? goal.dailyCarbs + 'g' : '--' },
        { label: '每日热量', value: goal.dailyCalories ? goal.dailyCalories + 'kcal' : '--' }
      ];
    } else if (goalType === 'lower_pressure') {
      // 降压：目标血压、每日钠摄入、每日热量
      fields = [
        { label: '目标血压', value: goal.targetBloodPressure || '--' },
        { label: '每日钠摄入', value: goal.dailySodium ? goal.dailySodium + 'mg' : '--' },
        { label: '每日热量', value: goal.dailyCalories ? goal.dailyCalories + 'kcal' : '--' }
      ];
    }

    return {
      hasGoal: true,
      target: goal.target || '未知目标',
      goalType: goalType,
      fields: fields
    };
  },

  // 获取BMI状态
  getBmiStatus(status) {
    const statusMap = {
      'underweight': 'low',
      'normal': 'normal',
      'overweight': 'high',
      'obese': 'high'
    };
    return statusMap[status] || 'normal';
  },

  // 获取BMI文本
  getBmiText(status) {
    const textMap = {
      'underweight': '偏瘦',
      'normal': '标准',
      'overweight': '偏胖',
      'obese': '肥胖'
    };
    return textMap[status] || '标准';
  },

  // 获取性别文本
  getGenderText(gender) {
    const genderMap = {
      0: '未知',
      1: '男',
      2: '女'
    };
    return genderMap[gender] || '未知';
  },

  // 跳转到健康档案页面
  navigateToHealthProfile() {
    wx.navigateTo({
      url: '/pages/health-profile/health-profile'
    });
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
      tempHeight: userInfo.height > 0 ? userInfo.height.toString() : '',
      tempWeight: userInfo.weight > 0 ? userInfo.weight.toString() : '',
      tempBirthday: userInfo.birthday || '',
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
  stopPropagation() { },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0];

        console.log('选择的图片路径：', tempFilePath);

        // 显示上传中
        wx.showLoading({
          title: '上传中...',
          mask: true
        });

        try {
          // 上传头像到服务器
          const avatarUrl = await api.user.uploadAvatar(tempFilePath);

          console.log('上传成功，返回的URL：', avatarUrl);

          wx.hideLoading();

          // 更新临时头像
          this.setData({
            tempAvatar: avatarUrl
          }, () => {
            console.log('setData完成，当前tempAvatar：', this.data.tempAvatar);
          });

          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1500
          });
        } catch (error) {
          wx.hideLoading();
          console.error('上传头像失败：', error);
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('选择图片失败：', error);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
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
  async confirmEdit() {
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
    if (tempHeight && (isNaN(height) || height < 100 || height > 250)) {
      wx.showToast({
        title: '请输入有效身高(100-250cm)',
        icon: 'none'
      });
      return;
    }

    // 验证体重
    const weight = parseFloat(tempWeight);
    if (tempWeight && (isNaN(weight) || weight < 30 || weight > 200)) {
      wx.showToast({
        title: '请输入有效体重(30-200kg)',
        icon: 'none'
      });
      return;
    }

    try {
      // 构建更新数据
      const updateData = {
        nickname: tempName.trim(),
        avatar: tempAvatar,
        gender: tempGender === 1 ? 2 : 1, // 前端：0-男，1-女；后端：1-男，2-女
        birthday: tempBirthday || null
      };

      // 如果有身高体重，添加到更新数据
      if (tempHeight) {
        updateData.height = height;
      }
      if (tempWeight) {
        updateData.weight = weight;
      }

      // 调用后端更新接口
      await api.user.updateUserProfile(updateData);

      wx.showToast({
        title: '修改成功',
        icon: 'success'
      });

      this.closeEditModal();

      // 重新加载用户数据
      setTimeout(() => {
        this.loadUserData();
      }, 1500);

    } catch (error) {
      console.error('更新用户信息失败：', error);
    }
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
      '/pages/account-security/account-security',
      '/pages/my-collection/my-collection',
      '/pages/my-recipe/my-recipe',
      '/pages/diet-preference/diet-preference',
      '/pages/data-stats/data-stats'
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
