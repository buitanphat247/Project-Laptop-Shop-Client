/**
 * User activity logging utilities
 */

import { getUserProfile } from './userUtils.js';

// Hàm log hoạt động user
export const logUserActivity = (action, details = {}) => {
    try {
        const userProfile = getUserProfile();
        const activity = {
            userId: userProfile?.id || 'anonymous',
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            // console.log('User Activity:', activity);
        }

        // Save to localStorage for tracking
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.push(activity);

        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }

        localStorage.setItem('userActivities', JSON.stringify(activities));

        return activity;
    } catch (error) {
        console.error('Failed to log activity:', error);
        return null;
    }
};

// Hàm lấy danh sách hoạt động từ localStorage
export const getUserActivities = () => {
    try {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        return activities;
    } catch (error) {
        console.error('Failed to get user activities:', error);
        return [];
    }
};

// Hàm xóa tất cả hoạt động
export const clearUserActivities = () => {
    try {
        localStorage.removeItem('userActivities');
        return true;
    } catch (error) {
        console.error('Failed to clear user activities:', error);
        return false;
    }
};

// Hàm lọc hoạt động theo thời gian
export const getActivitiesByDateRange = (startDate, endDate) => {
    try {
        const activities = getUserActivities();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return activities.filter(activity => {
            const activityTime = new Date(activity.timestamp).getTime();
            return activityTime >= start && activityTime <= end;
        });
    } catch (error) {
        console.error('Failed to filter activities by date range:', error);
        return [];
    }
};

// Hàm lọc hoạt động theo action
export const getActivitiesByAction = (action) => {
    try {
        const activities = getUserActivities();
        return activities.filter(activity => activity.action === action);
    } catch (error) {
        console.error('Failed to filter activities by action:', error);
        return [];
    }
}; 