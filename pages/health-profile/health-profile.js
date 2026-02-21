// pages/health-profile/health-profile.js
const mockHealthProfile = require('../../mock/health-profile.js');

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
  loadProfileData() {
    const profileData = mockHealthProfile.getHealthProfile();
    this.setData({
      currentGoal: profileData.currentGoal,
      healthInfo: profileData.healthInfo,
      goalHistory: profileData.goalHistory,
      restrictions: profileData.restrictions,
      goalTemplates: profileData.goalTemplates,
      isHistoryEditing: false
    });
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
        height: info.height || '',
        weight: info.weight || '',
        age: info.age || '',
        genderIndex: genderIndex >= 0 ? genderIndex : 0,
        activityIndex: activityIndex >= 0 ? activityIndex : 0,
        bloodPressure: info.bloodPressure || '',
        bloodSugar: info.bloodSugar || ''
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
  saveHealthInfo() {
    const { healthForm, genders, activityLevels } = this.data;

    // 计算BMI
    const height = parseFloat(healthForm.height);
    const weight = parseFloat(healthForm.weight);
    let bmi = 0;
    let bmiStatus = 'normal';

    if (height && weight) {
      bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      if (bmi < 18.5) {
        bmiStatus = 'underweight';
      } else if (bmi >= 18.5 && bmi < 24) {
        bmiStatus = 'normal';
      } else if (bmi >= 24 && bmi < 28) {
        bmiStatus = 'overweight';
      } else {
        bmiStatus = 'obese';
      }
    }

    const newHealthInfo = {
      height: healthForm.height,
      weight: healthForm.weight,
      age: healthForm.age,
      gender: genders[healthForm.genderIndex],
      bmi: bmi,
      bmiStatus: bmiStatus,
      activityLevel: activityLevels[healthForm.activityIndex],
      bloodPressure: healthForm.bloodPressure,
      bloodSugar: healthForm.bloodSugar
    };

    this.setData({
      healthInfo: newHealthInfo,
      showHealthModal: false
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
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
