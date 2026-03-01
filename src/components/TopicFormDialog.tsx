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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TopicFormDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TopicFormDialog({ onClose, onSuccess }: TopicFormDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    superTopic: "",
    topic: "",
    subtopic: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Topic created successfully",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create topic",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
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
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="superTopic">Super Topic *</Label>
            <Input
              id="superTopic"
              value={formData.superTopic}
              onChange={(e) => setFormData({ ...formData, superTopic: e.target.value })}
              required
              placeholder="e.g., Indian Polity"
            />
          </div>

          <div>
            <Label htmlFor="topic">Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              placeholder="e.g., Union Executive"
            />
          </div>

          <div>
            <Label htmlFor="subtopic">Subtopic *</Label>
            <Input
              id="subtopic"
              value={formData.subtopic}
              onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
              required
              placeholder="e.g., President"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
