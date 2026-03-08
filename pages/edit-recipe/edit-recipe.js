// pages/edit-recipe/edit-recipe.js
import { getAllCategories, uploadRecipeImage, createMyRecipe, updateMyRecipe, getRecipeDetailById } from '../../api/recipe';

Page({
  data: {
    statusBarHeight: 0,
    navBarHeight: 88,
    isEdit: false,
    recipeId: '',
    categories: [],
    categoryIndex: -1, // 默认-1表示未选择
    // 健康目标标签
    goalTags: [
      { key: 'cut', name: '减脂', selected: false },
      { key: 'bulk', name: '增脂', selected: false },
      { key: 'muscle', name: '增肌', selected: false },
      { key: 'sugar', name: '控糖', selected: false }
    ],
    recipeData: {
      name: '',
      categoryId: null,
      image: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      description: '',
      ingredients: [],
      goalTags: []
    }
  },

  async onLoad(options) {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navBarHeight: navBarHeight
    });

    // 加载分类列表
    await this.loadCategories();

    // 如果有ID，则是编辑模式
    if (options.id) {
      this.setData({
        isEdit: true,
        recipeId: options.id
      });
      await this.loadRecipe(options.id);
    }
  },

  // 加载分类列表
  async loadCategories() {
    try {
      const categories = await getAllCategories();
      this.setData({ categories });
    } catch (error) {
      console.error('加载分类失败：', error);
      wx.showToast({
        title: '加载分类失败',
        icon: 'none'
      });
    }
  },

  // 加载食谱数据
  async loadRecipe(id) {
    try {
      wx.showLoading({ title: '加载中...' });
      const recipe = await getRecipeDetailById(id);

      // 找到分类索引
      const categoryIndex = this.data.categories.findIndex(cat => cat.id === recipe.categoryId);

      // 处理健康目标标签
      const goalTags = this.data.goalTags.map(tag => ({
        ...tag,
        selected: recipe.goalTags && recipe.goalTags.includes(tag.key)
      }));

      this.setData({
        recipeData: {
          name: recipe.name,
          categoryId: recipe.categoryId,
          image: recipe.image,
          calories: recipe.calories.toString(),
          protein: recipe.protein.toString(),
          carbs: recipe.carbs.toString(),
          fat: recipe.fat.toString(),
          description: recipe.description || '',
          ingredients: recipe.ingredients || [],
          goalTags: recipe.goalTags || []
        },
        categoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
        goalTags
      });

      wx.hideLoading();
    } catch (error) {
      console.error('加载食谱失败：', error);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
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
  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      const tempFilePath = res.tempFilePaths[0];

      // 上传图片
      wx.showLoading({ title: '上传中...' });
      const imageUrl = await uploadRecipeImage(tempFilePath);

      this.setData({
        'recipeData.image': imageUrl
      });

      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('上传图片失败：', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '上传失败',
        icon: 'none'
      });
    }
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
    const category = this.data.categories[index];
    const categoryId = category.id; // 直接使用字符串ID（code）

    console.log('选择分类 - index:', index, 'category:', category, 'categoryId:', categoryId);

    this.setData({
      categoryIndex: index,
      'recipeData.categoryId': categoryId
    }, () => {
      console.log('分类更新后 - recipeData.categoryId:', this.data.recipeData.categoryId);
    });
  },

  // 健康目标标签切换
  toggleGoalTag(e) {
    const key = e.currentTarget.dataset.key;
    const goalTags = this.data.goalTags.map(tag => {
      if (tag.key === key) {
        return { ...tag, selected: !tag.selected };
      }
      return tag;
    });

    // 更新选中的标签
    const selectedTags = goalTags.filter(tag => tag.selected).map(tag => tag.key);

    this.setData({
      goalTags,
      'recipeData.goalTags': selectedTags
    });
  },

  // 营养成分输入
  onNutritionInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`recipeData.${field}`]: e.detail.value
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
  async saveRecipe() {
    const { recipeData, isEdit, recipeId } = this.data;

    console.log('保存食谱 - recipeData:', recipeData);
    console.log('categoryId:', recipeData.categoryId, 'type:', typeof recipeData.categoryId);

    // 验证必填项
    if (!recipeData.name || !recipeData.name.trim()) {
      wx.showToast({
        title: '请输入食谱名称',
        icon: 'none'
      });
      return;
    }

    if (recipeData.categoryId === null || recipeData.categoryId === undefined) {
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
    if (!recipeData.calories || parseFloat(recipeData.calories) <= 0) {
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
      name: recipeData.name.trim(),
      image: recipeData.image,
      categoryId: recipeData.categoryId,
      calories: parseInt(recipeData.calories) || 0,
      protein: parseFloat(recipeData.protein) || 0,
      carbs: parseFloat(recipeData.carbs) || 0,
      fat: parseFloat(recipeData.fat) || 0,
      description: recipeData.description.trim(),
      ingredients: validIngredients,
      goalTags: recipeData.goalTags
    };

    console.log('准备保存的数据:', saveData);
    console.log('categoryId详情:', {
      value: saveData.categoryId,
      type: typeof saveData.categoryId,
      isNull: saveData.categoryId === null,
      isUndefined: saveData.categoryId === undefined
    });

    try {
      wx.showLoading({ title: '保存中...' });

      if (isEdit) {
        // 编辑模式：更新现有食谱
        await updateMyRecipe(recipeId, saveData);
      } else {
        // 新增模式
        await createMyRecipe(saveData);
      }

      wx.hideLoading();
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
    } catch (error) {
      console.error('保存食谱失败：', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '保存失败',
        icon: 'none'
      });
    }
  }
})
