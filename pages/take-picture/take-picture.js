// pages/take-picture/take-picture.js
let cameraContext = null;

Page({
  data: {
    currentStep: 'capture', // capture: 拍摄, action: 选择操作
    capturedImagePath: '',
    statusBarHeight: 0,
    menuButtonInfo: {},
    frameSize: 0,
    
    // 内容区域
    showContent: false,
    contentType: '', // 'meal' 或 'ai'
    
    // 饮食打卡数据
    mealCheckinList: [
      {
        type: 'breakfast',
        label: '早餐',
        icon: '/assets/index/icon-zaocan.png',
        calories: 0,
        checked: false,
        foods: [{ id: 'placeholder-breakfast', placeholder: true, image: '', name: '', calories: 0 }]
      },
      {
        type: 'lunch',
        label: '午餐',
        icon: '/assets/index/icon-wucan.png',
        calories: 0,
        checked: false,
        foods: [{ id: 'placeholder-lunch', placeholder: true, image: '', name: '', calories: 0 }]
      },
      {
        type: 'dinner',
        label: '晚餐',
        icon: '/assets/index/icon-wancan.png',
        calories: 0,
        checked: false,
        foods: [{ id: 'placeholder-dinner', placeholder: true, image: '', name: '', calories: 0 }]
      }
    ],
    
    // 当前选中的餐次类型（用于添加食物）
    currentMealType: '',
    
    // AI回复
    aiResponseList: [],
    aiLoading: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 计算框框大小（屏幕宽度 - 左右边距，留一点边距）
    const frameSize = systemInfo.windowWidth - 40;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      frameSize: frameSize
    });
  },

  // 相机准备就绪
  onCameraReady() {
    // 相机组件ready后创建上下文
    cameraContext = wx.createCameraContext();
  },

  onShow() {
    // 页面显示时，重置为拍摄状态
    // 确保每次进入页面都显示拍摄界面
    this.setData({
      currentStep: 'capture',
      capturedImagePath: '',
      showContent: false,
      contentType: '',
      aiResponseList: [],
      aiLoading: false,
      currentMealType: ''
    });
  },

  onHide() {
    // 页面隐藏时关闭摄像头
    // 将currentStep改为非'capture'状态，这样camera组件会被销毁
    if (this.data.currentStep === 'capture') {
      this.setData({
        currentStep: 'action'
      });
    }
    // 重置相机上下文
    cameraContext = null;
  },

  onUnload() {
    // 页面卸载时关闭摄像头
    // 将currentStep改为非'capture'状态，这样camera组件会被销毁
    if (this.data.currentStep === 'capture') {
      this.setData({
        currentStep: 'action'
      });
    }
    // 重置相机上下文
    cameraContext = null;
  },

  // 重置页面
  resetPage() {
    // 重置相机上下文
    cameraContext = null;
    
    this.setData({
      currentStep: 'capture',
      capturedImagePath: '',
      showContent: false,
      contentType: '',
      aiResponseList: [],
      aiLoading: false,
      currentMealType: ''
    });
  },

  // 拍照
  takePhoto() {
    if (!cameraContext) {
      cameraContext = wx.createCameraContext();
    }
    
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        // 裁剪图片到框框大小
        this.cropToFrame(res.tempImagePath);
      },
      fail: (err) => {
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        });
        console.error('拍照失败:', err);
      }
    });
  },

  // 为所有餐次添加预填充项（如果还没有的话）
  addPlaceholderIfNeeded() {
    const mealCheckinList = this.data.mealCheckinList.map(item => {
      // 检查是否已有预填充项
      const hasPlaceholder = (item.foods || []).some(f => f.placeholder);
      
      if (!hasPlaceholder) {
        // 如果没有预填充项，添加一个
        const foods = [...(item.foods || [])];
        foods.push({
          id: `placeholder-${item.type}-${Date.now()}`,
          placeholder: true,
          image: '',
          name: '',
          calories: 0
        });
        
        return {
          ...item,
          foods: foods
        };
      }
      
      return item;
    });
    
    this.setData({ mealCheckinList });
  },

  // 裁剪图片到框框大小
  cropToFrame(imagePath) {
    const frameSize = this.data.frameSize;
    const currentMealType = this.data.currentMealType; // 保存当前状态，避免在异步过程中被修改
    
    wx.showLoading({ title: '处理中...' });
    
    // 获取图片信息
    wx.getImageInfo({
      src: imagePath,
      success: (imageInfo) => {
        const canvas = wx.createCanvasContext('cropCanvas', this);
        
        // 计算裁剪区域（居中裁剪正方形）
        const imgWidth = imageInfo.width;
        const imgHeight = imageInfo.height;
        const cropSize = Math.min(imgWidth, imgHeight);
        const cropX = (imgWidth - cropSize) / 2;
        const cropY = (imgHeight - cropSize) / 2;
        
        // 绘制裁剪后的图片
        canvas.drawImage(
          imagePath,
          cropX, cropY, cropSize, cropSize,
          0, 0, frameSize, frameSize
        );
        
        canvas.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'cropCanvas',
            destWidth: frameSize,
            destHeight: frameSize,
            success: (res) => {
              wx.hideLoading();
              // 为所有餐次添加预填充项（如果还没有的话）
              this.addPlaceholderIfNeeded();
              
              // 如果是从添加食物进入的，直接显示打卡列表
              if (currentMealType) {
                this.setData({
                  capturedImagePath: res.tempFilePath,
                  currentStep: 'action',
                  showContent: true,
                  contentType: 'meal'
                });
              } else {
                // 拍摄后默认激活饮食打卡
                this.setData({
                  capturedImagePath: res.tempFilePath,
                  currentStep: 'action',
                  showContent: true,
                  contentType: 'meal'
                });
              }
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('裁剪失败:', err);
              // 为所有餐次添加预填充项（如果还没有的话）
              this.addPlaceholderIfNeeded();
              
              // 如果裁剪失败，直接使用原图
              if (currentMealType) {
                this.setData({
                  capturedImagePath: imagePath,
                  currentStep: 'action',
                  showContent: true,
                  contentType: 'meal'
                });
              } else {
                // 拍摄后默认激活饮食打卡
                this.setData({
                  capturedImagePath: imagePath,
                  currentStep: 'action',
                  showContent: true,
                  contentType: 'meal'
                });
              }
            }
          }, this);
        });
      },
      fail: () => {
        wx.hideLoading();
        // 为所有餐次添加预填充项（如果还没有的话）
        this.addPlaceholderIfNeeded();
        
        // 获取图片信息失败，直接使用原图
        if (currentMealType) {
          this.setData({
            capturedImagePath: imagePath,
            currentStep: 'action',
            showContent: true,
            contentType: 'meal'
          });
        } else {
          // 拍摄后默认激活饮食打卡
          this.setData({
            capturedImagePath: imagePath,
            currentStep: 'action',
            showContent: true,
            contentType: 'meal'
          });
        }
      }
    });
  },

  // 从相册选择
  chooseFromAlbum() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        this.cropToFrame(res.tempFilePaths[0]);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
      }
    });
  },

  // 重新拍摄
  retake() {
    this.setData({
      currentStep: 'capture',
      showContent: false,
      contentType: '',
      aiResponseList: [],
      aiLoading: false,
      capturedImagePath: '',
      currentMealType: ''
    });
  },

  // 饮食打卡
  onMealCheckin() {
    // 显示打卡列表
    this.setData({
      showContent: true,
      contentType: 'meal'
    });
  },

  // 添加食物（点击添加食物按钮，生成新的预填充项，然后返回拍摄界面）
  onAddFood(e) {
    const mealType = e.currentTarget.dataset.type;
    const mealItem = this.data.mealCheckinList.find(item => item.type === mealType);
    
    if (!mealItem) return;
    
    // 为该餐次添加一个新的预填充项
    const mealCheckinList = this.data.mealCheckinList.map(item => {
      if (item.type === mealType) {
        const foods = [...(item.foods || [])];
        
        // 检查是否已有预填充项，如果没有则添加一个
        const hasPlaceholder = foods.some(f => f.placeholder);
        if (!hasPlaceholder) {
          foods.push({
            id: `placeholder-${mealType}-${Date.now()}`,
            placeholder: true,
            image: '',
            name: '',
            calories: 0
          });
        }
        
        return {
          ...item,
          foods: foods
        };
      }
      return item;
    });
    
    // 保存当前选中的餐次类型，返回拍摄界面
    this.setData({
      mealCheckinList: mealCheckinList,
      currentMealType: mealType,
      currentStep: 'capture',
      showContent: false,
      capturedImagePath: ''
    });
  },

  // 点击预填充列表项，将当前拍摄的图片添加到该项
  onFillPlaceholder(e) {
    const mealType = e.currentTarget.dataset.type;
    const placeholderId = e.currentTarget.dataset.id;
    
    // 检查是否有拍摄的图片
    if (!this.data.capturedImagePath) {
      wx.showToast({
        title: '请先拍摄或选择图片',
        icon: 'none'
      });
      return;
    }
    
    const mealItem = this.data.mealCheckinList.find(item => item.type === mealType);
    if (!mealItem) return;
    
    // 生成食物信息
    const foodData = {
      id: Date.now(),
      image: this.data.capturedImagePath,
      name: this.generateFoodName(), // 生成食物名称（实际应该调用AI识别）
      calories: this.generateCalories(), // 生成热量（实际应该调用AI识别）
      placeholder: false
    };
    
    // 更新打卡列表：将预填充项转换为实际食物
    const mealCheckinList = this.data.mealCheckinList.map(item => {
      if (item.type === mealType) {
        // 将预填充项替换为实际食物
        const foods = item.foods.map(food => {
          if (food.id === placeholderId && food.placeholder) {
            return foodData;
          }
          return food;
        });
        
        const totalCalories = foods.filter(f => !f.placeholder).reduce((sum, food) => sum + (food.calories || 0), 0);
        
        return {
          ...item,
          foods: foods,
          calories: totalCalories,
          checked: foods.filter(f => !f.placeholder).length > 0
        };
      }
      return item;
    });
    
    this.setData({ mealCheckinList });
    
    wx.showToast({
      title: `已添加到${mealItem.label}`,
      icon: 'success',
      duration: 1500
    });
  },

  // 删除食物（转换为预填充状态）
  onDeleteFood(e) {
    const mealType = e.currentTarget.dataset.type;
    const foodId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食物吗？',
      success: (res) => {
        if (res.confirm) {
          const mealCheckinList = this.data.mealCheckinList.map(item => {
            if (item.type === mealType) {
              // 将食物转换为预填充项，而不是删除
              let foods = (item.foods || []).map(food => {
                if (food.id === foodId && !food.placeholder) {
                  return {
                    id: foodId,
                    placeholder: true,
                    image: '',
                    name: '',
                    calories: 0
                  };
                }
                return food;
              });
              
              // 检查预填充项数量，如果多于一个，删除多余的，只保留第一个
              const placeholders = foods.filter(f => f.placeholder);
              if (placeholders.length > 1) {
                // 保留第一个预填充项，删除其他的
                let foundFirst = false;
                foods = foods.filter(food => {
                  if (food.placeholder) {
                    if (!foundFirst) {
                      foundFirst = true;
                      return true; // 保留第一个
                    }
                    return false; // 删除多余的
                  }
                  return true; // 保留所有非预填充项
                });
              }
              
              const totalCalories = foods.filter(f => !f.placeholder).reduce((sum, food) => sum + (food.calories || 0), 0);
              
              return {
                ...item,
                foods: foods,
                calories: totalCalories,
                checked: foods.filter(f => !f.placeholder).length > 0
              };
            }
            return item;
          });
          
          this.setData({ mealCheckinList });
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 生成食物名称（模拟，实际应该调用AI识别）
  generateFoodName() {
    const names = ['番茄炒蛋', '宫保鸡丁', '麻婆豆腐', '红烧肉', '清炒时蔬', '水煮鱼', '糖醋排骨'];
    return names[Math.floor(Math.random() * names.length)];
  },

  // 生成热量（模拟，实际应该调用AI识别）
  generateCalories() {
    return Math.floor(Math.random() * 300) + 200; // 200-500千卡
  },

  // 询问小智
  askXiaozhi() {
    // 显示AI回复区域
    this.setData({
      showContent: true,
      contentType: 'ai',
      aiResponseList: [],
      aiLoading: true
    });
    
    // 模拟流式渲染AI回复
    this.simulateAIResponse();
  },

  // 模拟AI流式回复
  simulateAIResponse() {
    const fullResponse = '这是一份营养均衡的餐食，包含优质蛋白质和丰富的蔬菜。\n\n主要营养成分：\n• 蛋白质：约25g\n• 碳水化合物：约30g\n• 脂肪：约15g\n• 总热量：约450千卡\n\n建议：\n1. 可以搭配一些主食，如米饭或全麦面包\n2. 建议增加一些水果作为餐后甜点\n3. 整体营养搭配合理，适合作为正餐';
    
    const sentences = fullResponse.split('\n');
    let currentIndex = 0;
    
    const addNextSentence = () => {
      if (currentIndex < sentences.length) {
        const newList = [...this.data.aiResponseList, sentences[currentIndex]];
        this.setData({
          aiResponseList: newList,
          aiLoading: currentIndex < sentences.length - 1
        });
        currentIndex++;
        
        // 模拟流式输出，每200ms添加一句
        setTimeout(addNextSentence, 200);
      } else {
        this.setData({ aiLoading: false });
      }
    };
    
    addNextSentence();
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 错误处理
  onCameraError(e) {
    console.error('相机错误:', e.detail);
    wx.showModal({
      title: '提示',
      content: '无法访问相机，请检查权限设置',
      showCancel: false
    });
  }
})
