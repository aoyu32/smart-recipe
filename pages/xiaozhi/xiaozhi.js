import {
  getXiaozhiSessions,
  getXiaozhiMessages,
  deleteXiaozhiSession,
  streamXiaozhiChat,
  uploadXiaozhiImage
} from '../../api/xiaozhi'

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    tabBarHeight: 100,
    messages: [],
    inputText: '',
    selectedImage: '',
    uploadedImageUrl: '',
    isUploadingImage: false,
    imageUploadError: false,
    canSend: false,
    scrollToView: '',
    messageIdCounter: 0,
    showDrawer: false,
    historyList: [],
    currentHistoryId: null,
    keyboardHeight: 0,
    inputBottom: 0,
    isSending: false,
    currentRequestTask: null,
    scrollTop: 0
  },

  onLoad(options) {
    this.autoScrollEnabled = true
    this.programmaticScrolling = false
    this.userTouchingChat = false
    this.isStreamingResponse = false
    this.chatViewportHeight = 0
    this.forceBottomTimers = []
    this.streamingFollowTimer = null
    this.programmaticScrollResetTimer = null
    this.manualAbort = false

    const systemInfo = wx.getSystemInfoSync()
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight
    })

    if (options.image) {
      const initialImage = decodeURIComponent(options.image)
      if (/^https?:\/\//.test(initialImage)) {
        this.setData({
          selectedImage: initialImage,
          uploadedImageUrl: initialImage,
          isUploadingImage: false,
          imageUploadError: false
        }, () => {
          this.updateCanSend()
        })
      } else {
        this.setData({
          selectedImage: initialImage,
          uploadedImageUrl: '',
          isUploadingImage: true,
          imageUploadError: false
        }, () => {
          this.updateCanSend()
          this.uploadSelectedImage(initialImage)
        })
      }
    }

    this.loadHistoryList()

    wx.onKeyboardHeightChange((res) => {
      if (res.height > 0) {
        this.setData({
          keyboardHeight: res.height,
          inputBottom: res.height
        })
        setTimeout(() => {
          this.measureChatViewport()
          this.scrollToBottom(true)
        }, 50)
        return
      }

      this.setData({
        keyboardHeight: 0,
        inputBottom: 0
      })

      setTimeout(() => this.measureChatViewport(), 50)
    })
  },

  onReady() {
    this.measureChatViewport()
  },

  onShow() {
    if (this.data.messages.length > 0) {
      this.ensureBottomAfterRender(true)
    }
  },

  onUnload() {
    this.abortCurrentRequest()
    this.stopStreamingAutoScroll()
    this.clearForceBottomTimers()
    clearTimeout(this.programmaticScrollResetTimer)
  },

  async loadHistoryList() {
    try {
      const sessions = await getXiaozhiSessions()
      const historyList = (sessions || []).map(item => ({
        id: item.id,
        title: item.title || '新对话',
        preview: item.preview || '',
        time: this.formatHistoryTime(item.lastMessageAt)
      }))

      this.setData({ historyList })
    } catch (error) {
      console.error('加载会话列表失败', error)
    }
  },

  showHistory() {
    this.setData({ showDrawer: true })
  },

  hideHistory() {
    this.setData({ showDrawer: false })
  },

  async loadHistory(e) {
    const sessionId = e.currentTarget.dataset.id

    try {
      this.autoScrollEnabled = true
      const normalizedMessages = await this.fetchSessionMessages(sessionId)
      const maxId = this.getMaxMessageId(normalizedMessages)

      this.setData({
        messages: normalizedMessages,
        currentHistoryId: sessionId,
        messageIdCounter: maxId + 1,
        showDrawer: false
      }, () => {
        this.measureChatViewport()
        this.ensureBottomAfterRender(true)
      })
    } catch (error) {
      console.error('加载历史消息失败', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  showHistoryActions(e) {
    const sessionId = e.currentTarget.dataset.id

    wx.showActionSheet({
      itemList: ['删除对话'],
      itemColor: '#FF4444',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.deleteHistory(sessionId)
        }
      }
    })
  },

  deleteHistory(sessionId) {
    wx.showModal({
      title: '删除对话',
      content: '确定要删除这条对话记录吗？',
      confirmText: '删除',
      confirmColor: '#FF4444',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          await deleteXiaozhiSession(sessionId)
          const historyList = this.data.historyList.filter(item => item.id !== sessionId)
          this.setData({ historyList })

          if (this.data.currentHistoryId === sessionId) {
            this.startNewChat()
          }

          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
        } catch (error) {
          console.error('删除会话失败', error)
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    })
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    }, () => {
      this.updateCanSend()
    })
  },

  onInputFocus() {},

  onInputBlur() {},

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          selectedImage: tempFilePath,
          uploadedImageUrl: '',
          isUploadingImage: true,
          imageUploadError: false
        }, () => {
          this.updateCanSend()
          this.uploadSelectedImage(tempFilePath)
        })
      }
    })
  },

  removeImage() {
    this.setData({
      selectedImage: '',
      uploadedImageUrl: '',
      isUploadingImage: false,
      imageUploadError: false
    }, () => {
      this.updateCanSend()
    })
  },

  async sendMessage() {
    const content = (this.data.inputText || '').trim()
    const imageUrl = this.data.uploadedImageUrl

    if ((!content && !imageUrl) || this.data.isSending || !this.data.canSend) {
      return
    }

    this.autoScrollEnabled = true
    this.isStreamingResponse = true
    this.setData({
      isSending: true
    }, () => {
      this.updateCanSend()
    })

    try {
      const userMessage = this.decorateMessage({
        id: this.nextLocalId(),
        role: 'user',
        content,
        image: imageUrl || '',
        time: this.getCurrentTime()
      })

      this.setData({
        messages: [...this.data.messages, userMessage],
        inputText: '',
        selectedImage: '',
        uploadedImageUrl: '',
        isUploadingImage: false,
        imageUploadError: false
      }, () => {
        this.updateCanSend()
        this.ensureBottomAfterRender(true)
        this.addLoadingMessage()
        this.startStreamingAutoScroll()
      })

      const payload = {}
      this.manualAbort = false

      if (this.data.currentHistoryId) {
        payload.sessionId = this.data.currentHistoryId
      }
      if (content) {
        payload.content = content
      }
      if (imageUrl) {
        payload.imageUrl = imageUrl
      }

      const requestTask = streamXiaozhiChat(payload, {
        onSession: (sessionData) => {
          if (sessionData && sessionData.sessionId) {
            this.setData({
              currentHistoryId: sessionData.sessionId
            })
          }
        },
        onMessage: (chunk) => {
          this.removeLoadingMessage()
          this.appendAssistantChunk(chunk)
        },
        onDone: async (payloadData) => {
          this.manualAbort = false
          this.isStreamingResponse = false
          this.stopStreamingAutoScroll()
          this.finalizeAssistantMessage()
          this.setData({
            isSending: false,
            currentRequestTask: null
          }, () => {
            this.updateCanSend()
          })

          if (payloadData && payloadData.sessionId) {
            this.setData({
              currentHistoryId: payloadData.sessionId
            })
          }

          await this.reloadCurrentSession()
          await this.loadHistoryList()
          this.ensureBottomAfterRender(true)
        },
        onError: (error) => {
          if (this.isAbortError(error) && this.manualAbort) {
            this.manualAbort = false
            this.isStreamingResponse = false
            this.stopStreamingAutoScroll()
            return
          }

          this.manualAbort = false
          this.isStreamingResponse = false
          this.stopStreamingAutoScroll()
          this.removeLoadingMessage()
          this.setData({
            isSending: false,
            currentRequestTask: null
          }, () => {
            this.updateCanSend()
          })
          console.error('小智对话失败', error)
          wx.showToast({
            title: error.message || '发送失败',
            icon: 'none'
          })
        }
      })

      this.setData({
        currentRequestTask: requestTask
      })
    } catch (error) {
      this.isStreamingResponse = false
      this.stopStreamingAutoScroll()
      this.removeLoadingMessage()
      this.setData({
        isSending: false,
        currentRequestTask: null
      }, () => {
        this.updateCanSend()
      })
      console.error('发送消息失败', error)
      wx.showToast({
        title: error.message || '发送失败',
        icon: 'none'
      })
    }
  },

  addLoadingMessage() {
    this.setData({
      messages: [...this.data.messages, {
        id: this.nextLocalId(),
        role: 'loading'
      }]
    }, () => {
      this.ensureBottomAfterRender(true)
    })
  },

  removeLoadingMessage() {
    this.setData({
      messages: this.data.messages.filter(msg => msg.role !== 'loading')
    }, () => {
      if (this.autoScrollEnabled) {
        this.ensureBottomAfterRender(true)
      }
    })
  },

  appendAssistantChunk(chunk) {
    if (!chunk) {
      return
    }

    const messages = [...this.data.messages]
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
      lastMessage.content = (lastMessage.content || '') + chunk
      lastMessage.time = this.getCurrentTime()
    } else {
      messages.push(this.decorateMessage({
        id: this.nextLocalId(),
        role: 'assistant',
        content: chunk,
        image: '',
        time: this.getCurrentTime(),
        streaming: true
      }))
    }

    this.setData({ messages }, () => {
      if (this.autoScrollEnabled) {
        this.ensureBottomAfterRender(true)
      }
    })
  },

  finalizeAssistantMessage() {
    const messages = [...this.data.messages]
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.streaming) {
      delete lastMessage.streaming
      this.setData({ messages }, () => {
        this.ensureBottomAfterRender(true)
      })
    }
  },

  async reloadCurrentSession() {
    if (!this.data.currentHistoryId) {
      return
    }

    try {
      const normalizedMessages = await this.fetchSessionMessages(this.data.currentHistoryId)
      const maxId = this.getMaxMessageId(normalizedMessages)

      this.setData({
        messages: normalizedMessages,
        messageIdCounter: maxId + 1
      }, () => {
        this.measureChatViewport()
        this.ensureBottomAfterRender(true)
      })
    } catch (error) {
      console.error('刷新当前会话失败', error)
    }
  },

  startNewChat() {
    this.abortCurrentRequest()
    this.autoScrollEnabled = true
    this.isStreamingResponse = false
    this.stopStreamingAutoScroll()
    this.clearForceBottomTimers()
    this.setData({
      messages: [],
      inputText: '',
      selectedImage: '',
      uploadedImageUrl: '',
      isUploadingImage: false,
      imageUploadError: false,
      canSend: false,
      messageIdCounter: 0,
      currentHistoryId: null,
      isSending: false,
      showDrawer: false,
      currentRequestTask: null,
      scrollTop: 0
    })
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  onChatScroll(e) {
    if (this.programmaticScrolling && !this.userTouchingChat) {
      return
    }

    const detail = e.detail || {}
    const scrollTop = Number(detail.scrollTop) || 0
    const scrollHeight = Number(detail.scrollHeight) || 0
    const viewportHeight = this.chatViewportHeight || 0

    if (!viewportHeight) {
      this.measureChatViewport()
      return
    }

    if (!scrollHeight) {
      return
    }

    const distanceToBottom = scrollHeight - scrollTop - viewportHeight
    const isNearBottom = distanceToBottom <= 80

    if (isNearBottom) {
      this.autoScrollEnabled = true
      if (this.isStreamingResponse) {
        this.startStreamingAutoScroll()
      }
      return
    }

    this.autoScrollEnabled = false
    this.stopStreamingAutoScroll()
    this.clearForceBottomTimers()
  },

  onChatTouchStart() {
    this.userTouchingChat = true
    this.programmaticScrolling = false
    clearTimeout(this.programmaticScrollResetTimer)
  },

  onChatTouchMove() {
    this.pauseAutoScrollByUser()
  },

  onChatTouchEnd() {
    this.userTouchingChat = false
  },

  pauseAutoScrollByUser() {
    this.autoScrollEnabled = false
    this.programmaticScrolling = false
    this.stopStreamingAutoScroll()
    this.clearForceBottomTimers()
    clearTimeout(this.programmaticScrollResetTimer)
  },

  scrollToBottom(force = false) {
    this.scrollToBottomInternal(force)
  },

  scrollToBottomInternal(force = false) {
    if (!this.autoScrollEnabled) {
      return
    }

    this.programmaticScrolling = true
    this.setData({
      scrollTop: (this.data.scrollTop || 0) + 100000
    })

    clearTimeout(this.programmaticScrollResetTimer)
    this.programmaticScrollResetTimer = setTimeout(() => {
      this.programmaticScrolling = false
    }, 80)
  },

  ensureBottomAfterRender(force = false) {
    if (!force && !this.autoScrollEnabled) {
      return
    }

    this.clearForceBottomTimers()
    ;[0, 80, 180, 320].forEach((delay) => {
      const timer = setTimeout(() => {
        this.measureChatViewport()
        this.scrollToBottomInternal(true)
      }, delay)
      this.forceBottomTimers.push(timer)
    })
  },

  startStreamingAutoScroll() {
    if (!this.autoScrollEnabled || this.streamingFollowTimer) {
      return
    }

    this.streamingFollowTimer = setInterval(() => {
      if (!this.isStreamingResponse || !this.autoScrollEnabled) {
        this.stopStreamingAutoScroll()
        return
      }

      this.measureChatViewport()
      this.scrollToBottomInternal(true)
    }, 120)
  },

  stopStreamingAutoScroll() {
    if (this.streamingFollowTimer) {
      clearInterval(this.streamingFollowTimer)
      this.streamingFollowTimer = null
    }
  },

  clearForceBottomTimers() {
    ;(this.forceBottomTimers || []).forEach(timer => clearTimeout(timer))
    this.forceBottomTimers = []
  },

  measureChatViewport() {
    const query = wx.createSelectorQuery()
    query.select('.chat-messages').boundingClientRect()
    query.exec((res) => {
      const rect = res && res[0]
      if (rect && rect.height) {
        this.chatViewportHeight = rect.height
      }
    })
  },

  async uploadSelectedImage(imagePath) {
    if (!imagePath) {
      this.setData({
        uploadedImageUrl: '',
        isUploadingImage: false,
        imageUploadError: false
      }, () => {
        this.updateCanSend()
      })
      return
    }

    wx.showLoading({
      title: '上传图片中...',
      mask: true
    })

    try {
      const imageUrl = await uploadXiaozhiImage(imagePath)
      wx.hideLoading()
      if (this.data.selectedImage !== imagePath) {
        return
      }

      this.setData({
        uploadedImageUrl: imageUrl,
        isUploadingImage: false,
        imageUploadError: false
      }, () => {
        this.updateCanSend()
      })
    } catch (error) {
      wx.hideLoading()
      if (this.data.selectedImage !== imagePath) {
        return
      }

      this.setData({
        uploadedImageUrl: '',
        isUploadingImage: false,
        imageUploadError: true
      }, () => {
        this.updateCanSend()
      })

      wx.showToast({
        title: error.message || '图片上传失败',
        icon: 'none'
      })
    }
  },

  updateCanSend() {
    const hasText = !!(this.data.inputText || '').trim()
    const hasSelectedImage = !!this.data.selectedImage
    const hasUploadedImage = !!this.data.uploadedImageUrl
    const canSend = !this.data.isSending
      && !this.data.isUploadingImage
      && (hasText || hasUploadedImage)
      && (!hasSelectedImage || hasUploadedImage)

    if (canSend !== this.data.canSend) {
      this.setData({ canSend })
    }
  },

  async fetchSessionMessages(sessionId) {
    const messages = await getXiaozhiMessages(sessionId)
    return (messages || []).map(item => this.normalizeMessage(item))
  },

  getMaxMessageId(messages) {
    return messages.reduce((max, item) => {
      const id = Number(item.id) || 0
      return Math.max(max, id)
    }, 0)
  },

  normalizeMessage(item) {
    return this.decorateMessage({
      id: item.id,
      role: item.role,
      content: item.content || '',
      image: item.imageUrl || '',
      time: this.formatMessageTime(item.createdAt)
    })
  },

  decorateMessage(message) {
    return {
      id: message.id,
      role: message.role,
      content: message.content || '',
      image: message.image || '',
      time: message.time || this.getCurrentTime(),
      streaming: !!message.streaming
    }
  },

  abortCurrentRequest() {
    const task = this.data.currentRequestTask
    if (!task || !task.abort) {
      return
    }

    try {
      this.manualAbort = true
      this.isStreamingResponse = false
      this.stopStreamingAutoScroll()
      task.abort()
    } catch (error) {
      console.error('终止请求失败', error)
    }
  },

  isAbortError(error) {
    const message = (error && (error.errMsg || error.message)) || ''
    return /abort/i.test(message)
  },

  formatMessageTime(dateTime) {
    if (!dateTime) {
      return this.getCurrentTime()
    }

    const date = new Date(String(dateTime).replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) {
      return this.getCurrentTime()
    }

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  },

  formatHistoryTime(dateTime) {
    if (!dateTime) {
      return ''
    }

    const date = new Date(String(dateTime).replace(' ', 'T'))
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  },

  nextLocalId() {
    const nextId = this.data.messageIdCounter + 1
    this.setData({
      messageIdCounter: nextId
    })
    return nextId
  },

  getCurrentTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
})
