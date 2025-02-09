import { apiRequest } from './axiosConfig';

export const softAssistAPI = {
  // User endpoints
  user: {
    getCurrentUser: () => 
      apiRequest({
        url: '/frontend/user',
      }),
    
    updateUser: (userData) =>
      apiRequest({
        method: 'PUT',
        url: '/frontend/user',
        data: userData,
      }),
  },

  // Projects endpoints
  projects: {
    getAll: () =>
      apiRequest({
        url: '/frontend/projects',
      }),

    getById: (projectId) =>
      apiRequest({
        url: `/frontend/projects/${projectId}`,
      }),

    create: (projectData) =>
      apiRequest({
        method: 'POST',
        url: '/frontend/projects',
        data: projectData,
      }),

    update: (projectId, projectData) =>
      apiRequest({
        method: 'PUT',
        url: `/frontend/projects/${projectId}`,
        data: projectData,
      }),

    delete: (projectId) =>
      apiRequest({
        method: 'DELETE',
        url: `/frontend/projects/${projectId}`,
      }),
  },

  // Settings endpoints
  settings: {
    get: () =>
      apiRequest({
        url: '/frontend/settings',
      }),

    update: (settingsData) =>
      apiRequest({
        method: 'PUT',
        url: '/frontend/settings',
        data: settingsData,
      }),
  },

  // Example of using with query parameters
  search: {
    projects: (query) =>
      apiRequest({
        url: '/frontend/search/projects',
        params: { q: query },
      }),
  },
};

// Usage example:
// import { softAssistAPI } from './api/softAssistAPI';
// 
// try {
//   const user = await softAssistAPI.user.getCurrentUser();
//   console.log(user);
// } catch (error) {
//   console.error('Error fetching user:', error);
// } 