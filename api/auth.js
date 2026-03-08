import request from '../utils/request'

/**
 * 用户认证相关API
 */

// 用户登录
export const login = (data) => {
    return request({
        url: '/api/auth/login',
        method: 'POST',
        data
    })
}

// 用户注册
export const register = (data) => {
    return request({
        url: '/api/auth/register',
        method: 'POST',
        data
    })
}

// 重置密码
export const resetPassword = (data) => {
    return request({
        url: '/api/auth/reset-password',
        method: 'POST',
        data
    })
}

// 发送验证码
export const sendVerificationCode = (params) => {
    return request({
        url: '/api/auth/send-code',
        method: 'POST',
        params
    })
}
