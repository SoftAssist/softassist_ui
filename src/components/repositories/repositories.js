import React from "react";
import { Card, CardContent } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { MessageCircle, Star } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/tabs.jsx";
import CreateRepoDialog from "./createrepodialog.jsx";
import Repolist from "./repolist.jsx";
import PRlist from "./PRlist.jsx";
import ActionsLists from "./ActionsLists.jsx";


export default function GitHubDashboard() {

  return (
    <div className="p-6 space-y-4">
      <Tabs defaultValue="repos" className="w-full">
        {/* Tabs Header */}
        <TabsList className="mb-4">
          <TabsTrigger value="repos">Repos</TabsTrigger>
          <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Repositories Tab */}
        <TabsContent value="repos">
          <Repolist />
        </TabsContent>

        {/* Pull Requests Tab */}
        <TabsContent value="pulls">
         <PRlist />
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions">
          <ActionsLists />
        </TabsContent>
      </Tabs>
    </div>
  );
}
