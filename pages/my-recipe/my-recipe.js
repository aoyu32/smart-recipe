// pages/my-recipe/my-recipe.js
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
    loadMyRecipes() {
        const myRecipes = wx.getStorageSync('myRecipes') || [];

        this.setData({
            myRecipes: myRecipes,
            isEmpty: myRecipes.length === 0
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
            url: `/pages/recipe-detail/recipe-detail?id=${id}&custom=true`
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
            success: (res) => {
                if (res.confirm) {
                    let myRecipes = wx.getStorageSync('myRecipes') || [];
                    myRecipes = myRecipes.filter(item => item.id !== id);
                    wx.setStorageSync('myRecipes', myRecipes);

                    // 更新我的内容统计
                    const myContent = wx.getStorageSync('myContent') || { collections: 0, recipes: 0 };
                    myContent.recipes = myRecipes.length;
                    wx.setStorageSync('myContent', myContent);

                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1500
                    });

                    this.loadMyRecipes();
                }
            }
        });
    }
})
