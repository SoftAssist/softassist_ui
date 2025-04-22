import React, { useState, useEffect } from 'react';
import { softAssistAPI } from '../../api/softAssistAPI.js';

const MeetingSetupModal = ({ isOpen, onClose, onStart }) => {
  const [meetingName, setMeetingName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await softAssistAPI.projects.getAll();
        setProjects(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({
      meetingName,
      projectId: selectedProject
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[425px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Start New Meeting</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="meetingName">
                Meeting Name
              </label>
              <input
                type="text"
                id="meetingName"
                className="w-full px-3 py-2 border rounded-md"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="Enter meeting name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="project">
                Project
              </label>
              {loading ? (
                <div>Loading projects...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <select
                  id="project"
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!meetingName || !selectedProject}
            >
              Start Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingSetupModal; 