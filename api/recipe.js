import request from '../utils/request';

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
