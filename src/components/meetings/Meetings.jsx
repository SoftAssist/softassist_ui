import React, { useState } from "react";
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

const Meetings = () => {
    const [meetings, setMeetings] = useState([
        {
          id: 1,
          title: "Sprint Planning",
          createdAt: "2025-04-16 10:00 AM",
          fileName: "sprint_planning.mp4",
          transcribed: true,
        },
        {
          id: 2,
          title: "Retrospective Review",
          createdAt: "2025-04-15 05:00 PM",
          fileName: "retro_audio.mp3",
          transcribed: false,
        },
        {
          id: 3,
          title: "Daily Standup",
          createdAt: "2025-04-18 09:00 AM",
          fileName: "standup_clip.wav",
          transcribed: false,
        },
      ]);
      
      
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleAddMeeting = () => {
    const newMeeting = {
      id: Date.now(),
      title,
      notes,
      createdAt: new Date().toLocaleString(),
    };
    setMeetings([newMeeting, ...meetings]);
    setOpen(false);
    setTitle("");
    setNotes("");
  };

  const handleDelete = (id) => {
    setMeetings(meetings.filter((m) => m.id !== id));
  };

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
            console.log("Selected file:", file);
            // You can store this in state if needed
          }}
        />
      </div>
    </div>
    <DialogFooter className="mt-4">
      <Button onClick={handleAddMeeting} disabled={!title.trim()}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </div>

      <ul className="space-y-3">
        {meetings.length === 0 ? (
          <p className="text-muted-foreground">No meetings added yet.</p>
        ) : (
          meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background"
            >
              <div className="space-y-1">
                <h4 className="font-semibold text-lg">{meeting.title}</h4>
                <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                <p className="text-xs text-muted-foreground">Created at: {meeting.createdAt}</p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
  {meeting.transcribed ? (
   <Button
   size="sm"
   className="bg-green-600 hover:bg-green-700 text-white"
   onClick={() => {
     setSelectedSummary({
       title: meeting.title,
       summary: `This is a summarized version of the meeting "${meeting.title}". Decisions were made regarding team tasks and deadlines.`,
     });
     setSummarySheetOpen(true);
   }}
 >
   Summarize
 </Button>
 
  ) : (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => {
        // simulate transcription success
        const updated = meetings.map((m) =>
          m.id === meeting.id ? { ...m, transcribed: true } : m
        );
        setMeetings(updated);
      }}
    >
      Transcribe
    </Button>
  )}

  <Button
    size="sm"
    variant="outline"
    disabled={!meeting.transcribed}
    onClick={() => console.log("Generating issue for:", meeting.title)}
  >
    Generate Issue
  </Button>

  <Button size="sm" variant="destructive" onClick={() => handleDelete(meeting.id)}>
    Delete
  </Button>
</div>

            </li>
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

    </div>
  );
};

export default Meetings;
