// pages/take-picture/take-picture.js
import { analyzeFoodCheckin, uploadRecipeImage, saveFoodCheckin, deleteFoodCheckin, getTodayCheckin, analyzeRecipeStream } from '../../api/recipe';

let cameraContext = null;

Page({
  data: {
    currentStep: 'capture', // capture: 拍摄, action: 选择操作, hidden: 隐藏状态
    capturedImagePath: '',
    capturedImageUrl: '', // 上传到OSS后的URL
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
        recognizing: false, // 是否正在识别中
        foods: [{ id: 'placeholder-breakfast', placeholder: true, image: '', name: '', calories: 0 }]
      },
      {
        type: 'lunch',
        label: '午餐',
        icon: '/assets/index/icon-wucan.png',
        calories: 0,
        checked: false,
        recognizing: false,
        foods: [{ id: 'placeholder-lunch', placeholder: true, image: '', name: '', calories: 0 }]
      },
      {
        type: 'dinner',
        label: '晚餐',
        icon: '/assets/index/icon-wancan.png',
        calories: 0,
        checked: false,
        recognizing: false,
        foods: [{ id: 'placeholder-dinner', placeholder: true, image: '', name: '', calories: 0 }]
      }
    ],

    // 当前选中的餐次类型（用于添加食物）
    currentMealType: '',

    // AI回复
    aiResponseList: [],
    aiLoading: false,

    // 页面是否已初始化
    pageInitialized: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 计算框框大小（屏幕宽度 - 左右边距，留一点边距）
    const frameSize = systemInfo.windowWidth - 40;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      menuButtonInfo: menuButtonInfo,
      frameSize: frameSize,
      pageInitialized: true
    });

    // 加载今日打卡记录
    this.loadTodayCheckin();
  },

  // 相机准备就绪
  onCameraReady() {
    // 相机组件ready后创建上下文
    cameraContext = wx.createCameraContext();
  },

  // 加载今日打卡记录
  async loadTodayCheckin() {
    try {
      const result = await getTodayCheckin();

      console.log('今日打卡记录：', result);

      // 检查是否有任何餐次已打卡
      const hasCheckedMeal = result.meals.some(meal => meal.checked);

      if (hasCheckedMeal) {
        // 如果有打卡记录，直接进入饮食打卡页面
        // 转换数据格式
        const mealCheckinList = result.meals.map(meal => {
          const foods = meal.foods.map(food => ({
            id: food.id,
            image: food.food_image,
            name: food.food_name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            amount: food.amount,
            confidence: food.confidence,
            placeholder: false
          }));

          // 如果没有食物，添加一个预填充项
          if (foods.length === 0) {
            foods.push({
              id: `placeholder-${meal.meal_type}`,
              placeholder: true,
              image: '',
              name: '',
              calories: 0
            });
          }

          return {
            type: meal.meal_type,
            label: meal.label,
            icon: this.getMealIcon(meal.meal_type),
            calories: meal.calories,
            checked: meal.checked,
            recognizing: false,
            foods: foods
          };
        });

        this.setData({
          mealCheckinList: mealCheckinList,
          currentStep: 'action',
          showContent: true,
          contentType: 'meal',
          capturedImagePath: ''  // 图片为空
        });
      }
    } catch (error) {
      console.error('加载今日打卡记录失败：', error);
      // 加载失败不影响正常使用，继续显示拍摄界面
    }
  },

  // 获取餐次图标
  getMealIcon(mealType) {
    const iconMap = {
      'breakfast': '/assets/index/icon-zaocan.png',
      'lunch': '/assets/index/icon-wucan.png',
      'dinner': '/assets/index/icon-wancan.png'
    };
    return iconMap[mealType] || '';
  },

  onShow() {
    // 页面显示时，只在首次进入时初始化为拍摄状态
    // 如果是从hidden状态返回，恢复到capture状态
    if (this.data.currentStep === 'hidden') {
      this.setData({
        currentStep: 'capture'
      });
    }
  },

  onHide() {
    // 页面隐藏时关闭摄像头
    // 将currentStep改为非'capture'状态，这样camera组件会被销毁
    if (this.data.currentStep === 'capture') {
      this.setData({
        currentStep: 'hidden'  // 使用特殊状态标记
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
        currentStep: 'hidden'
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
        // 计算裁剪区域（居中裁剪正方形）
        const imgWidth = imageInfo.width;
        const imgHeight = imageInfo.height;
        const cropSize = Math.min(imgWidth, imgHeight);
        const cropX = (imgWidth - cropSize) / 2;
        const cropY = (imgHeight - cropSize) / 2;

        // 使用更高的分辨率进行裁剪，保证图片质量
        const canvasSize = Math.min(cropSize, 1500); // 限制最大尺寸为1500px

        const canvas = wx.createCanvasContext('cropCanvas', this);

        // 绘制裁剪后的图片
        canvas.drawImage(
          imagePath,
          cropX, cropY, cropSize, cropSize,
          0, 0, canvasSize, canvasSize
        );

        canvas.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'cropCanvas',
            x: 0,
            y: 0,
            width: canvasSize,
            height: canvasSize,
            destWidth: canvasSize,
            destHeight: canvasSize,
            fileType: 'jpg',
            quality: 0.9,
            success: (res) => {
              wx.hideLoading();
              console.log('裁剪成功:', res.tempFilePath);
              // 为所有餐次添加预填充项（如果还没有的话）
              this.addPlaceholderIfNeeded();

              // 重置相机上下文，确保摄像头关闭
              cameraContext = null;

              // 拍摄完成后，默认激活饮食打卡界面
              this.setData({
                capturedImagePath: res.tempFilePath,
                currentStep: 'action',
                showContent: true,
                contentType: 'meal'
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('裁剪失败:', err);
              // 为所有餐次添加预填充项（如果还没有的话）
              this.addPlaceholderIfNeeded();

              // 重置相机上下文，确保摄像头关闭
              cameraContext = null;

              // 如果裁剪失败，直接使用原图，默认激活饮食打卡界面
              this.setData({
                capturedImagePath: imagePath,
                currentStep: 'action',
                showContent: true,
                contentType: 'meal'
              });
            }
          }, this);
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('获取图片信息失败:', err);
        // 为所有餐次添加预填充项（如果还没有的话）
        this.addPlaceholderIfNeeded();

        // 重置相机上下文，确保摄像头关闭
        cameraContext = null;

        // 获取图片信息失败，直接使用原图，默认激活饮食打卡界面
        this.setData({
          capturedImagePath: imagePath,
          currentStep: 'action',
          showContent: true,
          contentType: 'meal'
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
    this.setData({
      currentStep: 'capture',
      showContent: false,
      contentType: '',
      aiResponseList: [],
      aiLoading: false,
      capturedImagePath: '',
      capturedImageUrl: '',  // 清空OSS图片URL
      currentMealType: ''
    });
  },

  // 饮食打卡
  onMealCheckin() {
    // 如果还没有上传图片到OSS，先上传
    if (!this.data.capturedImageUrl && this.data.capturedImagePath) {
      this.uploadImageToOSS();
    }

    // 显示打卡列表
    this.setData({
      showContent: true,
      contentType: 'meal'
    });
  },

  // 上传图片到OSS
  async uploadImageToOSS() {
    if (!this.data.capturedImagePath) {
      return;
    }

    wx.showLoading({ title: '上传图片中...' });

    try {
      const imageUrl = await uploadRecipeImage(this.data.capturedImagePath);
      this.setData({
        capturedImageUrl: imageUrl
      });
      wx.hideLoading();
      console.log('图片上传成功，URL：', imageUrl);
    } catch (error) {
      wx.hideLoading();
      console.error('图片上传失败：', error);
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      });
    }
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
      capturedImagePath: '',
      capturedImageUrl: ''  // 清空OSS图片URL，重新上传新图片
    });
  },

  // 点击预填充列表项，将当前拍摄的图片添加到该项
  // 点击预填充列表项，将当前拍摄的图片添加到该项
  async onFillPlaceholder(e) {
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

    // 检查是否有任何餐次正在识别中
    const isAnyRecognizing = this.data.mealCheckinList.some(item => item.recognizing);
    if (isAnyRecognizing) {
      wx.showToast({
        title: '请等待当前识别完成',
        icon: 'none'
      });
      return;
    }

    // 设置该餐次为识别中状态
    this.setMealRecognizing(mealType, true);

    try {
      // 1. 如果还没有上传图片到OSS，先上传
      let imageUrl = this.data.capturedImageUrl;
      if (!imageUrl) {
        imageUrl = await uploadRecipeImage(this.data.capturedImagePath);
        this.setData({
          capturedImageUrl: imageUrl
        });
        console.log('图片上传成功，URL：', imageUrl);
      }

      // 2. 调用AI识别接口（不显示loading，使用自定义识别中状态）
      const result = await analyzeFoodCheckin(imageUrl, mealType);

      console.log('AI识别结果：', result);

      // 检查识别置信度，如果太低则提示用户
      if (result.confidence < 0.3) {
        wx.showModal({
          title: '识别失败',
          content: result.food_name || '无法识别食物，请重新拍摄清晰的照片',
          showCancel: false,
          success: () => {
            // 取消识别中状态
            this.setMealRecognizing(mealType, false);
          }
        });
        return;
      }

      // 3. 生成食物信息
      const foodData = {
        id: Date.now(),
        image: this.data.capturedImagePath,
        name: result.food_name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        amount: result.amount,
        confidence: result.confidence,
        placeholder: false
      };

      // 4. 保存到数据库
      try {
        const foodId = await saveFoodCheckin({
          food_image: imageUrl,
          meal_type: mealType,
          food_name: result.food_name,
          calories: result.calories,
          protein: result.protein,
          carbs: result.carbs,
          fat: result.fat,
          amount: result.amount,
          confidence: result.confidence
        });

        // 保存成功后，将数据库ID赋值给foodData
        foodData.id = foodId;

        // 设置全局标志，通知首页刷新打卡数据
        const app = getApp();
        app.globalData.needRefreshCheckin = true;

        console.log('食物打卡保存成功，ID：', foodId);
      } catch (saveError) {
        console.error('保存食物打卡失败：', saveError);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
        // 取消识别中状态
        this.setMealRecognizing(mealType, false);
        return;
      }

      // 5. 更新打卡列表：将预填充项转换为实际食物
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
            checked: foods.filter(f => !f.placeholder).length > 0,
            recognizing: false
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

    } catch (error) {
      console.error('识别失败：', error);

      // 取消识别中状态
      this.setMealRecognizing(mealType, false);

      wx.showToast({
        title: error.message || '识别失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 设置餐次的识别状态
  setMealRecognizing(mealType, recognizing) {
    const mealCheckinList = this.data.mealCheckinList.map(item => {
      if (item.type === mealType) {
        return {
          ...item,
          recognizing: recognizing
        };
      }
      return item;
    });
    this.setData({ mealCheckinList });
  },

  // 删除食物（转换为预填充状态）
  onDeleteFood(e) {
    const mealType = e.currentTarget.dataset.type;
    const foodId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食物吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用删除API
            await deleteFoodCheckin(foodId);

            console.log('食物打卡删除成功，ID：', foodId);

            // 设置全局标志，通知首页刷新打卡数据
            const app = getApp();
            app.globalData.needRefreshCheckin = true;

            // 删除成功后，更新界面
            const mealCheckinList = this.data.mealCheckinList.map(item => {
              if (item.type === mealType) {
                // 将食物转换为预填充项，而不是删除
                let foods = (item.foods || []).map(food => {
                  if (food.id === foodId && !food.placeholder) {
                    return {
                      id: `placeholder-${mealType}-${Date.now()}`,
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
          } catch (error) {
            console.error('删除食物打卡失败：', error);
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 询问小智
  async askXiaozhi() {
    // 检查是否有图片
    if (!this.data.capturedImagePath && !this.data.capturedImageUrl) {
      wx.showToast({
        title: '请先选择或拍摄图片',
        icon: 'none'
      });
      return;
    }

    // 显示AI回复区域
    this.setData({
      showContent: true,
      contentType: 'ai',
      aiResponseList: [],
      aiLoading: true
    });

    try {
      // 如果还没有上传图片到OSS，先上传
      let imageUrl = this.data.capturedImageUrl;

      if (!imageUrl && this.data.capturedImagePath) {
        wx.showLoading({
          title: '上传图片中...',
          mask: true
        });

        imageUrl = await uploadRecipeImage(this.data.capturedImagePath);
        this.setData({
          capturedImageUrl: imageUrl
        });

        wx.hideLoading();
        console.log('图片上传成功，URL：', imageUrl);
      }

      // 用于累积接收的内容
      let fullContent = '';

      // 调用流式API
      analyzeRecipeStream(
        imageUrl,
        '分析食谱',
        // onMessage: 接收到消息片段
        (content) => {
          fullContent += content;
          console.log('接收到内容片段：', content);

          // 实时解析并显示
          const parsedContent = this.parseMarkdown(fullContent);
          this.setData({
            aiResponseList: parsedContent
          });
        },
        // onError: 错误处理
        (error) => {
          console.error('AI分析失败：', error);
          this.setData({
            aiLoading: false,
            aiResponseList: [{ type: 'text', content: '分析失败，请重试' }]
          });
          wx.showToast({
            title: '分析失败',
            icon: 'none'
          });
        },
        // onComplete: 完成
        () => {
          console.log('AI分析完成');
          this.setData({
            aiLoading: false
          });
        }
      );

    } catch (error) {
      console.error('上传图片失败：', error);
      wx.hideLoading();
      this.setData({
        aiLoading: false,
        showContent: false
      });
      wx.showToast({
        title: '上传图片失败',
        icon: 'none'
      });
    }
  },

  // 解析markdown为结构化数据
  parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    const result = [];

    for (let line of lines) {
      line = line.trim();

      if (!line) {
        continue; // 跳过空行
      }

      // 解析标题（### 开头）
      if (line.startsWith('###')) {
        const match = line.match(/^###\s*([^\s]+)\s*(.+)$/);
        if (match) {
          result.push({
            type: 'heading',
            icon: match[1], // emoji图标
            content: match[2].trim()
          });
        } else {
          result.push({
            type: 'heading',
            icon: '',
            content: line.replace(/^###\s*/, '').trim()
          });
        }
      }
      // 解析列表项（- 开头）
      else if (line.startsWith('-')) {
        const content = line.substring(1).trim();

        // 检查是否包含加粗文本（**text**）
        const boldMatch = content.match(/\*\*(.+?)\*\*/g);
        if (boldMatch) {
          // 解析加粗文本
          let parsedContent = content;
          const parts = [];
          let lastIndex = 0;

          const regex = /\*\*(.+?)\*\*/g;
          let match;

          while ((match = regex.exec(content)) !== null) {
            // 添加普通文本
            if (match.index > lastIndex) {
              parts.push({
                type: 'normal',
                text: content.substring(lastIndex, match.index)
              });
            }
            // 添加加粗文本
            parts.push({
              type: 'bold',
              text: match[1]
            });
            lastIndex = match.index + match[0].length;
          }

          // 添加剩余的普通文本
          if (lastIndex < content.length) {
            parts.push({
              type: 'normal',
              text: content.substring(lastIndex)
            });
          }

          result.push({
            type: 'list',
            parts: parts
          });
        } else {
          result.push({
            type: 'list',
            parts: [{ type: 'normal', text: content }]
          });
        }
      }
      // 普通文本
      else {
        result.push({
          type: 'text',
          content: line
        });
      }
    }

    return result;
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
