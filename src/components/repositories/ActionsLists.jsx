import React from 'react'
import { Card, CardContent } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Star } from "lucide-react";


import { CheckCircle, XCircle } from "lucide-react";
import { softAssistAPI } from '../../api/softAssistAPI.js';
import ActionCard from './ActionCard.jsx';
const ActionsLists = () => {
    const [workflows, setWorkflows] = React.useState([]);
    React.useEffect(() => {
        fetchWorkflows();
    }
    , []);
    const fetchWorkflows = async () => {
        try {
            
            const response = await softAssistAPI.github.getActions("SoftAssist");
            console.log(response);
            if (response) {
                let actions = []
                response.repositories.forEach((repo) => {
                    actions = [...actions , ...repo.workflows]
                })
                setWorkflows(actions || []);  
            }
        } catch (error) {
            console.error("Error fetching workflows:", error);
        }
    }

  return (
    <>
    <div className="flex items-center gap-6 border-b pb-2">
            <Input placeholder="Filter workflow runs" className="w-1/3" />
          </div>

          <div className="space-y-2 mt-2">
            {workflows.map((wf) => (
             <ActionCard key={wf.id} workflow={wf} />
            ))}
          </div>
    </>
  )
}

export default ActionsLists