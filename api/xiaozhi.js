import request, { BASE_URL } from '../utils/request'

export const getXiaozhiSessions = () => {
    return request({
        url: '/api/xiaozhi/sessions',
        method: 'GET'
    })
}

export const getXiaozhiMessages = (sessionId) => {
    return request({
        url: `/api/xiaozhi/sessions/${sessionId}/messages`,
        method: 'GET'
    })
}

export const deleteXiaozhiSession = (sessionId) => {
    return request({
        url: `/api/xiaozhi/sessions/${sessionId}`,
        method: 'DELETE'
    })
}

export const uploadXiaozhiImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync('token')

        wx.uploadFile({
            url: `${BASE_URL}/api/file/upload/image`,
            filePath,
            name: 'file',
            header: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            success: (res) => {
                try {
                    const data = JSON.parse(res.data || '{}')
                    if (data.code === 200 && data.data) {
                        resolve(data.data)
                        return
                    }
                    reject(new Error(data.message || '图片上传失败'))
                } catch (error) {
                    reject(new Error('图片上传响应解析失败'))
                }
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

export const streamXiaozhiChat = (data, handlers = {}) => {
    const token = wx.getStorageSync('token')
    const { onSession, onMessage, onDone, onError } = handlers

    const requestTask = wx.request({
        url: `${BASE_URL}/api/xiaozhi/chat/stream`,
        method: 'POST',
        data,
        header: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'text/event-stream'
        },
        enableChunked: true,
        success: (res) => {
            if (res.statusCode !== 200) {
                onError && onError(new Error('请求失败'))
            }
        },
        fail: (error) => {
            onError && onError(error)
        }
    })

    let buffer = ''

    requestTask.onChunkReceived((res) => {
        try {
            const decoder = new TextDecoder('utf-8')
            const text = decoder.decode(new Uint8Array(res.data))
            buffer += text.replace(/\r\n/g, '\n')

            let boundaryIndex = buffer.indexOf('\n\n')
            while (boundaryIndex >= 0) {
                const eventBlock = buffer.slice(0, boundaryIndex)
                buffer = buffer.slice(boundaryIndex + 2)
                processSseBlock(eventBlock, { onSession, onMessage, onDone, onError })
                boundaryIndex = buffer.indexOf('\n\n')
            }
        } catch (error) {
            onError && onError(error)
        }
    })

    return requestTask
}

function processSseBlock(eventBlock, handlers) {
    if (!eventBlock || !eventBlock.trim()) {
        return
    }

    const { onSession, onMessage, onDone, onError } = handlers
    const lines = eventBlock.split('\n')
    let eventName = ''
    const dataLines = []

    lines.forEach((line) => {
        if (!line.trim()) {
            return
        }
        if (line.startsWith('event:')) {
            eventName = line.substring(6).trim()
            return
        }
        if (line.startsWith('data:')) {
            let data = line.substring(5)
            if (data.startsWith(' ')) {
                data = data.substring(1)
            }
            dataLines.push(data)
        }
    })

    const rawData = dataLines.join('\n')

    if (eventName === 'session') {
        const data = safeParseJson(rawData)
        data && onSession && onSession(data)
        return
    }

    if (eventName === 'message') {
        const data = safeParseJson(rawData)
        const content = data && typeof data.content === 'string' ? data.content : rawData
        onMessage && onMessage(content)
        return
    }

    if (eventName === 'done') {
        onDone && onDone(safeParseJson(rawData) || {})
        return
    }

    if (eventName === 'error') {
        onError && onError(new Error(rawData || '小智对话失败'))
    }
}

function safeParseJson(text) {
    try {
        return JSON.parse(text)
    } catch (error) {
        return null
    }
}
