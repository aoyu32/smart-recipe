// pages/diet-diary/diet-diary.js
const mockDietDiary = require('../../mock/diet-diary.js');

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    currentDate: '',
    currentWeekday: '',
    selectedDate: '',
    diaryList: [],
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

    this.loadDiaryData();
  },

  // 加载日记数据
  loadDiaryData(dateStr) {
    const diaryList = mockDietDiary.getDiaryList();

    // 如果没有指定日期，使用今天
    if (!dateStr) {
      const today = new Date();
      dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    // 获取星期几
    const date = new Date(dateStr);
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];

    // 查找对应日期的记录
    let record = diaryList.find(item => item.date === dateStr);

    // 如果没有记录，创建空记录
    if (!record) {
      record = {
        date: dateStr,
        weekday: weekday,
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
      };
    }

    // 计算已打卡餐数
    const checkedMealsCount = record.checkedMeals ? record.checkedMeals.length : 0;

    this.setData({
      currentDate: dateStr,
      currentWeekday: weekday,
      selectedDate: dateStr,
      diaryList: diaryList,
      currentRecord: record,
      checkedMealsCount: checkedMealsCount
    });
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
  },

  // 查看详情
  viewDetail(e) {
    const date = e.currentTarget.dataset.date;
    wx.showToast({
      title: `查看${date}的详情`,
      icon: 'none'
    });
  }
})
