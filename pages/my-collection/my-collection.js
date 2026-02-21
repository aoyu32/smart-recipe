// pages/my-collection/my-collection.js
const mockRecipeDetail = require('../../mock/recipe-detail.js');

Page({
    data: {
        statusBarHeight: 0,
        navBarHeight: 88,
        collectionList: [],
        isEmpty: false
    },

    onLoad() {
        const systemInfo = wx.getSystemInfoSync();
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

        const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

        this.setData({
            statusBarHeight: systemInfo.statusBarHeight,
            navBarHeight: navBarHeight
        });

        this.loadCollections();
    },

    onShow() {
        this.loadCollections();
    },

    // 加载收藏列表
    loadCollections() {
        // 从本地存储获取收藏的食谱ID列表
        const collectedIds = wx.getStorageSync('collectedRecipes') || [];

        if (collectedIds.length === 0) {
            this.setData({
                isEmpty: true,
                collectionList: []
            });
            return;
        }

        // 根据ID获取食谱详情
        const collectionList = collectedIds.map(id => {
            const recipe = mockRecipeDetail.getRecipeById(id);
            return recipe ? { ...recipe, isCollected: true } : null;
        }).filter(item => item !== null);

        this.setData({
            collectionList: collectionList,
            isEmpty: collectionList.length === 0
        });
    },

    // 返回上一页
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 查看食谱详情
    viewRecipe(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-detail/recipe-detail?id=${id}`
        });
    },

    // 取消收藏
    toggleCollect(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '提示',
            content: '确定要取消收藏吗？',
            success: (res) => {
                if (res.confirm) {
                    this.removeCollection(id);
                }
            }
        });
    },

    // 移除收藏
    removeCollection(id) {
        let collectedIds = wx.getStorageSync('collectedRecipes') || [];
        collectedIds = collectedIds.filter(item => item !== id);
        wx.setStorageSync('collectedRecipes', collectedIds);

        // 更新我的内容统计
        const myContent = wx.getStorageSync('myContent') || { collections: 0, recipes: 0 };
        myContent.collections = collectedIds.length;
        wx.setStorageSync('myContent', myContent);

        wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 1500
        });

        // 重新加载列表
        this.loadCollections();
    }
})
