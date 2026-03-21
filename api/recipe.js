import request, { BASE_URL } from '../utils/request';

/**
 * 查询所有食谱分类
 */
export function getAllCategories() {
    return request({
        url: '/api/recipe/category/list',
        method: 'GET'
    });
}

/**
 * 查询所有食谱
 */
export function getAllRecipes() {
    return request({
        url: '/api/recipe/list',
        method: 'GET'
    });
}

/**
 * 根据分类查询食谱
 */
export function getRecipesByCategory(categoryCode) {
    return request({
        url: `/api/recipe/list/category/${categoryCode}`,
        method: 'GET'
    });
}

/**
 * 根据健康目标标签查询食谱
 */
export function getRecipesByGoalTag(goalTag) {
    return request({
        url: `/api/recipe/list/goal/${goalTag}`,
        method: 'GET'
    });
}

/**
 * 根据分类和健康目标标签查询食谱
 */
export function getRecipesByCategoryAndGoalTag(categoryCode, goalTag) {
    return request({
        url: `/api/recipe/list/category/${categoryCode}/goal/${goalTag}`,
        method: 'GET'
    });
}

/**
 * 根据ID查询食谱详情
 */
export function getRecipeDetailById(id) {
    return request({
        url: `/api/recipe/${id}`,
        method: 'GET'
    });
}
/**
 * 根据关键词搜索食谱
 */
export function searchRecipes(keyword) {
    return request({
        url: '/api/recipe/search',
        method: 'GET',
        params: { keyword }
    });
}

/**
 * 点赞食谱
 */
export function likeRecipe(id) {
    return request({
        url: `/api/recipe/${id}/like`,
        method: 'POST'
    });
}

/**
 * 取消点赞食谱
 */
export function unlikeRecipe(id) {
    return request({
        url: `/api/recipe/${id}/like`,
        method: 'DELETE'
    });
}

/**
 * 收藏食谱
 */
export function collectRecipe(id) {
    return request({
        url: `/api/recipe/${id}/collect`,
        method: 'POST'
    });
}

/**
 * 取消收藏食谱
 */
export function uncollectRecipe(id) {
    return request({
        url: `/api/recipe/${id}/collect`,
        method: 'DELETE'
    });
}

/**
 * 查询食谱排行榜
 */
export function getRecipeRankings() {
    return request({
        url: '/api/recipe/rankings',
        method: 'GET'
    });
}

/**
 * AI生成每日食谱推荐
 * @param {string} input - 用户输入的生成提示（可选）
 */
export function generateDailyRecipe(input) {
    return request({
        url: '/api/ai/daily-recipe',
        method: 'POST',
        params: {
            input: input || '给我推荐今日食谱'
        },
        timeout: 120000  // AI生成需要更长时间，设置为120秒
    });
}

/**
 * 获取今日食谱推荐（优先从数据库查询）
 */
export function getTodayRecipe() {
    return request({
        url: '/api/ai/daily-recipe/today',
        method: 'POST',
        timeout: 120000
    });
}

/**
 * 食物打卡分析（AI识别食物并返回营养数据）
 * @param {string} imageUrl - 食物图片URL
 * @param {string} mealType - 餐次类型：breakfast/lunch/dinner
 */
export function analyzeFoodCheckin(imageUrl, mealType) {
    return request({
        url: '/api/ai/food-checkin',
        method: 'POST',
        data: {
            image_url: imageUrl,
            meal_type: mealType,
            input: '打卡'
        },
        timeout: 60000  // AI识别需要时间，设置为60秒
    });
}

/**
 * 保存食物打卡记录
 * @param {object} data - 打卡数据
 */
export function saveFoodCheckin(data) {
    return request({
        url: '/api/ai/food-checkin/save',
        method: 'POST',
        data: data
    });
}

/**
 * 删除食物打卡记录
 * @param {number} foodId - 食物记录ID
 */
export function deleteFoodCheckin(foodId) {
    return request({
        url: `/api/ai/food-checkin/${foodId}`,
        method: 'DELETE'
    });
}

/**
 * 查询今日打卡记录
 */
export function getTodayCheckin() {
    return request({
        url: '/api/ai/food-checkin/today',
        method: 'GET'
    });
}

/**
 * 查询指定日期的饮食日记
 * @param {string} date - 日期（YYYY-MM-DD）
 */
export function getDietDiaryByDate(date) {
    return request({
        url: `/api/diet-diary/${date}`,
        method: 'GET'
    });
}

/**
 * 查询日期范围内的饮食日记列表
 * @param {string} startDate - 开始日期（YYYY-MM-DD）
 * @param {string} endDate - 结束日期（YYYY-MM-DD）
 */
export function getDietDiaryList(startDate, endDate) {
    return request({
        url: '/api/diet-diary/list',
        method: 'GET',
        params: {
            startDate,
            endDate
        }
    });
}

/**
 * 删除饮食日记
 * @param {number} diaryId - 日记ID
 */
export function deleteDietDiary(diaryId) {
    return request({
        url: `/api/diet-diary/${diaryId}`,
        method: 'DELETE'
    });
}

/**
 * 将食谱添加到今日餐食
 * @param {number} recipeId - 食谱ID
 * @param {string} mealType - 餐次类型：breakfast/lunch/dinner
 */
export function addRecipeToMeal(recipeId, mealType) {
    return request({
        url: '/api/ai/food-checkin/add-recipe',
        method: 'POST',
        data: {
            recipeId: recipeId,
            mealType: mealType
        }
    });
}

