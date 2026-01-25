// pages/diet-diary/diet-diary.js
const { diaryRecords } = require('../../mock/diet-diary.js');

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    
    // 日期相关
    currentDate: '',
    currentWeekday: '',
    selectedDate: '',
    showDateModal: false,
    
    // 当前记录
    currentRecord: {
      date: '',
      weekday: '',
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      checkedMeals: [],
      meals: {
        breakfast: { time: '早餐', timeRange: '未记录', calories: 0, checked: false, foods: [] },
        lunch: { time: '午餐', timeRange: '未记录', calories: 0, checked: false, foods: [] },
        dinner: { time: '晚餐', timeRange: '未记录', calories: 0, checked: false, foods: [] }
      }
    },
    
    // 已打卡餐次数量
    checkedMealsCount: 0,
    
    // 所有记录
    allRecords: []
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight,
      allRecords: diaryRecords
    });
    
    // 初始化当前日期
    this.initCurrentDate();
  },

  // 初始化当前日期
  initCurrentDate() {
    const now = new Date();
    const dateStr = this.formatDate(now);
    const weekday = this.getWeekday(now);
    
    this.setData({
      currentDate: dateStr,
      currentWeekday: weekday,
      selectedDate: this.formatDateForPicker(now)
    });
    
    // 加载当天记录
    this.loadRecordByDate(this.formatDateForPicker(now));
  },

  // 格式化日期显示
  formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  },

  // 格式化日期用于picker
  formatDateForPicker(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 获取星期几
  getWeekday(date) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[date.getDay()];
  },

  // 根据日期加载记录
  loadRecordByDate(dateStr) {
    const record = this.data.allRecords.find(r => r.date === dateStr);
    
    if (record) {
      const checkedCount = record.checkedMeals.length;
      this.setData({
        currentRecord: record,
        checkedMealsCount: checkedCount
      });
    } else {
      // 没有记录，显示空数据
      const date = new Date(dateStr);
      this.setData({
        currentRecord: {
          date: dateStr,
          weekday: this.getWeekday(date),
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          checkedMeals: [],
          meals: {
            breakfast: { time: '早餐', timeRange: '未记录', calories: 0, checked: false, foods: [] },
            lunch: { time: '午餐', timeRange: '未记录', calories: 0, checked: false, foods: [] },
            dinner: { time: '晚餐', timeRange: '未记录', calories: 0, checked: false, foods: [] }
          }
        },
        checkedMealsCount: 0
      });
    }
  },

  // 上一天
  prevDay() {
    const currentDate = new Date(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    
    const dateStr = this.formatDate(currentDate);
    const weekday = this.getWeekday(currentDate);
    const pickerDate = this.formatDateForPicker(currentDate);
    
    this.setData({
      currentDate: dateStr,
      currentWeekday: weekday,
      selectedDate: pickerDate
    });
    
    this.loadRecordByDate(pickerDate);
  },

  // 下一天
  nextDay() {
    const currentDate = new Date(this.data.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    
    const dateStr = this.formatDate(currentDate);
    const weekday = this.getWeekday(currentDate);
    const pickerDate = this.formatDateForPicker(currentDate);
    
    this.setData({
      currentDate: dateStr,
      currentWeekday: weekday,
      selectedDate: pickerDate
    });
    
    this.loadRecordByDate(pickerDate);
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

  // 日期改变
  onDateChange(e) {
    const pickerDate = e.detail.value;
    const date = new Date(pickerDate);
    const dateStr = this.formatDate(date);
    const weekday = this.getWeekday(date);
    
    this.setData({
      currentDate: dateStr,
      currentWeekday: weekday,
      selectedDate: pickerDate,
      showDateModal: false
    });
    
    this.loadRecordByDate(pickerDate);
  },

  // 阻止冒泡
  stopPropagation() {
    // 阻止事件冒泡
  },

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
