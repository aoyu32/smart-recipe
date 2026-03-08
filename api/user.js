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
