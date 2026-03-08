import axios from 'axios-miniprogram'

// 创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从本地存储获取token
        const token = wx.getStorageSync('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        // 显示加载提示
        wx.showLoading({
            title: '加载中...',
            mask: true
        })

        return config
    },
    error => {
        wx.hideLoading()
        console.error('请求错误：', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        wx.hideLoading()

        const res = response.data

        // 根据后端返回的状态码判断
        if (res.code === 200) {
            return res.data
        } else {
            // 处理业务错误
            wx.showToast({
                title: res.message || '请求失败',
                icon: 'none',
                duration: 2000
            })
            return Promise.reject(new Error(res.message || '请求失败'))
        }
    },
    error => {
        wx.hideLoading()

        console.error('响应错误：', error)

        // 处理HTTP错误
        let message = '网络错误，请稍后重试'

        if (error.response) {
            const status = error.response.status
            const data = error.response.data

            switch (status) {
                case 400:
                    message = data.message || '请求参数错误'
                    break
                case 401:
                    message = '未授权，请重新登录'
                    // 清除token并跳转到登录页
                    wx.removeStorageSync('token')
                    wx.removeStorageSync('userInfo')
                    wx.reLaunch({
                        url: '/pages/auth/login/login'
                    })
                    break
                case 403:
                    message = '拒绝访问'
                    break
                case 404:
                    message = '请求的资源不存在'
                    break
                case 500:
                    message = data.message || '服务器错误'
                    break
                case 502:
                    message = '网关错误'
                    break
                case 503:
                    message = '服务不可用'
                    break
                default:
                    message = data.message || `连接错误${status}`
            }
        } else if (error.request) {
            message = '网络连接失败，请检查网络'
        }

        wx.showToast({
            title: message,
            icon: 'none',
            duration: 2000
        })

        return Promise.reject(error)
    }
)

export default request
