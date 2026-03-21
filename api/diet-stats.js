import request from '../utils/request'

/**
 * 获取饮食统计总览
 * @param {number} days - 统计天数，支持 7 / 30
 */
export const getDietStatsOverview = (days = 7) => {
  return request({
    url: '/api/diet-stats/overview',
    method: 'GET',
    params: {
      days
    }
  })
}
