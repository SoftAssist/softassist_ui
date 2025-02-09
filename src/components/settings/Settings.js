import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    // User Preferences
    theme: 'dark',
    notifications: true,
    emailUpdates: true,

    // API Configuration
    apiEndpoint: '',
    apiKey: '',

    // GitHub Integration
    githubToken: '',
    githubUsername: '',

    // Profile Settings
    displayName: '',
    email: '',

    // JIRA Integration
    jiraUrl: '',
    jiraEmail: '',
    jiraApiToken: '',
    jiraProject: '',
    jiraDefaultAssignee: '',
    enableJiraSync: false,
    autoCreateJiraTickets: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement settings save functionality
    console.log('Settings saved:', settings);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your application preferences and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* User Preferences Section */}
        <div className="settings-section">
          <h2>User Preferences</h2>
          
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="form-control"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              Enable Notifications
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleChange}
              />
              Receive Email Updates
            </label>
          </div>
        </div>

        {/* API Configuration Section */}
        <div className="settings-section">
          <h2>API Configuration</h2>
          
          <div className="form-group">
            <label htmlFor="apiEndpoint">API Endpoint</label>
            <input
              type="url"
              id="apiEndpoint"
              name="apiEndpoint"
              value={settings.apiEndpoint}
              onChange={handleChange}
              className="form-control"
              placeholder="https://api.example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={settings.apiKey}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* GitHub Integration Section */}
        <div className="settings-section">
          <h2>GitHub Integration</h2>
          
          <div className="form-group">
            <label htmlFor="githubUsername">GitHub Username</label>
            <input
              type="text"
              id="githubUsername"
              name="githubUsername"
              value={settings.githubUsername}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="githubToken">GitHub Token</label>
            <input
              type="password"
              id="githubToken"
              name="githubToken"
              value={settings.githubToken}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* JIRA Integration Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>JIRA Integration</h2>
            <div className="integration-status">
              <span className={`status-dot ${settings.jiraApiToken ? 'connected' : 'disconnected'}`}></span>
              {settings.jiraApiToken ? 'Connected' : 'Not Connected'}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="jiraUrl">JIRA Instance URL</label>
            <input
              type="url"
              id="jiraUrl"
              name="jiraUrl"
              value={settings.jiraUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="https://your-domain.atlassian.net"
            />
            <small className="form-help">Enter your JIRA instance URL (e.g., https://your-domain.atlassian.net)</small>
          </div>

          <div className="form-group">
            <label htmlFor="jiraEmail">JIRA Email</label>
            <input
              type="email"
              id="jiraEmail"
              name="jiraEmail"
              value={settings.jiraEmail}
              onChange={handleChange}
              className="form-control"
              placeholder="your-email@domain.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jiraApiToken">
              JIRA API Token
              <a 
                href="https://id.atlassian.com/manage/api-tokens" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="external-link"
              >
                Generate Token ↗
              </a>
            </label>
            <input
              type="password"
              id="jiraApiToken"
              name="jiraApiToken"
              value={settings.jiraApiToken}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jiraProject">Default JIRA Project Key</label>
            <input
              type="text"
              id="jiraProject"
              name="jiraProject"
              value={settings.jiraProject}
              onChange={handleChange}
              className="form-control"
              placeholder="PROJECT"
            />
            <small className="form-help">The project key used when creating new issues</small>
          </div>

          <div className="form-group">
            <label htmlFor="jiraDefaultAssignee">Default Assignee</label>
            <input
              type="text"
              id="jiraDefaultAssignee"
              name="jiraDefaultAssignee"
              value={settings.jiraDefaultAssignee}
              onChange={handleChange}
              className="form-control"
              placeholder="username"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableJiraSync"
                checked={settings.enableJiraSync}
                onChange={handleChange}
              />
              Enable JIRA Synchronization
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="autoCreateJiraTickets"
                checked={settings.autoCreateJiraTickets}
                onChange={handleChange}
              />
              Automatically Create JIRA Tickets
            </label>
          </div>

          <div className="integration-actions">
            <button type="button" className="button test-connection">
              Test Connection
            </button>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="button save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 