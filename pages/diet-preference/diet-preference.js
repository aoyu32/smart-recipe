// pages/diet-preference/diet-preference.js
import { getDietPreferenceList, addDietPreference, updateDietPreference, deleteDietPreference } from '../../api/user';

Page({
    data: {
        statusBarHeight: 0,
        navBarHeight: 88,
        likedFoods: [],
        dislikedFoods: [],
        showModal: false,
        isEdit: false,
        editType: '', // 'like' or 'dislike'
        editId: null,
        editIndex: -1,
        inputValue: ''
    },

    onLoad() {
        const systemInfo = wx.getSystemInfoSync();
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

        const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - systemInfo.statusBarHeight) * 2;

        this.setData({
            statusBarHeight: systemInfo.statusBarHeight,
            navBarHeight: navBarHeight
        });

        this.loadPreferences();
    },

    onShow() {
        this.loadPreferences();
    },

    // 加载偏好设置
    async loadPreferences() {
        try {
            wx.showLoading({ title: '加载中...' });

            const preferences = await getDietPreferenceList();

            console.log('后端返回的饮食偏好:', preferences);

            // 分类处理
            const likedFoods = preferences
                .filter(item => item.preferenceType === 'like')
                .map(item => ({ id: item.id, name: item.foodName }));

            const dislikedFoods = preferences
                .filter(item => item.preferenceType === 'dislike')
                .map(item => ({ id: item.id, name: item.foodName }));

            this.setData({
                likedFoods,
                dislikedFoods
            });

            wx.hideLoading();
        } catch (error) {
            console.error('加载饮食偏好失败:', error);
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

    // 显示添加弹窗
    showAddModal(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            showModal: true,
            isEdit: false,
            editType: type,
            editId: null,
            editIndex: -1,
            inputValue: ''
        });
    },

    // 编辑食物
    editFood(e) {
        const { type, index, id, name } = e.currentTarget.dataset;
        this.setData({
            showModal: true,
            isEdit: true,
            editType: type,
            editId: id,
            editIndex: parseInt(index),
            inputValue: name
        });
    },

    // 删除食物
    deleteFood(e) {
        const { type, index, id } = e.currentTarget.dataset;

        wx.showModal({
            title: '提示',
            content: '确定要删除这个食物吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        wx.showLoading({ title: '删除中...' });

                        await deleteDietPreference(id);

                        wx.hideLoading();
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1500
                        });

                        // 重新加载数据
                        this.loadPreferences();
                    } catch (error) {
                        console.error('删除失败:', error);
                        wx.hideLoading();
                        wx.showToast({
                            title: error.message || '删除失败',
                            icon: 'none'
                        });
                    }
                }
            }
        });
    },

    // 隐藏弹窗
    hideModal() {
        this.setData({
            showModal: false,
            inputValue: ''
        });
    },

    // 阻止冒泡
    stopPropagation() { },

    // 输入变化
    onInputChange(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },

    // 确认添加/编辑
    async confirmAdd() {
        const { inputValue, isEdit, editType, editId } = this.data;

        // 验证输入
        if (!inputValue || !inputValue.trim()) {
            wx.showToast({
                title: '请输入食物名称',
                icon: 'none'
            });
            return;
        }

        const foodName = inputValue.trim();

        try {
            wx.showLoading({ title: isEdit ? '修改中...' : '添加中...' });

            if (isEdit) {
                // 编辑模式
                await updateDietPreference(editId, { foodName });

                wx.hideLoading();
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1500
                });
            } else {
                // 添加模式
                const preferenceType = editType === 'like' ? 'like' : 'dislike';
                await addDietPreference({ preferenceType, foodName });

                wx.hideLoading();
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1500
                });
            }

            this.hideModal();
            // 重新加载数据
            this.loadPreferences();
        } catch (error) {
            console.error('操作失败:', error);
            wx.hideLoading();
            wx.showToast({
                title: error.message || '操作失败',
                icon: 'none'
            });
        }
    }
})
