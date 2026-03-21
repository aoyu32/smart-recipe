import { getDietStatsOverview } from '../../api/diet-stats'
import * as echarts from '../../components/ec-canvas/echarts'

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    activeRange: 7,
    loading: false,
    hasData: true,
    rangeLabel: '近7天',
    rangeSummaryText: '近七日饮食数据统计结果',
    summary: {
      totalCalories: 0,
      avgDailyCalories: 0,
      checkinDays: 0,
      checkedMealsCount: 0,
      checkinRate: 0
    },
    caloriesTrend: [],
    checkinTrend: [],
    mealAverageList: [],
    ecLine: { lazyLoad: true },
    ecBar: { lazyLoad: true },
    ecPie: { lazyLoad: true }
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2

    this.lineChart = null
    this.barChart = null
    this.pieChart = null
    this.pageReady = false

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight
    })

    this.loadStats()
  },

  onReady() {
    this.pageReady = true
    this.renderCharts()
  },

  onUnload() {
    this.disposeCharts()
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.switchTab({
      url: '/pages/my/my'
    })
  },

  switchRange(e) {
    const days = Number(e.currentTarget.dataset.days) || 7
    if (days === this.data.activeRange) {
      return
    }

    this.setData({
      activeRange: days
    }, () => {
      this.loadStats()
    })
  },

  async loadStats() {
    if (this.data.loading) {
      return
    }

    this.setData({ loading: true })
    wx.showLoading({
      title: '加载统计中...',
      mask: true
    })

    try {
      const result = await getDietStatsOverview(this.data.activeRange)
      const summary = this.normalizeSummary(result && result.summary)
      const caloriesTrend = (result && result.caloriesTrend) || []
      const checkinTrend = (result && result.checkinTrend) || []
      const mealAverageList = (result && result.mealAverageList) || []
      const rangeLabel = (result && result.rangeLabel) || `近${this.data.activeRange}天`
      const rangeSummaryText = this.buildRangeSummaryText(this.data.activeRange)

      this.setData({
        summary,
        caloriesTrend,
        checkinTrend,
        mealAverageList,
        rangeLabel,
        rangeSummaryText,
        hasData: this.hasData(summary, caloriesTrend, checkinTrend, mealAverageList)
      }, () => {
        this.renderCharts()
      })
    } catch (error) {
      console.error('加载数据统计失败', error)
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
      this.setData({ loading: false })
    }
  },

  normalizeSummary(summary) {
    return {
      totalCalories: this.formatInt(summary && summary.totalCalories),
      avgDailyCalories: this.formatDecimal(summary && summary.avgDailyCalories),
      checkinDays: this.formatInt(summary && summary.checkinDays),
      checkedMealsCount: this.formatInt(summary && summary.checkedMealsCount),
      checkinRate: this.formatDecimal(summary && summary.checkinRate)
    }
  },

  formatInt(value) {
    const num = Number(value)
    if (Number.isNaN(num)) {
      return 0
    }
    return Math.round(num)
  },

  formatDecimal(value) {
    const num = Number(value)
    if (Number.isNaN(num)) {
      return 0
    }
    return Number(num.toFixed(1))
  },

  buildRangeSummaryText(days) {
    return Number(days) === 30
      ? '近30日饮食数据统计结果'
      : '近七日饮食数据统计结果'
  },

  hasData(summary, caloriesTrend, checkinTrend, mealAverageList) {
    const dataSum = [
      summary.totalCalories,
      summary.avgDailyCalories,
      summary.checkinDays,
      summary.checkedMealsCount,
      ...caloriesTrend.map(item => Number(item.value) || 0),
      ...checkinTrend.map(item => Number(item.value) || 0),
      ...mealAverageList.map(item => Number(item.averageCalories) || 0)
    ].reduce((sum, value) => sum + value, 0)

    return dataSum > 0
  },

  renderCharts() {
    if (!this.pageReady) {
      return
    }

    this.disposeCharts()
    this.renderLineChart()
    this.renderBarChart()
    this.renderPieChart()
  },

  disposeCharts() {
    if (this.lineChart) {
      this.lineChart.dispose()
      this.lineChart = null
    }
    if (this.barChart) {
      this.barChart.dispose()
      this.barChart = null
    }
    if (this.pieChart) {
      this.pieChart.dispose()
      this.pieChart = null
    }
  },

  renderLineChart() {
    const component = this.selectComponent('#lineChart')
    if (!component) {
      return
    }

    component.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width,
        height,
        dpr
      })
      canvas.setChart(chart)
      chart.setOption(this.buildLineOption())
      this.lineChart = chart
      return chart
    })
  },

  renderBarChart() {
    const component = this.selectComponent('#barChart')
    if (!component) {
      return
    }

    component.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width,
        height,
        dpr
      })
      canvas.setChart(chart)
      chart.setOption(this.buildBarOption())
      this.barChart = chart
      return chart
    })
  },

  renderPieChart() {
    const component = this.selectComponent('#pieChart')
    if (!component) {
      return
    }

    component.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width,
        height,
        dpr
      })
      canvas.setChart(chart)
      chart.setOption(this.buildPieOption())
      this.pieChart = chart
      return chart
    })
  },

  buildLineOption() {
    const labels = this.data.caloriesTrend.map(item => item.label)
    const values = this.data.caloriesTrend.map(item => Number(item.value) || 0)

    return {
      color: ['#9BC184'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      grid: {
        left: '6%',
        right: '4%',
        top: '12%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: {
          lineStyle: {
            color: '#D9E5D0'
          }
        },
        axisLabel: {
          color: '#666666'
        }
      },
      yAxis: {
        type: 'value',
        name: 'kcal',
        nameTextStyle: {
          color: '#999999'
        },
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#EEF2EA'
          }
        },
        axisLabel: {
          color: '#666666'
        }
      },
      series: [{
        name: '每日热量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 8,
        data: values,
        lineStyle: {
          width: 4,
          color: '#9BC184'
        },
        itemStyle: {
          color: '#9BC184'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(155, 193, 132, 0.35)' },
              { offset: 1, color: 'rgba(155, 193, 132, 0.03)' }
            ]
          }
        }
      }]
    }
  },

  buildBarOption() {
    const labels = this.data.checkinTrend.map(item => item.label)
    const values = this.data.checkinTrend.map(item => Number(item.value) || 0)

    return {
      color: ['#B6CF99'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '6%',
        right: '4%',
        top: '12%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#D9E5D0'
          }
        },
        axisLabel: {
          color: '#666666'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 3,
        interval: 1,
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#EEF2EA'
          }
        },
        axisLabel: {
          color: '#666666'
        }
      },
      series: [{
        name: '打卡餐次',
        type: 'bar',
        barWidth: '48%',
        data: values,
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: '#B6CF99'
        }
      }]
    }
  },

  buildPieOption() {
    const colors = ['#9BC184', '#F5B55C', '#6FB5FF']
    const pieData = this.data.mealAverageList.map((item, index) => ({
      name: item.mealName,
      value: Number(item.averageCalories) || 0,
      itemStyle: {
        color: colors[index]
      }
    }))
    const total = pieData.reduce((sum, item) => sum + item.value, 0)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} kcal ({d}%)'
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#666666',
          fontSize: 12
        }
      },
      series: [{
        name: '平均热量',
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}\n{c}kcal'
        },
        labelLine: {
          show: true
        },
        data: pieData
      }]
    }

    if (total === 0) {
      option.graphic = [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: '暂无餐次数据',
          fill: '#999999',
          fontSize: 14
        }
      }]
    }

    return option
  }
})
