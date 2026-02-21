// pages/xiaozhi/xiaozhi.js
const mockData = require('../../mock/xiaozhi.js');

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    tabBarHeight: 100, // tabBar高度，默认100rpx
    messages: [],
    inputText: '',
    selectedImage: '',
    scrollToView: '',
    messageIdCounter: 0,
    showDrawer: false, // 是否显示抽屉
    historyList: [], // 对话历史列表
    currentHistoryId: null, // 当前对话ID
    keyboardHeight: 0, // 键盘高度
    inputBottom: 0 // 输入框底部位置
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 计算导航栏高度
    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });

    // 如果从拍照页面跳转过来，带有图片
    if (options.image) {
      const decodedImage = decodeURIComponent(options.image);
      console.log('接收到的图片路径:', decodedImage);
      this.setData({
        selectedImage: decodedImage
      });
    }

    // 加载对话历史（使用mock数据）
    this.loadHistoryList();

    // 监听键盘高度变化
    wx.onKeyboardHeightChange(res => {
      console.log('键盘高度变化:', res.height);

      if (res.height > 0) {
        // 键盘弹起，立即调整输入框位置（不使用动画）
        this.setData({
          keyboardHeight: res.height,
          inputBottom: res.height
        });
        // 延迟滚动到底部
        setTimeout(() => {
          this.scrollToBottom();
        }, 50);
      } else {
        // 键盘收起，恢复原位
        this.setData({
          keyboardHeight: 0,
          inputBottom: 0
        });
      }
    });
  },

  // 输入框获得焦点
  onInputFocus(e) {
    console.log('输入框获得焦点', e);
  },

  // 输入框失去焦点
  onInputBlur(e) {
    console.log('输入框失去焦点', e);
  },

  onShow() {
    // 页面显示时滚动到底部
    if (this.data.messages.length > 0) {
      this.scrollToBottom();
    }
  },

  // 加载对话历史列表
  loadHistoryList() {
    // 使用mock数据
    this.setData({
      historyList: mockData.historyList
    });
  },

  // 保存当前对话到历史
  saveCurrentChat() {
    if (this.data.messages.length === 0) {
      return;
    }

    const historyList = [...this.data.historyList];
    const currentId = this.data.currentHistoryId || Date.now();

    // 获取第一条用户消息作为标题
    const firstUserMsg = this.data.messages.find(msg => msg.role === 'user');
    const title = firstUserMsg ? (firstUserMsg.content || '图片咨询') : '新对话';

    // 获取最后一条消息作为预览
    const lastMsg = this.data.messages[this.data.messages.length - 1];
    const preview = lastMsg.role === 'user'
      ? (lastMsg.content || '[图片]')
      : lastMsg.content.substring(0, 30) + '...';

    // 查找是否已存在
    const existIndex = historyList.findIndex(item => item.id === currentId);

    const historyItem = {
      id: currentId,
      title: title.substring(0, 20),
      preview: preview,
      time: this.getCurrentDateTime(),
      messages: this.data.messages
    };

    if (existIndex >= 0) {
      // 更新现有记录
      historyList[existIndex] = historyItem;
    } else {
      // 添加新记录到开头
      historyList.unshift(historyItem);
    }

    // 只保留最近20条
    if (historyList.length > 20) {
      historyList.length = 20;
    }

    this.setData({
      historyList: historyList,
      currentHistoryId: currentId
    });
  },

  // 显示历史对话
  showHistory() {
    this.setData({
      showDrawer: true
    });
  },

  // 隐藏历史对话
  hideHistory() {
    this.setData({
      showDrawer: false
    });
  },

  // 加载历史对话
  loadHistory(e) {
    const id = e.currentTarget.dataset.id;
    const history = this.data.historyList.find(item => item.id === id);

    if (history) {
      // 重新设置messageIdCounter
      const maxId = Math.max(...history.messages.map(msg => msg.id), 0);

      this.setData({
        messages: history.messages,
        currentHistoryId: id,
        messageIdCounter: maxId + 1,
        showDrawer: false
      });

      // 滚动到底部
      this.scrollToBottom();
    }
  },

  // 显示历史记录操作菜单
  showHistoryActions(e) {
    const id = e.currentTarget.dataset.id;

    wx.showActionSheet({
      itemList: ['删除对话'],
      itemColor: '#FF4444',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.deleteHistory(id);
        }
      }
    });
  },

  // 删除历史对话
  deleteHistory(id) {
    wx.showModal({
      title: '删除对话',
      content: '确定要删除这条对话记录吗？',
      confirmText: '删除',
      confirmColor: '#FF4444',
      success: (res) => {
        if (res.confirm) {
          const historyList = this.data.historyList.filter(item => item.id !== id);

          this.setData({
            historyList: historyList
          });

          // 如果删除的是当前对话，清空消息
          if (this.data.currentHistoryId === id) {
            this.setData({
              messages: [],
              currentHistoryId: null,
              messageIdCounter: 0
            });
          }

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 输入框输入
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          selectedImage: res.tempFilePaths[0]
        });
      }
    });
  },

  // 移除图片
  removeImage() {
    this.setData({
      selectedImage: ''
    });
  },

  // 发送消息
  sendMessage() {
    const { inputText, selectedImage } = this.data;

    console.log('发送消息 - 文本:', inputText, '图片:', selectedImage);

    // 如果没有文本也没有图片，不发送
    if (!inputText.trim() && !selectedImage) {
      return;
    }

    // 添加用户消息
    const userMessage = {
      id: this.data.messageIdCounter++,
      role: 'user',
      content: inputText.trim(),
      image: selectedImage,
      time: this.getCurrentTime()
    };

    console.log('用户消息对象:', userMessage);

    const messages = [...this.data.messages, userMessage];

    this.setData({
      messages: messages,
      inputText: '',
      selectedImage: ''
    });

    // 滚动到底部
    this.scrollToBottom();

    // 添加加载状态
    this.addLoadingMessage();

    // 模拟AI回复
    this.simulateAIResponse(userMessage);
  },

  // 添加加载消息
  addLoadingMessage() {
    const loadingMessage = {
      id: this.data.messageIdCounter++,
      role: 'loading'
    };

    this.setData({
      messages: [...this.data.messages, loadingMessage]
    });

    this.scrollToBottom();
  },

  // 移除加载消息
  removeLoadingMessage() {
    const messages = this.data.messages.filter(msg => msg.role !== 'loading');
    this.setData({
      messages: messages
    });
  },

  // 模拟AI回复
  simulateAIResponse(userMessage) {
    setTimeout(() => {
      this.removeLoadingMessage();

      let aiResponse = '';

      // 根据用户消息生成回复
      if (userMessage.image) {
        aiResponse = '我看到了这张图片。这是一份营养丰富的餐食，包含了优质蛋白质、碳水化合物和蔬菜。\n\n营养分析：\n• 热量：约450千卡\n• 蛋白质：28克\n• 碳水化合物：52克\n• 脂肪：12克\n\n建议：这是一份均衡的餐食，适合作为午餐或晚餐。如果是减脂期，可以适当减少主食的量。';
      } else if (userMessage.content.includes('食谱') || userMessage.content.includes('推荐')) {
        aiResponse = '根据你的需求，我为你推荐以下健康食谱：\n\n🥗 早餐：\n• 燕麦粥 + 水煮蛋 + 牛奶\n• 全麦面包 + 牛油果 + 番茄\n\n🍱 午餐：\n• 糙米饭 + 清蒸鱼 + 西兰花\n• 鸡胸肉沙拉 + 藜麦\n\n🍲 晚餐：\n• 蔬菜汤 + 豆腐 + 少量主食\n• 虾仁炒时蔬 + 紫薯\n\n这些食谱营养均衡，适合日常饮食。需要详细做法吗？';
      } else if (userMessage.content.includes('减肥') || userMessage.content.includes('减脂')) {
        aiResponse = '关于健康减脂，我有以下建议：\n\n1️⃣ 控制热量摄入\n每日热量赤字300-500千卡为宜\n\n2️⃣ 均衡营养\n• 蛋白质：1.5-2g/kg体重\n• 碳水：适量减少，优选粗粮\n• 脂肪：占总热量20-30%\n\n3️⃣ 规律饮食\n三餐定时，避免暴饮暴食\n\n4️⃣ 适量运动\n有氧+力量训练结合\n\n需要为你定制减脂食谱吗？';
      } else if (userMessage.content.includes('营养') || userMessage.content.includes('健康')) {
        aiResponse = '营养健康是饮食的核心。均衡的营养包括：\n\n🥚 蛋白质：肉、蛋、奶、豆类\n🍚 碳水化合物：全谷物、薯类\n🥑 健康脂肪：坚果、橄榄油、深海鱼\n🥬 维生素矿物质：新鲜蔬果\n💧 充足水分：每日1.5-2L\n\n建议每餐都包含这些营养素，保持多样化饮食。有具体问题可以继续问我！';
      } else {
        aiResponse = '你好！我是小智，你的智能营养顾问。\n\n我可以帮你：\n• 分析食物营养成分\n• 推荐健康食谱\n• 制定饮食计划\n• 解答营养问题\n\n请告诉我你的需求，我会尽力帮助你！';
      }

      const aiMessage = {
        id: this.data.messageIdCounter++,
        role: 'assistant',
        content: aiResponse,
        time: this.getCurrentTime()
      };

      this.setData({
        messages: [...this.data.messages, aiMessage]
      });

      this.scrollToBottom();

      // 保存对话到历史
      this.saveCurrentChat();
    }, 1500);
  },

  // 开始新对话
  startNewChat() {
    // 直接开启新对话，不需要确认
    // 保存当前对话（如果有内容）
    if (this.data.messages.length > 0) {
      this.saveCurrentChat();
    }

    // 清空当前对话
    this.setData({
      messages: [],
      inputText: '',
      selectedImage: '',
      messageIdCounter: 0,
      currentHistoryId: null
    });
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
      current: url
    });
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      const lastIndex = this.data.messages.length - 1;
      if (lastIndex >= 0) {
        this.setData({
          scrollToView: `msg-${lastIndex}`
        });
      }
    }, 100);
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 获取当前日期时间
  getCurrentDateTime() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }
})
