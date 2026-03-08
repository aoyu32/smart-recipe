// pages/my-collection/my-collection.js
import { getMyCollections, cancelCollection } from '../../api/recipe';

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
    async loadCollections() {
        try {
            wx.showLoading({ title: '加载中...' });

            const collections = await getMyCollections();

            console.log('后端返回的收藏列表:', collections);

            this.setData({
                collectionList: collections || [],
                isEmpty: !collections || collections.length === 0
            });

            wx.hideLoading();
        } catch (error) {
            console.error('加载收藏列表失败:', error);
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

    // 取消收藏
    toggleCollect(e) {
        const id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '提示',
            content: '确定要取消收藏吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        wx.showLoading({ title: '处理中...' });

                        await cancelCollection(id);

                        wx.hideLoading();
                        wx.showToast({
                            title: '已取消收藏',
                            icon: 'success',
                            duration: 1500
                        });

                        // 重新加载列表
                        this.loadCollections();
                    } catch (error) {
                        console.error('取消收藏失败:', error);
                        wx.hideLoading();
                        wx.showToast({
                            title: error.message || '操作失败',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    }
})
