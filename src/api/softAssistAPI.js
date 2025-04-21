import { apiRequest } from './axiosConfig.js';

export const softAssistAPI = {
  // User endpoints
  user: {
    getCurrentUser: (userData) => 
      apiRequest({
        url: '/frontend/user/clerk-signin',
        method: 'POST',
        data: {
          clerkId: userData.clerkId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
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
        url: '/frontend/project',
      }),

    getById: (projectId) =>
      apiRequest({
        url: `/frontend/projects/${projectId}`,
      }),

    create: (projectData) =>
      apiRequest({
        method: 'POST',
        url: `/frontend/project/${projectData.name}/create`,
        data: {
          name: projectData.name,
          description: projectData.description
        },
      }),

    update: (projectId, projectData) =>
      apiRequest({
        method: 'PUT',
        url: `/frontend/projects/${projectId}`,
      }),

    delete: (projectId) =>
      apiRequest({
        method: 'DELETE',
        url: `/frontend/projects/${projectId}`,
      }),

    // New endpoint for managing project users
    updateUsers: (projectId, users) =>
      apiRequest({
        method: 'PUT',
        url: `/frontend/projects/${projectId}/users`,
        data: { users },
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