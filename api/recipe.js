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
