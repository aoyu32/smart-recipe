// pages/health-profile/health-profile.js
const { currentGoal, healthInfo, goalHistory, restrictions } = require('../../mock/health-profile.js');

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    
    // 当前健康目标
    currentGoal: null,
    
    // 健康状况
    healthInfo: null,
    
    // 历史目标
    goalHistory: [],
    
    // 特殊禁忌
    restrictions: [],
    
    // 历史目标编辑状态
    isHistoryEditing: false,
    
    // 弹窗显示状态
    showGoalModal: false,
    showHealthModal: false,
    showRestrictionModal: false,
    showCompleteModal: false,
    
    // 编辑状态
    isEditingGoal: false,
    
    // 表单数据
    goalForm: {
      typeIndex: 0,
      targetWeight: '',
      targetBMI: '',
      dailyCalories: '',
      targetMuscle: '',
      dailyProtein: '',
      targetBloodSugar: '',
      dailyCarbs: '',
      targetBloodPressure: '',
      dailySodium: '',
      endDate: ''
    },
    healthForm: {
      height: '',
      weight: '',
      age: '',
      genderIndex: 0,
      activityIndex: 0,
      bloodPressure: '',
      bloodSugar: ''
    },
    restrictionForm: {
      typeIndex: 0,
      name: '',
      description: '',
      severityIndex: 0
    },
    completeForm: {
      result: ''
    },
    
    // 选项数据
    goalTypes: ['减重', '增重', '保持健康', '增肌', '控糖', '降压'],
    genders: ['女', '男'],
    activityLevels: ['久坐', '轻度运动', '中度运动', '重度运动'],
    restrictionTypes: ['过敏', '疾病'],
    severityLevels: ['轻微', '中等', '严重']
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight,
      currentGoal: currentGoal,
      healthInfo: healthInfo,
      goalHistory: goalHistory,
      restrictions: restrictions
    });
  },

  // ========== 健康目标相关 ==========
  
  // 添加健康目标
  addGoal() {
    this.setData({
      isEditingGoal: false,
      showGoalModal: true,
      goalForm: {
        typeIndex: 0,
        targetWeight: '',
        targetBMI: '',
        dailyCalories: '',
        targetMuscle: '',
        dailyProtein: '',
        targetBloodSugar: '',
        dailyCarbs: '',
        targetBloodPressure: '',
        dailySodium: '',
        endDate: ''
      }
    });
  },

  // 编辑健康目标
  editGoal() {
    const goal = this.data.currentGoal;
    const typeIndex = this.data.goalTypes.indexOf(goal.target);
    
    this.setData({
      isEditingGoal: true,
      showGoalModal: true,
      goalForm: {
        typeIndex: typeIndex >= 0 ? typeIndex : 0,
        targetWeight: goal.targetWeight ? goal.targetWeight.toString() : '',
        targetBMI: goal.targetBMI ? goal.targetBMI.toString() : '',
        dailyCalories: goal.dailyCalories ? goal.dailyCalories.toString() : '',
        targetMuscle: goal.targetMuscle ? goal.targetMuscle.toString() : '',
        dailyProtein: goal.dailyProtein ? goal.dailyProtein.toString() : '',
        targetBloodSugar: goal.targetBloodSugar ? goal.targetBloodSugar.toString() : '',
        dailyCarbs: goal.dailyCarbs ? goal.dailyCarbs.toString() : '',
        targetBloodPressure: goal.targetBloodPressure || '',
        dailySodium: goal.dailySodium ? goal.dailySodium.toString() : '',
        endDate: goal.endDate || ''
      }
    });
  },

  // 保存健康目标
  saveGoal() {
    const form = this.data.goalForm;
    const goalType = this.data.goalTypes[form.typeIndex];
    
    // 基础验证
    if (!form.dailyCalories) {
      wx.showToast({
        title: '请填写每日热量',
        icon: 'none'
      });
      return;
    }
    
    // 根据目标类型验证必填字段
    if (goalType === '减重' || goalType === '增重' || goalType === '保持健康') {
      if (!form.targetWeight || !form.targetBMI) {
        wx.showToast({
          title: '请填写目标体重和BMI',
          icon: 'none'
        });
        return;
      }
    } else if (goalType === '增肌') {
      if (!form.targetWeight || !form.targetMuscle || !form.dailyProtein) {
        wx.showToast({
          title: '请填写完整的增肌目标',
          icon: 'none'
        });
        return;
      }
    } else if (goalType === '控糖') {
      if (!form.targetBloodSugar || !form.dailyCarbs) {
        wx.showToast({
          title: '请填写完整的控糖目标',
          icon: 'none'
        });
        return;
      }
    } else if (goalType === '降压') {
      if (!form.targetBloodPressure || !form.dailySodium) {
        wx.showToast({
          title: '请填写完整的降压目标',
          icon: 'none'
        });
        return;
      }
    }
    
    // 构建目标对象
    const goal = {
      id: this.data.isEditingGoal ? this.data.currentGoal.id : Date.now(),
      target: goalType,
      dailyCalories: parseInt(form.dailyCalories),
      startDate: this.data.isEditingGoal ? this.data.currentGoal.startDate : new Date().toISOString().split('T')[0],
      endDate: form.endDate || null,
      status: 'active'
    };
    
    // 根据目标类型添加特定字段
    if (goalType === '减重' || goalType === '增重' || goalType === '保持健康') {
      goal.targetWeight = parseFloat(form.targetWeight);
      goal.targetBMI = parseFloat(form.targetBMI);
    } else if (goalType === '增肌') {
      goal.targetWeight = parseFloat(form.targetWeight);
      goal.targetMuscle = parseFloat(form.targetMuscle);
      goal.dailyProtein = parseInt(form.dailyProtein);
    } else if (goalType === '控糖') {
      goal.targetBloodSugar = parseFloat(form.targetBloodSugar);
      goal.dailyCarbs = parseInt(form.dailyCarbs);
    } else if (goalType === '降压') {
      goal.targetBloodPressure = form.targetBloodPressure;
      goal.dailySodium = parseInt(form.dailySodium);
    }
    
    this.setData({
      currentGoal: goal,
      showGoalModal: false
    });
    
    wx.showToast({
      title: this.data.isEditingGoal ? '修改成功' : '添加成功',
      icon: 'success'
    });
  },

  hideGoalModal() {
    this.setData({ showGoalModal: false });
  },

  onGoalTypeChange(e) {
    this.setData({ 'goalForm.typeIndex': parseInt(e.detail.value) });
  },

  onGoalWeightInput(e) {
    this.setData({ 'goalForm.targetWeight': e.detail.value });
  },

  onGoalBMIInput(e) {
    this.setData({ 'goalForm.targetBMI': e.detail.value });
  },

  onGoalCaloriesInput(e) {
    this.setData({ 'goalForm.dailyCalories': e.detail.value });
  },

  onGoalEndDateChange(e) {
    this.setData({ 'goalForm.endDate': e.detail.value });
  },

  onGoalMuscleInput(e) {
    this.setData({ 'goalForm.targetMuscle': e.detail.value });
  },

  onGoalProteinInput(e) {
    this.setData({ 'goalForm.dailyProtein': e.detail.value });
  },

  onGoalBloodSugarInput(e) {
    this.setData({ 'goalForm.targetBloodSugar': e.detail.value });
  },

  onGoalCarbsInput(e) {
    this.setData({ 'goalForm.dailyCarbs': e.detail.value });
  },

  onGoalBloodPressureInput(e) {
    this.setData({ 'goalForm.targetBloodPressure': e.detail.value });
  },

  onGoalSodiumInput(e) {
    this.setData({ 'goalForm.dailySodium': e.detail.value });
  },

  // 取消健康目标
  cancelGoal() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消当前健康目标吗？',
      success: (res) => {
        if (res.confirm) {
          const goal = {
            ...this.data.currentGoal,
            endDate: new Date().toISOString().split('T')[0],
            status: 'cancelled',
            result: '用户取消'
          };
          
          this.setData({
            currentGoal: null,
            goalHistory: [goal, ...this.data.goalHistory]
          });
          
          wx.showToast({
            title: '已取消目标',
            icon: 'success'
          });
        }
      }
    });
  },

  // 完成健康目标
  completeGoal() {
    this.setData({
      showCompleteModal: true,
      completeForm: {
        result: ''
      }
    });
  },

  // 保存完成目标
  saveCompleteGoal() {
    const result = this.data.completeForm.result;
    
    if (!result) {
      wx.showToast({
        title: '请填写完成情况',
        icon: 'none'
      });
      return;
    }
    
    const goal = {
      ...this.data.currentGoal,
      endDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      result: result
    };
    
    this.setData({
      currentGoal: null,
      goalHistory: [goal, ...this.data.goalHistory],
      showCompleteModal: false
    });
    
    wx.showToast({
      title: '恭喜完成目标！',
      icon: 'success'
    });
  },

  hideCompleteModal() {
    this.setData({ showCompleteModal: false });
  },

  onCompleteResultInput(e) {
    this.setData({ 'completeForm.result': e.detail.value });
  },

  // ========== 健康状况相关 ==========
  
  // 编辑健康状况
  editHealthInfo() {
    const info = this.data.healthInfo;
    
    if (info) {
      const genderIndex = this.data.genders.indexOf(info.gender);
      const activityIndex = this.data.activityLevels.indexOf(info.activityLevel);
      
      this.setData({
        showHealthModal: true,
        healthForm: {
          height: info.height.toString(),
          weight: info.weight.toString(),
          age: info.age.toString(),
          genderIndex: genderIndex >= 0 ? genderIndex : 0,
          activityIndex: activityIndex >= 0 ? activityIndex : 0,
          bloodPressure: info.bloodPressure || '',
          bloodSugar: info.bloodSugar ? info.bloodSugar.toString() : ''
        }
      });
    } else {
      this.setData({
        showHealthModal: true,
        healthForm: {
          height: '',
          weight: '',
          age: '',
          genderIndex: 0,
          activityIndex: 0,
          bloodPressure: '',
          bloodSugar: ''
        }
      });
    }
  },

  // 保存健康状况
  saveHealthInfo() {
    const form = this.data.healthForm;
    
    if (!form.height || !form.weight || !form.age) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    
    const info = {
      height: height,
      weight: weight,
      age: parseInt(form.age),
      gender: this.data.genders[form.genderIndex],
      bmi: parseFloat(bmi),
      bmiStatus: bmi < 18.5 ? 'low' : bmi > 24 ? 'high' : 'normal',
      activityLevel: this.data.activityLevels[form.activityIndex],
      bloodPressure: form.bloodPressure || '未设置',
      bloodSugar: form.bloodSugar ? parseFloat(form.bloodSugar) : 0
    };
    
    this.setData({
      healthInfo: info,
      showHealthModal: false
    });
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },

  hideHealthModal() {
    this.setData({ showHealthModal: false });
  },

  onHealthHeightInput(e) {
    this.setData({ 'healthForm.height': e.detail.value });
  },

  onHealthWeightInput(e) {
    this.setData({ 'healthForm.weight': e.detail.value });
  },

  onHealthAgeInput(e) {
    this.setData({ 'healthForm.age': e.detail.value });
  },

  onGenderChange(e) {
    this.setData({ 'healthForm.genderIndex': parseInt(e.detail.value) });
  },

  onActivityChange(e) {
    this.setData({ 'healthForm.activityIndex': parseInt(e.detail.value) });
  },

  onBloodPressureInput(e) {
    this.setData({ 'healthForm.bloodPressure': e.detail.value });
  },

  onBloodSugarInput(e) {
    this.setData({ 'healthForm.bloodSugar': e.detail.value });
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

  // 保存禁忌
  saveRestriction() {
    const form = this.data.restrictionForm;
    
    if (!form.name || !form.description) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    const typeMap = ['allergy', 'disease'];
    const severityMap = ['low', 'medium', 'high'];
    
    const restriction = {
      id: Date.now(),
      type: typeMap[form.typeIndex],
      name: form.name,
      description: form.description,
      severity: severityMap[form.severityIndex],
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    this.setData({
      restrictions: [...this.data.restrictions, restriction],
      showRestrictionModal: false
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  hideRestrictionModal() {
    this.setData({ showRestrictionModal: false });
  },

  onRestrictionTypeChange(e) {
    this.setData({ 'restrictionForm.typeIndex': parseInt(e.detail.value) });
  },

  onRestrictionNameInput(e) {
    this.setData({ 'restrictionForm.name': e.detail.value });
  },

  onRestrictionDescInput(e) {
    this.setData({ 'restrictionForm.description': e.detail.value });
  },

  onSeverityChange(e) {
    this.setData({ 'restrictionForm.severityIndex': parseInt(e.detail.value) });
  },

  // 删除禁忌
  deleteRestriction(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条禁忌吗？',
      success: (res) => {
        if (res.confirm) {
          const restrictions = this.data.restrictions.filter(item => item.id !== id);
          this.setData({ restrictions });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // ========== 历史目标相关 ==========
  
  // 切换历史目标编辑状态
  toggleHistoryEdit() {
    this.setData({
      isHistoryEditing: !this.data.isHistoryEditing
    });
  },

  // 删除历史目标
  deleteHistory(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条历史目标吗？',
      success: (res) => {
        if (res.confirm) {
          const goalHistory = this.data.goalHistory.filter(item => item.id !== id);
          this.setData({ goalHistory });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 返回
  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  }
})
