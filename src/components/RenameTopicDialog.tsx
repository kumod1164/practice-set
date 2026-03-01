"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface RenameTopicDialogProps {
  data: {
    type: 'superTopic' | 'topic' | 'subtopic';
    superTopic?: string;
    topic?: string;
    subtopic?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function RenameTopicDialog({ data, onClose, onSuccess }: RenameTopicDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const getTitle = () => {
    switch (data.type) {
      case 'superTopic':
        return `Rename Super Topic: ${data.superTopic}`;
      case 'topic':
        return `Rename Topic: ${data.topic}`;
      case 'subtopic':
        return `Rename Subtopic: ${data.subtopic}`;
    }
  };

  const getWarning = () => {
    if (data.type === 'topic' || data.type === 'subtopic') {
      return "This will update all questions and historical test records with this topic.";
    }
    return "This will update all topic entries under this super topic.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);

    try {
      const payload: any = {};

      if (data.type === 'superTopic') {
        payload.oldSuperTopic = data.superTopic;
        payload.newSuperTopic = newName;
      } else if (data.type === 'topic') {
        payload.oldTopic = data.topic;
        payload.newTopic = newName;
      } else if (data.type === 'subtopic') {
        payload.oldTopic = data.topic;
        payload.oldSubtopic = data.subtopic;
        payload.newSubtopic = newName;
      }

      const response = await fetch("/api/admin/topics/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to rename",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{getWarning()}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newName">New Name *</Label>
            <Input
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder="Enter new name"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
