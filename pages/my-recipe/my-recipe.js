// pages/my-recipe/my-recipe.js
import { getMyRecipes, deleteMyRecipe } from '../../api/recipe';

Page({
    data: {
        statusBarHeight: 0,
        navBarHeight: 88,
        myRecipes: [],
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

        this.loadMyRecipes();
    },

    onShow() {
        this.loadMyRecipes();
    },

    // 加载我的食谱
    async loadMyRecipes() {
        try {
            wx.showLoading({ title: '加载中...' });

            const recipes = await getMyRecipes();

            console.log('后端返回的我的食谱:', recipes);

            this.setData({
                myRecipes: recipes || [],
                isEmpty: !recipes || recipes.length === 0
            });

            wx.hideLoading();
        } catch (error) {
            console.error('加载我的食谱失败:', error);
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

    // 查看食谱详情
    viewRecipe(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/recipe-detail/recipe-detail?id=${id}`
        });
    },

    // 添加食谱
    addRecipe() {
        wx.navigateTo({
            url: '/pages/edit-recipe/edit-recipe'
        });
    },

    // 编辑食谱
    editRecipe(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/edit-recipe/edit-recipe?id=${id}`
        });
    },

    // 删除食谱
    deleteRecipe(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '提示',
            content: '确定要删除这个食谱吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        wx.showLoading({ title: '删除中...' });

                        await deleteMyRecipe(id);

                        wx.hideLoading();
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1500
                        });

                        // 重新加载列表
                        this.loadMyRecipes();
                    } catch (error) {
                        console.error('删除食谱失败:', error);
                        wx.hideLoading();
                        wx.showToast({
                            title: error.message || '删除失败',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    }
})
