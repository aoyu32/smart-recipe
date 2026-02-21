// pages/diet-preference/diet-preference.js
Page({
    data: {
        statusBarHeight: 0,
        navBarHeight: 88,
        likedFoods: [],
        dislikedFoods: [],
        showModal: false,
        isEdit: false,
        editType: '', // 'like' or 'dislike'
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
    loadPreferences() {
        const preferences = wx.getStorageSync('dietPreferences') || {
            liked: [],
            disliked: []
        };

        this.setData({
            likedFoods: preferences.liked || [],
            dislikedFoods: preferences.disliked || []
        });
    },

    // 保存偏好设置
    savePreferences() {
        const preferences = {
            liked: this.data.likedFoods,
            disliked: this.data.dislikedFoods
        };
        wx.setStorageSync('dietPreferences', preferences);
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
            editIndex: -1,
            inputValue: ''
        });
    },

    // 编辑食物
    editFood(e) {
        const { type, index, name } = e.currentTarget.dataset;
        this.setData({
            showModal: true,
            isEdit: true,
            editType: type,
            editIndex: parseInt(index),
            inputValue: name
        });
    },

    // 删除食物
    deleteFood(e) {
        const { type, index } = e.currentTarget.dataset;

        wx.showModal({
            title: '提示',
            content: '确定要删除这个食物吗？',
            success: (res) => {
                if (res.confirm) {
                    if (type === 'like') {
                        const likedFoods = this.data.likedFoods;
                        likedFoods.splice(index, 1);
                        this.setData({ likedFoods });
                    } else {
                        const dislikedFoods = this.data.dislikedFoods;
                        dislikedFoods.splice(index, 1);
                        this.setData({ dislikedFoods });
                    }

                    this.savePreferences();

                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1500
                    });
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
    confirmAdd() {
        const { inputValue, isEdit, editType, editIndex } = this.data;

        // 验证输入
        if (!inputValue || !inputValue.trim()) {
            wx.showToast({
                title: '请输入食物名称',
                icon: 'none'
            });
            return;
        }

        const foodName = inputValue.trim();

        if (isEdit) {
            // 编辑模式
            if (editType === 'like') {
                const likedFoods = this.data.likedFoods;
                likedFoods[editIndex] = foodName;
                this.setData({ likedFoods });
            } else {
                const dislikedFoods = this.data.dislikedFoods;
                dislikedFoods[editIndex] = foodName;
                this.setData({ dislikedFoods });
            }

            wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1500
            });
        } else {
            // 添加模式
            if (editType === 'like') {
                // 检查是否已存在
                if (this.data.likedFoods.includes(foodName)) {
                    wx.showToast({
                        title: '该食物已在列表中',
                        icon: 'none'
                    });
                    return;
                }

                const likedFoods = this.data.likedFoods;
                likedFoods.push(foodName);
                this.setData({ likedFoods });
            } else {
                // 检查是否已存在
                if (this.data.dislikedFoods.includes(foodName)) {
                    wx.showToast({
                        title: '该食物已在列表中',
                        icon: 'none'
                    });
                    return;
                }

                const dislikedFoods = this.data.dislikedFoods;
                dislikedFoods.push(foodName);
                this.setData({ dislikedFoods });
            }

            wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500
            });
        }

        this.savePreferences();
        this.hideModal();
    }
})
