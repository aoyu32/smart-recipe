// pages/edit-recipe/edit-recipe.js
Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    isEdit: false,
    recipeId: '',
    categories: ['低脂高蛋白', '减脂餐', '健康早餐', '快手早餐', '增肌餐', '家常汤羹', '轻食', '快手菜', '家常菜', '川菜', '素菜', '凉菜', '主食', '烘焙'],
    categoryIndex: 0,
    recipeData: {
      name: '',
      category: '',
      image: '',
      nutrition: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      description: '',
      ingredients: []
    }
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });

    // 如果有ID，则是编辑模式
    if (options.id) {
      this.setData({
        isEdit: true,
        recipeId: options.id
      });
      this.loadRecipe(options.id);
    }
  },

  // 加载食谱数据
  loadRecipe(id) {
    const myRecipes = wx.getStorageSync('myRecipes') || [];
    const recipe = myRecipes.find(item => item.id === id);

    if (recipe) {
      const categoryIndex = this.data.categories.indexOf(recipe.category);
      this.setData({
        recipeData: recipe,
        categoryIndex: categoryIndex >= 0 ? categoryIndex : 0
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'recipeData.image': tempFilePath
        });
      }
    });
  },

  // 名称输入
  onNameInput(e) {
    this.setData({
      'recipeData.name': e.detail.value
    });
  },

  // 分类选择
  onCategoryChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      categoryIndex: index,
      'recipeData.category': this.data.categories[index]
    });
  },

  // 营养成分输入
  onNutritionInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`recipeData.nutrition.${field}`]: e.detail.value
    });
  },

  // 介绍输入
  onDescriptionInput(e) {
    this.setData({
      'recipeData.description': e.detail.value
    });
  },

  // 添加食材
  addIngredient() {
    const ingredients = this.data.recipeData.ingredients;
    ingredients.push({
      name: '',
      amount: ''
    });
    this.setData({
      'recipeData.ingredients': ingredients
    });
  },

  // 食材名称输入
  onIngredientNameInput(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`recipeData.ingredients[${index}].name`]: e.detail.value
    });
  },

  // 食材用量输入
  onIngredientAmountInput(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`recipeData.ingredients[${index}].amount`]: e.detail.value
    });
  },

  // 删除食材
  deleteIngredient(e) {
    const index = e.currentTarget.dataset.index;
    const ingredients = this.data.recipeData.ingredients;
    ingredients.splice(index, 1);
    this.setData({
      'recipeData.ingredients': ingredients
    });
  },

  // 保存食谱
  saveRecipe() {
    const { recipeData, isEdit, recipeId } = this.data;

    // 验证必填项
    if (!recipeData.name || !recipeData.name.trim()) {
      wx.showToast({
        title: '请输入食谱名称',
        icon: 'none'
      });
      return;
    }

    if (!recipeData.category) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      });
      return;
    }

    if (!recipeData.image) {
      wx.showToast({
        title: '请上传食谱图片',
        icon: 'none'
      });
      return;
    }

    // 验证营养成分
    if (!recipeData.nutrition.calories || parseFloat(recipeData.nutrition.calories) <= 0) {
      wx.showToast({
        title: '请输入有效的热量值',
        icon: 'none'
      });
      return;
    }

    // 过滤空食材
    const validIngredients = recipeData.ingredients.filter(item =>
      item.name && item.name.trim() && item.amount && item.amount.trim()
    );

    // 准备保存的数据
    const saveData = {
      ...recipeData,
      name: recipeData.name.trim(),
      description: recipeData.description.trim(),
      ingredients: validIngredients,
      nutrition: {
        calories: parseFloat(recipeData.nutrition.calories) || 0,
        protein: parseFloat(recipeData.nutrition.protein) || 0,
        carbs: parseFloat(recipeData.nutrition.carbs) || 0,
        fat: parseFloat(recipeData.nutrition.fat) || 0
      }
    };

    let myRecipes = wx.getStorageSync('myRecipes') || [];

    if (isEdit) {
      // 编辑模式：更新现有食谱
      const index = myRecipes.findIndex(item => item.id === recipeId);
      if (index >= 0) {
        myRecipes[index] = {
          ...saveData,
          id: recipeId
        };
      }
    } else {
      // 新增模式：生成新ID
      const newId = 'custom_' + Date.now();
      myRecipes.push({
        ...saveData,
        id: newId,
        likes: 0,
        collections: 0,
        views: 0,
        isLiked: false,
        isCollected: false
      });
    }

    wx.setStorageSync('myRecipes', myRecipes);

    // 更新我的内容统计
    const myContent = wx.getStorageSync('myContent') || { collections: 0, recipes: 0 };
    myContent.recipes = myRecipes.length;
    wx.setStorageSync('myContent', myContent);

    wx.showToast({
      title: isEdit ? '保存成功' : '添加成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  }
})
