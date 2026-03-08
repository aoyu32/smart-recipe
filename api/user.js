import request from '../utils/request'

/**
 * 用户相关API
 */

// 获取用户信息
export const getUserProfile = () => {
    return request({
        url: '/api/user/profile',
        method: 'GET'
    })
}
