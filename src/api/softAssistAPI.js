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
    
    associateWithProject: (projectId, userId) =>
      apiRequest({
        method: 'POST',
        url: `/frontend/user/add-project`,
        data: {
          projectId: projectId,
          userId: userId
        },
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
        url: `/frontend/project/${projectId}`,
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

      associateProject: (projectId, jiraProjectKey) =>
        apiRequest({
          url: `/frontend/project/${projectId}/associated-jira-project/${jiraProjectKey}`,
          method: 'PUT',
          data: { jiraProjectKey },
        }),
  },

  llm: {
    generateSuggestedIssues: (meetingId) =>
      apiRequest({
        url: `/frontend/llm/generateTasks`,
        method: 'POST',
        data: { meetingId },
      }),

    getSuggestedIssues: (meetingId) =>
      apiRequest({
        url: `/frontend/llm/existingTasksForMeeting/${meetingId}`,
        method: 'GET',
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

  meetings: {
    getProjectMeetings: (projectId) =>
      apiRequest({
        url: `/frontend/meetings/${projectId}`,
        method: 'GET',
      }),

    generateTranscript: (meetingId) =>
      apiRequest({
        url: `/frontend/meetings/${meetingId}/transcribe`,
        method: 'GET',
        timeout: 120000, // 120 seconds
        timeoutErrorMessage: 'Transcript generation timed out after 120 seconds',
      }),

    createMeeting: (formData, onUploadProgress) => {
      return apiRequest({
        url: '/frontend/meetings',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        },
      });
    },

    generateSummary: (meetingId) =>
      apiRequest({
        url: `/frontend/meetings/${meetingId}/summary`,
        method: 'GET',
        timeout: 120000,
      }),
  },

  jira: {
    getIssues: (jiraId) =>
      apiRequest({
        url: `/frontend/jira/project/${jiraId}/issues`,
        method: 'GET',
      }),
    createIssue: ({taskId, projectId, summary, description, issueType}) => 
      apiRequest({
        url: `/frontend/jira/issue/createIssueFromSuggestedTask/${taskId}`,
        method: 'POST',
        data: {
          projectId,
          summary,
          description,
          issueType,
          taskId,
        },
      }),
    

    getAvailableProjects: () =>
      apiRequest({
        url: '/frontend/jira/project',
        method: 'GET',
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