// pages/take-picture/take-picture.js
let cameraContext = null;

Page({
  data: {
    currentStep: 'capture', // capture: 拍摄, action: 选择操作
    capturedImagePath: '',
    statusBarHeight: 0,
    menuButtonInfo: {},
    frameSize: 0,
    
    // 缩放相关
    zoomLevel: 1,
    isZooming: false,
    touchStartDistance: 0,
    initialZoom: 1
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    
    // 计算框框大小（屏幕宽度 - 左右边距）
    const frameSize = systemInfo.windowWidth - 60;
    
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      frameSize: frameSize
    });
    
    // 创建相机上下文
    cameraContext = wx.createCameraContext();
  },

  onShow() {
    // 页面显示时，如果不在拍摄状态，重置
    if (this.data.currentStep !== 'capture') {
      this.resetPage();
    }
  },

  onHide() {
    // 页面隐藏时停止相机
    this.stopCamera();
  },

  onUnload() {
    // 页面卸载时停止相机
    this.stopCamera();
  },

  // 停止相机
  stopCamera() {
    // 相机组件会在页面隐藏时自动停止，无需手动调用
    // 只需重置页面状态
    this.resetPage();
  },

  // 重置页面
  resetPage() {
    this.setData({
      currentStep: 'capture',
      capturedImagePath: '',
      zoomLevel: 1,
      isZooming: false,
      touchStartDistance: 0,
      initialZoom: 1
    });
  },

  // 触摸开始
  onTouchStart(e) {
    if (e.touches.length === 2) {
      // 双指触摸，记录初始距离
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = this.getDistance(touch1, touch2);
      
      this.setData({
        touchStartDistance: distance,
        initialZoom: this.data.zoomLevel,
        isZooming: true
      });
    }
  },

  // 触摸移动
  onTouchMove(e) {
    if (e.touches.length === 2) {
      // 双指缩放
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = this.getDistance(touch1, touch2);
      
      // 计算缩放比例
      const scale = distance / this.data.touchStartDistance;
      let newZoom = this.data.initialZoom * scale;
      
      // 限制缩放范围 1-3倍
      newZoom = Math.max(1, Math.min(3, newZoom));
      
      this.setData({
        zoomLevel: parseFloat(newZoom.toFixed(1))
      });
      
      // 设置相机缩放
      if (cameraContext) {
        cameraContext.setZoom({
          zoom: newZoom
        });
      }
    }
  },

  // 触摸结束
  onTouchEnd(e) {
    if (e.touches.length < 2) {
      // 延迟隐藏缩放指示器
      setTimeout(() => {
        this.setData({
          isZooming: false
        });
      }, 500);
    }
  },

  // 计算两点距离
  getDistance(touch1, touch2) {
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
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

  // 裁剪图片到框框大小
  cropToFrame(imagePath) {
    const frameSize = this.data.frameSize;
    
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
              this.setData({
                capturedImagePath: res.tempFilePath,
                currentStep: 'action'
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('裁剪失败:', err);
              // 如果裁剪失败，直接使用原图
              this.setData({
                capturedImagePath: imagePath,
                currentStep: 'action'
              });
            }
          }, this);
        });
      },
      fail: () => {
        wx.hideLoading();
        // 获取图片信息失败，直接使用原图
        this.setData({
          capturedImagePath: imagePath,
          currentStep: 'action'
        });
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
    this.resetPage();
  },

  // 饮食打卡
  onMealCheckin() {
    wx.showActionSheet({
      itemList: ['早餐打卡', '午餐打卡', '晚餐打卡'],
      success: (res) => {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealNames = ['早餐', '午餐', '晚餐'];
        const selectedMeal = mealNames[res.tapIndex];
        
        wx.showLoading({ title: '上传中...' });
        
        // TODO: 上传图片到服务器
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: `${selectedMeal}打卡成功`,
            icon: 'success'
          });
          
          // 返回首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        }, 1000);
      }
    });
  },

  // 询问小智
  askXiaozhi() {
    wx.showLoading({ title: '分析中...' });
    
    // TODO: 调用AI接口分析图片
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '小智分析',
        content: '这是一份营养均衡的餐食，包含优质蛋白质和丰富的蔬菜。建议搭配一些主食，总热量约450千卡。',
        confirmText: '知道了',
        showCancel: false
      });
    }, 1500);
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
