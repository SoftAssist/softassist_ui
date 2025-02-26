import React from 'react';
import { Button } from "./ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Skeleton } from "./ui/skeleton.jsx";

function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* Test if Tailwind is working */}
      <div className="bg-red-500 p-4 text-white mb-4">
        If you see this with a red background, Tailwind is working
      </div>

      <h1 className="text-2xl font-bold">shadcn/ui Test Components</h1>
      
      {/* Button variants */}
      <div className="space-y-4">
        <h2 className="text-xl">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      {/* Avatar examples */}
      <div className="space-y-4">
        <h2 className="text-xl">Avatars</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="invalid-image.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Skeleton loading states */}
      <div className="space-y-4">
        <h2 className="text-xl">Skeleton Loading</h2>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 