/**
 * 从今日食谱推荐中删除食谱项
 * @param {number} itemId - 食谱项ID
 */
export function deleteRecipeItem(itemId) {
    return request({
        url: `/api/ai/daily-recipe/item/${itemId}`,
        method: 'DELETE'
    });
}

/**
 * 分析食谱（流式返回）
 * @param {string} imageUrl - 图片URL
 * @param {string} input - 用户输入
 * @param {function} onMessage - 接收消息的回调函数
 * @param {function} onError - 错误回调函数
 * @param {function} onComplete - 完成回调函数
 */
export function analyzeRecipeStream(imageUrl, input, onMessage, onError, onComplete) {
    const token = wx.getStorageSync('token');

    const requestTask = wx.request({
        url: `${BASE_URL}/api/ai/recipe-analysis/stream`,
        method: 'POST',
        data: {
            imageUrl: imageUrl,
            input: input || '分析食谱'
        },
        header: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'text/event-stream'
        },
        enableChunked: true,
        success: (res) => {
            console.log('请求完成，状态码：', res.statusCode);
            if (res.statusCode !== 200) {
                onError && onError(new Error('请求失败'));
            }
        },
        fail: (error) => {
            console.error('流式请求失败：', error);
            onError && onError(error);
        }
    });

    // 监听数据块接收
    requestTask.onChunkReceived((res) => {
        try {
            const arrayBuffer = res.data;
            // 使用TextDecoder正确解码UTF-8
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(new Uint8Array(arrayBuffer));

            console.log('接收到数据块：', text);

            // 解析SSE格式 - 每行都有data:前缀
            const lines = text.split('\n');
            let currentEvent = '';
            let currentData = '';

            for (const line of lines) {
                let trimmed = line.trim();

                // 跳过空行
                if (!trimmed || trimmed === 'data:') {
                    continue;
                }

                // 移除开头的"data:"前缀
                if (trimmed.startsWith('data:')) {
                    trimmed = trimmed.substring(5);
                }

                // 解析event和data字段
                if (trimmed.startsWith('event:')) {
                    currentEvent = trimmed.substring(6).trim();
                    console.log('解析到事件：', currentEvent);
                } else if (trimmed.startsWith('data:')) {
                    currentData = trimmed.substring(5).trim();
                    console.log('解析到数据，长度：', currentData.length);

                    // 当我们有event和data时，处理这条消息
                    if (currentEvent && currentData) {
                        processSSEMessage(currentEvent, currentData, onMessage, onError, onComplete);
                        currentEvent = '';
                        currentData = '';
                    }
                }
            }
        } catch (e) {
            console.error('解析SSE数据失败：', e);
        }
    });

    return requestTask;
}

// 处理单个SSE消息
function processSSEMessage(event, data, onMessage, onError, onComplete) {
    console.log('处理SSE消息 - 事件：', event, '数据：', data);

    if (event === 'Message') {
        // 解析Coze返回的JSON
        try {
            const jsonData = JSON.parse(data);
            if (jsonData.content) {
                onMessage && onMessage(jsonData.content);
            }
        } catch (e) {
            console.error('解析JSON失败：', e, '原始数据：', data);
        }
    } else if (event === 'Done') {
        onComplete && onComplete();
    } else if (event === 'Error') {
        try {
            const jsonData = JSON.parse(data);
            const errorMsg = jsonData.error_message || '分析失败';
            onError && onError(new Error(errorMsg));
        } catch (e) {
            onError && onError(new Error('分析失败'));
        }
    }
}




// ========== 我的收藏相关API ==========

// 获取我的收藏列表
export const getMyCollections = () => {
    return request({
        url: '/api/recipe-collection/list',
        method: 'GET'
    })
}

// 取消收藏
export const cancelCollection = (recipeId) => {
    return request({
        url: `/api/recipe-collection/cancel/${recipeId}`,
        method: 'DELETE'
    })
}

// ========== 我的食谱相关API ==========

// 创建我的食谱
export const createMyRecipe = (data) => {
    return request({
        url: '/api/my-recipe/create',
        method: 'POST',
        data
    })
}

// 获取我的食谱列表
export const getMyRecipes = () => {
    return request({
        url: '/api/my-recipe/list',
        method: 'GET'
    })
}

// 获取我的食谱详情（用于编辑）
export const getMyRecipeById = (recipeId) => {
    return request({
        url: `/api/my-recipe/${recipeId}`,
        method: 'GET'
    })
}

// 更新我的食谱
export const updateMyRecipe = (recipeId, data) => {
    return request({
        url: `/api/my-recipe/update/${recipeId}`,
        method: 'PUT',
        data
    })
}

// 删除我的食谱
export const deleteMyRecipe = (recipeId) => {
    return request({
        url: `/api/my-recipe/delete/${recipeId}`,
        method: 'DELETE'
    })
}

// 上传食谱图片
export const uploadRecipeImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync('token');

        wx.uploadFile({
            url: `${BASE_URL}/api/file/upload/image`,
            filePath: filePath,
            name: 'file',
            header: {
                'Authorization': `Bearer ${token}`
            },
            success: (res) => {
                const data = JSON.parse(res.data);
                if (data.code === 200) {
                    resolve(data.data);
                } else {
                    reject(new Error(data.message || '上传失败'));
                }
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
}
