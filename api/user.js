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

// 更新用户信息
export const updateUserProfile = (data) => {
    return request({
        url: '/api/user/profile',
        method: 'PUT',
        data
    })
}

// 上传头像
export const uploadAvatar = (filePath) => {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync('token')

        wx.uploadFile({
            url: 'http://localhost:8000/api/file/upload/avatar',
            filePath: filePath,
            name: 'file',
            header: {
                'Authorization': `Bearer ${token}`
            },
            success: (res) => {
                console.log('上传接口原始响应：', res)
                console.log('响应数据：', res.data)

                const data = JSON.parse(res.data)
                console.log('解析后的数据：', data)

                if (data.code === 200) {
                    console.log('返回的头像URL：', data.data)
                    resolve(data.data)
                } else {
                    wx.showToast({
                        title: data.message || '上传失败',
                        icon: 'none'
                    })
                    reject(new Error(data.message))
                }
            },
            fail: (err) => {
                console.error('上传请求失败：', err)
                wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}

// 获取健康档案
export const getHealthProfile = () => {
    return request({
        url: '/api/health-profile',
        method: 'GET'
    })
}

// 更新健康档案
export const updateHealthProfile = (data) => {
    return request({
        url: '/api/health-profile',
        method: 'PUT',
        data
    })
}

// ========== 健康目标相关API ==========

// 添加健康目标
export const addHealthGoal = (data) => {
    return request({
        url: '/api/health-goal',
        method: 'POST',
        data
    })
}

// 查询当前健康目标
export const getCurrentHealthGoal = () => {
    return request({
        url: '/api/health-goal/current',
        method: 'GET'
    })
}

// 更新健康目标
export const updateHealthGoal = (goalId, data) => {
    return request({
        url: `/api/health-goal/${goalId}`,
        method: 'PUT',
        data
    })
}

// 取消健康目标
export const cancelHealthGoal = (goalId) => {
    return request({
        url: `/api/health-goal/${goalId}/cancel`,
        method: 'PUT'
    })
}

// 完成健康目标
export const completeHealthGoal = (goalId, data) => {
    return request({
        url: `/api/health-goal/${goalId}/complete`,
        method: 'PUT',
        data
    })
}

// 查询历史目标列表
export const getHistoryHealthGoals = () => {
    return request({
        url: '/api/health-goal/history',
        method: 'GET'
    })
}

// 删除历史目标
export const deleteHistoryGoal = (goalId) => {
    return request({
        url: `/api/health-goal/${goalId}`,
        method: 'DELETE'
    })
}

// ========== 特殊禁忌相关API ==========

// 添加特殊禁忌
export const addRestriction = (data) => {
    return request({
        url: '/api/restriction/add',
        method: 'POST',
        data
    })
}

// 获取特殊禁忌列表
export const getRestrictionList = () => {
    return request({
        url: '/api/restriction/list',
        method: 'GET'
    })
}

// 删除特殊禁忌
export const deleteRestriction = (restrictionId) => {
    return request({
        url: `/api/restriction/delete/${restrictionId}`,
        method: 'DELETE'
    })
}

// ========== 饮食偏好相关API ==========

// 添加饮食偏好
export const addDietPreference = (data) => {
    return request({
        url: '/api/diet-preference/add',
        method: 'POST',
        data
    })
}

// 获取饮食偏好列表
export const getDietPreferenceList = () => {
    return request({
        url: '/api/diet-preference/list',
        method: 'GET'
    })
}

// 更新饮食偏好
export const updateDietPreference = (preferenceId, data) => {
    return request({
        url: `/api/diet-preference/update/${preferenceId}`,
        method: 'PUT',
        data
    })
}

// 删除饮食偏好
export const deleteDietPreference = (preferenceId) => {
    return request({
        url: `/api/diet-preference/delete/${preferenceId}`,
        method: 'DELETE'
    })
}

// ========== 我的内容统计相关API ==========

// 获取我的内容统计
export const getMyContentStats = () => {
    return request({
        url: '/api/my-content/stats',
        method: 'GET'
    })
}
