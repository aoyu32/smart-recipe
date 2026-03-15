// pages/diet-diary/diet-diary.js
import { getDietDiaryByDate } from '../../api/recipe';

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    currentDate: '',
    currentWeekday: '',
    selectedDate: '',
    currentRecord: {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: {
        breakfast: { time: '早餐', calories: 0, checked: false, foods: [] },
        lunch: { time: '午餐', calories: 0, checked: false, foods: [] },
        dinner: { time: '晚餐', calories: 0, checked: false, foods: [] }
      }
    },
    checkedMealsCount: 0,
    showDateModal: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });

    // 加载今天的日记数据
    this.loadDiaryData();
  },

  // 加载日记数据
  async loadDiaryData(dateStr) {
    // 如果没有指定日期，使用今天
    if (!dateStr) {
      const today = new Date();
      dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    try {
      wx.showLoading({ title: '加载中...' });

      // 调用接口查询日记数据
      const result = await getDietDiaryByDate(dateStr);

      console.log('饮食日记数据：', result);

      // 计算已打卡餐数
      const checkedMealsCount = result.checkedMeals ? result.checkedMeals.length : 0;

      this.setData({
        currentDate: result.date,
        currentWeekday: result.weekday,
        selectedDate: result.date,
        currentRecord: result,
        checkedMealsCount: checkedMealsCount
      });

      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.error('加载饮食日记失败：', error);
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

  // 上一天
  prevDay() {
    const currentDate = new Date(this.data.currentDate);
    currentDate.setDate(currentDate.getDate() - 1);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    this.loadDiaryData(dateStr);
  },

  // 下一天
  nextDay() {
    const currentDate = new Date(this.data.currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    this.loadDiaryData(dateStr);
  },

  // 显示日期选择器
  showDatePicker() {
    this.setData({
      showDateModal: true
    });
  },

  // 隐藏日期选择器
  hideDatePicker() {
    this.setData({
      showDateModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() { },

  // 日期改变
  onDateChange(e) {
    const dateStr = e.detail.value;
    this.setData({
      showDateModal: false
    });
    this.loadDiaryData(dateStr);
  }
})
