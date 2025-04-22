import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from "../ui/card";
import { softAssistAPI } from '../../api/softAssistAPI';
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog.jsx";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "../ui/sheets.jsx";
import { Textarea } from "../ui/textarea.jsx";
import IssueSuggestionDialog from "./issueSuggestionModal.jsx";

const Meetings = () => {
  const { id: projectId } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingTranscript, setGeneratingTranscript] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selectedMeetingSummary, setSelectedMeetingSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  console.log('Current URL:', window.location.pathname); // Debug current URL
  console.log('Project ID from params:', projectId); // Debug projectId

  // Helper function to format date safely
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date available';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return `${format(date, 'PPP')} at ${format(date, 'p')}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!projectId) {
        console.log('Missing projectId in component'); // Debug missing projectId
        setError('No project ID provided. Please ensure you\'re accessing this page through a project.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching meetings for project:', projectId);
        setLoading(true);
        const response = await softAssistAPI.meetings.getProjectMeetings(projectId);
        console.log('Meetings API response:', response);
        setMeetings(response || []);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError('Failed to load meetings');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [projectId]);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [suggestedIssues, setSuggestedIssues] = useState([]);

  const handleAddMeeting = async () => {
    try {
      if (!selectedFile) {
        setError('Please select an audio file');
        return;
      }

      setUploadProgress(0);

      // Create FormData object
      const formData = new FormData();
      formData.append('audioFile', selectedFile);
      formData.append('projectId', projectId);
      formData.append('meetingName', title);
      formData.append('date', new Date().toISOString().split('T')[0]);

      await softAssistAPI.meetings.createMeeting(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      // Fetch updated meetings list
      const updatedMeetings = await softAssistAPI.meetings.getProjectMeetings(projectId);
      setMeetings(updatedMeetings || []);
      
      // Reset form
      setOpen(false);
      setTitle("");
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError('Failed to create meeting. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleDelete = (id) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  const handleGenerateTranscript = async (meetingId) => {
    try {
      setGeneratingTranscript(prev => ({ ...prev, [meetingId]: true }));
      await softAssistAPI.meetings.generateTranscript(meetingId);
      
      // Fetch updated meetings list to get the new transcript
      const updatedMeetings = await softAssistAPI.meetings.getProjectMeetings(projectId);
      setMeetings(updatedMeetings || []);
    } catch (err) {
      console.error('Error generating transcript:', err);
      setError('Failed to generate transcript');
    } finally {
      setGeneratingTranscript(prev => ({ ...prev, [meetingId]: false }));
    }
  };

  const handleGenerateSummary = async (meetingId) => {
    try {
      setLoadingSummary(true);
      const response = await softAssistAPI.meetings.generateSummary(meetingId);
      setSelectedMeetingSummary(response.summary);  // Update to access .summary property
      setSummaryOpen(true);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return <div>Loading meetings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Meetings</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Meeting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Meeting Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Upload Audio/Video</label>
                <Input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    console.log("Selected file:", file);
                  }}
                />
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full">
                  <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button 
                onClick={handleAddMeeting} 
                disabled={!title.trim() || !selectedFile || (uploadProgress > 0 && uploadProgress < 100)}
              >
                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="space-y-3">
        {meetings.length === 0 ? (
          <p className="text-muted-foreground">No meetings found for this project.</p>
        ) : (
          meetings.map((meeting) => (
            <Card key={meeting._id} className="w-full mb-4">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{meeting.meetingName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(meeting.date)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {meeting.duration || 'N/A'}
                  </div>
                </div>
              </div>
              <CardContent>
                <div className="max-h-40 overflow-y-auto">
                  {meeting.transcript ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {meeting.transcript}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          onClick={() => handleGenerateSummary(meeting._id)}
                          disabled={loadingSummary}
                          variant="outline"
                          size="sm"
                        >
                          {loadingSummary ? (
                            <>
                              <span className="animate-spin mr-2">⚪</span>
                              Generating Summary...
                            </>
                          ) : (
                            'Generate Summary'
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">No transcript available</p>
                      <Button 
                        onClick={() => handleGenerateTranscript(meeting._id)}
                        disabled={generatingTranscript[meeting._id]}
                      >
                        {generatingTranscript[meeting._id] ? (
                          <>
                            <span className="animate-spin mr-2">⚪</span>
                            Generating...
                          </>
                        ) : (
                          'Generate Transcript'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </ul>
      <Sheet open={summarySheetOpen} onOpenChange={setSummarySheetOpen}>
        <SheetContent side="right" className="w-[40vw] sm:w-[60vw]">
          <SheetHeader>
            <SheetTitle>Meeting Summary</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">{selectedSummary?.title}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSummary?.summary}
            </p>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Meeting Summary</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedMeetingSummary ? (
              <div className="prose prose-sm">
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedMeetingSummary}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No summary available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <IssueSuggestionDialog
        open={issueModalOpen}
        onOpenChange={setIssueModalOpen}
        meeting={selectedMeeting}
        suggestedIssues={suggestedIssues}
        onAddToJira={() => {
          console.log("Added to JIRA:", suggestedIssues);
          setIssueModalOpen(false);
        }}
      />
    </div>
  );
};

export default Meetings;
