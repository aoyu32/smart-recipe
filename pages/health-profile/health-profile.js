// pages/health-profile/health-profile.js
import { getHealthProfile, updateHealthProfile } from '../../api/user';

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    currentGoal: null,
    healthInfo: null,
    goalHistory: [],
    restrictions: [],
    goalTemplates: [],
    isHistoryEditing: false,

    // 弹窗状态
    showGoalModal: false,
    showHealthModal: false,
    showRestrictionModal: false,
    showCompleteModal: false,

    // 表单数据
    goalForm: {},
    healthForm: {},
    restrictionForm: {},
    completeForm: {},

    // 选择器数据
    goalTypes: ['减重', '增重', '保持健康', '增肌', '控糖', '降压'],
    genders: ['男', '女'],
    activityLevels: ['久坐', '轻度运动', '中度运动', '重度运动'],
    restrictionTypes: ['过敏', '疾病'],
    severityLevels: ['轻微', '中等', '严重'],

    isEditingGoal: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });

    this.loadProfileData();
  },

  onShow() {
    this.loadProfileData();
  },

  // 加载健康档案数据
  async loadProfileData() {
    try {
      wx.showLoading({ title: '加载中...' });

      const profile = await getHealthProfile();

      console.log('后端返回的健康档案数据:', profile);

      // 性别映射
      const genderMap = { 0: '未知', 1: '男', 2: '女' };
      // 活动水平映射
      const activityMap = {
        'sedentary': '久坐',
        'light': '轻度运动',
        'moderate': '中度运动',
        'heavy': '重度运动'
      };

      // 构建healthInfo对象，将null转换为空字符串或默认值
      const healthInfo = {
        height: profile.height || '',
        weight: profile.weight || '',
        age: profile.age || '',
        gender: genderMap[profile.gender] || '未知',
        bmi: profile.bmi || 0,
        bmiStatus: profile.bmiStatus || 'normal',
        activityLevel: profile.activityLevel ? activityMap[profile.activityLevel] : '',
        bloodPressure: profile.bloodPressure || '',
        bloodSugar: profile.bloodSugar || ''
      };

      this.setData({
        healthInfo: healthInfo,
        isHistoryEditing: false
      });

      wx.hideLoading();
    } catch (error) {
      console.error('加载健康档案失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 阻止冒泡
  stopPropagation() { },

  // ========== 健康目标相关 ==========

  // 添加目标
  addGoal() {
    this.setData({
      showGoalModal: true,
      isEditingGoal: false,
      goalForm: {
        typeIndex: 0,
        targetWeight: '',
        targetBMI: '',
        dailyCalories: '',
        endDate: ''
      }
    });
  },

  // 编辑目标
  editGoal() {
    const goal = this.data.currentGoal;
    const typeIndex = this.data.goalTypes.indexOf(goal.target);

    this.setData({
      showGoalModal: true,
      isEditingGoal: true,
      goalForm: {
        typeIndex: typeIndex >= 0 ? typeIndex : 0,
        targetWeight: goal.targetWeight || '',
        targetBMI: goal.targetBMI || '',
        targetMuscle: goal.targetMuscle || '',
        dailyProtein: goal.dailyProtein || '',
        targetBloodSugar: goal.targetBloodSugar || '',
        dailyCarbs: goal.dailyCarbs || '',
        targetBloodPressure: goal.targetBloodPressure || '',
        dailySodium: goal.dailySodium || '',
        dailyCalories: goal.dailyCalories || '',
        endDate: goal.endDate || ''
      }
    });
  },

  // 取消目标
  cancelGoal() {
    wx.showModal({
      title: '提示',
      content: '确定要取消当前目标吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentGoal: null
          });
          wx.showToast({
            title: '已取消目标',
            icon: 'success'
          });
        }
      }
    });
  },

  // 完成目标
  completeGoal() {
    this.setData({
      showCompleteModal: true,
      completeForm: {
        result: ''
      }
    });
  },

  // 隐藏目标弹窗
  hideGoalModal() {
    this.setData({
      showGoalModal: false
    });
  },

  // 隐藏完成弹窗
  hideCompleteModal() {
    this.setData({
      showCompleteModal: false
    });
  },

  // 目标类型变化
  onGoalTypeChange(e) {
    this.setData({
      'goalForm.typeIndex': parseInt(e.detail.value)
    });
  },

  // 目标表单输入
  onGoalWeightInput(e) {
    this.setData({
      'goalForm.targetWeight': e.detail.value
    });
  },

  onGoalBMIInput(e) {
    this.setData({
      'goalForm.targetBMI': e.detail.value
    });
  },

  onGoalMuscleInput(e) {
    this.setData({
      'goalForm.targetMuscle': e.detail.value
    });
  },

  onGoalProteinInput(e) {
    this.setData({
      'goalForm.dailyProtein': e.detail.value
    });
  },

  onGoalBloodSugarInput(e) {
    this.setData({
      'goalForm.targetBloodSugar': e.detail.value
    });
  },

  onGoalCarbsInput(e) {
    this.setData({
      'goalForm.dailyCarbs': e.detail.value
    });
  },

  onGoalBloodPressureInput(e) {
    this.setData({
      'goalForm.targetBloodPressure': e.detail.value
    });
  },

  onGoalSodiumInput(e) {
    this.setData({
      'goalForm.dailySodium': e.detail.value
    });
  },

  onGoalCaloriesInput(e) {
    this.setData({
      'goalForm.dailyCalories': e.detail.value
    });
  },

  onGoalEndDateChange(e) {
    this.setData({
      'goalForm.endDate': e.detail.value
    });
  },

  // 保存目标
  saveGoal() {
    const { goalForm, goalTypes } = this.data;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newGoal = {
      id: Date.now(),
      target: goalTypes[goalForm.typeIndex],
      targetWeight: goalForm.targetWeight,
      targetBMI: goalForm.targetBMI,
      targetMuscle: goalForm.targetMuscle,
      dailyProtein: goalForm.dailyProtein,
      targetBloodSugar: goalForm.targetBloodSugar,
      dailyCarbs: goalForm.dailyCarbs,
      targetBloodPressure: goalForm.targetBloodPressure,
      dailySodium: goalForm.dailySodium,
      dailyCalories: goalForm.dailyCalories,
      startDate: dateStr,
      endDate: goalForm.endDate,
      status: 'active'
    };

    this.setData({
      currentGoal: newGoal,
      showGoalModal: false
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },

  // 完成目标结果输入
  onCompleteResultInput(e) {
    this.setData({
      'completeForm.result': e.detail.value
    });
  },

  // 保存完成目标
  saveCompleteGoal() {
    const { currentGoal, completeForm, goalHistory } = this.data;

    if (!completeForm.result || !completeForm.result.trim()) {
      wx.showToast({
        title: '请填写完成情况',
        icon: 'none'
      });
      return;
    }

    const completedGoal = {
      ...currentGoal,
      status: 'completed',
      result: completeForm.result
    };

    goalHistory.unshift(completedGoal);

    this.setData({
      currentGoal: null,
      goalHistory: goalHistory,
      showCompleteModal: false
    });

    wx.showToast({
      title: '目标已完成',
      icon: 'success'
    });
  },

  // ========== 健康状况相关 ==========

  // 编辑健康状况
  editHealthInfo() {
    const info = this.data.healthInfo || {};
    const genderIndex = this.data.genders.indexOf(info.gender || '');
    const activityIndex = this.data.activityLevels.indexOf(info.activityLevel || '');

    this.setData({
      showHealthModal: true,
      healthForm: {
        height: info.height ? info.height.toString() : '',
        weight: info.weight ? info.weight.toString() : '',
        age: info.age ? info.age.toString() : '',
        genderIndex: genderIndex >= 0 ? genderIndex : 0,
        activityIndex: activityIndex >= 0 ? activityIndex : 0,
        bloodPressure: info.bloodPressure || '',
        bloodSugar: info.bloodSugar ? info.bloodSugar.toString() : ''
      }
    });
  },

  // 隐藏健康状况弹窗
  hideHealthModal() {
    this.setData({
      showHealthModal: false
    });
  },

  // 健康状况表单输入
  onHealthHeightInput(e) {
    this.setData({
      'healthForm.height': e.detail.value
    });
  },

  onHealthWeightInput(e) {
    this.setData({
      'healthForm.weight': e.detail.value
    });
  },

  onHealthAgeInput(e) {
    this.setData({
      'healthForm.age': e.detail.value
    });
  },

  onGenderChange(e) {
    this.setData({
      'healthForm.genderIndex': parseInt(e.detail.value)
    });
  },

  onActivityChange(e) {
    this.setData({
      'healthForm.activityIndex': parseInt(e.detail.value)
    });
  },

  onBloodPressureInput(e) {
    this.setData({
      'healthForm.bloodPressure': e.detail.value
    });
  },

  onBloodSugarInput(e) {
    this.setData({
      'healthForm.bloodSugar': e.detail.value
    });
  },

  // 保存健康状况
  async saveHealthInfo() {
    const { healthForm, genders, activityLevels } = this.data;

    // 验证必填字段
    if (!healthForm.height || !healthForm.weight) {
      wx.showToast({
        title: '请填写身高和体重',
        icon: 'none'
      });
      return;
    }

    try {
      wx.showLoading({ title: '保存中...' });

      // 性别映射：男->1, 女->2
      const genderMap = { '男': 1, '女': 2 };
      // 活动水平映射
      const activityMap = {
        '久坐': 'sedentary',
        '轻度运动': 'light',
        '中度运动': 'moderate',
        '重度运动': 'heavy'
      };

      const data = {
        height: parseFloat(healthForm.height),
        weight: parseFloat(healthForm.weight),
        age: healthForm.age ? parseInt(healthForm.age) : null,
        gender: genderMap[genders[healthForm.genderIndex]],
        activityLevel: activityMap[activityLevels[healthForm.activityIndex]],
        bloodPressure: healthForm.bloodPressure || null,
        bloodSugar: healthForm.bloodSugar ? parseFloat(healthForm.bloodSugar) : null
      };

      await updateHealthProfile(data);

      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      this.setData({
        showHealthModal: false
      });

      // 重新加载数据
      this.loadProfileData();
    } catch (error) {
      console.error('保存健康状况失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // ========== 特殊禁忌相关 ==========

  // 添加禁忌
  addRestriction() {
    this.setData({
      showRestrictionModal: true,
      restrictionForm: {
        typeIndex: 0,
        name: '',
        description: '',
        severityIndex: 0
      }
    });
  },

  // 隐藏禁忌弹窗
  hideRestrictionModal() {
    this.setData({
      showRestrictionModal: false
    });
  },

  // 禁忌表单输入
  onRestrictionTypeChange(e) {
    this.setData({
      'restrictionForm.typeIndex': parseInt(e.detail.value)
    });
  },

  onRestrictionNameInput(e) {
    this.setData({
      'restrictionForm.name': e.detail.value
    });
  },

  onRestrictionDescInput(e) {
    this.setData({
      'restrictionForm.description': e.detail.value
    });
  },

  onSeverityChange(e) {
    this.setData({
      'restrictionForm.severityIndex': parseInt(e.detail.value)
    });
  },

  // 保存禁忌
  saveRestriction() {
    const { restrictionForm, restrictionTypes, severityLevels, restrictions } = this.data;

    if (!restrictionForm.name || !restrictionForm.name.trim()) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      });
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const typeMap = { 0: 'allergy', 1: 'disease' };
    const severityMap = { 0: 'low', 1: 'medium', 2: 'high' };

    const newRestriction = {
      id: Date.now(),
      type: typeMap[restrictionForm.typeIndex],
      name: restrictionForm.name,
      description: restrictionForm.description,
      severity: severityMap[restrictionForm.severityIndex],
      addedDate: dateStr
    };

    restrictions.push(newRestriction);

    this.setData({
      restrictions: restrictions,
      showRestrictionModal: false
    });

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除禁忌
  deleteRestriction(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除这条禁忌吗？',
      success: (res) => {
        if (res.confirm) {
          const restrictions = this.data.restrictions.filter(item => item.id !== id);
          this.setData({
            restrictions: restrictions
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // ========== 历史目标相关 ==========

  // 切换历史编辑模式
  toggleHistoryEdit() {
    this.setData({
      isHistoryEditing: !this.data.isHistoryEditing
    });
  },

  // 删除历史目标
  deleteHistory(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除这条历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          const goalHistory = this.data.goalHistory.filter(item => item.id !== id);
          this.setData({
            goalHistory: goalHistory
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
});
