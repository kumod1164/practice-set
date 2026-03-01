"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  RefreshCw,
  FolderTree
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import TopicFormDialog from "@/components/TopicFormDialog";
import RenameTopicDialog from "@/components/RenameTopicDialog";

interface TopicHierarchy {
  superTopic: string;
  topics: {
    topic: string;
    subtopics: {
      subtopic: string;
      questionCount: number;
      _id: string;
    }[];
  }[];
}

export default function TopicManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [hierarchy, setHierarchy] = useState<TopicHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSuperTopics, setExpandedSuperTopics] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameData, setRenameData] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchHierarchy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/topics");
      const data = await response.json();

      if (data.success) {
        setHierarchy(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch topics",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/topics/sync", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchHierarchy();
      } else {
        toast({
          title: "Error",
          description: "Failed to sync topics",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topicId: string) => {
    if (!confirm("Are you sure you want to delete this topic entry?")) return;

    try {
      const response = await fetch(`/api/admin/topics/${topicId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Topic deleted successfully",
        });
        fetchHierarchy();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete topic",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      });
    }
  };

  const toggleSuperTopic = (superTopic: string) => {
    const newExpanded = new Set(expandedSuperTopics);
    if (newExpanded.has(superTopic)) {
      newExpanded.delete(superTopic);
    } else {
      newExpanded.add(superTopic);
    }
    setExpandedSuperTopics(newExpanded);
  };

  const toggleTopic = (key: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTopics(newExpanded);
  };

  const handleRename = (type: 'superTopic' | 'topic' | 'subtopic', data: any) => {
    setRenameData({ type, ...data });
    setShowRenameDialog(true);
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              <CardTitle>Topic Management</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSync} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync from Questions
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hierarchy.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No topics found. Click "Sync from Questions" to import existing topics.
              </p>
              <Button onClick={handleSync} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync from Questions
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {hierarchy.map((superTopicData) => (
                <div key={superTopicData.superTopic} className="border rounded-lg">
                  {/* Super Topic */}
                  <div className="flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary/70 cursor-pointer"
                    onClick={() => toggleSuperTopic(superTopicData.superTopic)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedSuperTopics.has(superTopicData.superTopic) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-semibold text-lg">{superTopicData.superTopic}</span>
                      <span className="text-xs text-muted-foreground">
                        ({superTopicData.topics.length} topics)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename('superTopic', { superTopic: superTopicData.superTopic });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Topics */}
                  {expandedSuperTopics.has(superTopicData.superTopic) && (
                    <div className="p-2 space-y-1">
                      {superTopicData.topics.map((topicData) => {
                        const topicKey = `${superTopicData.superTopic}-${topicData.topic}`;
                        return (
                          <div key={topicKey} className="border rounded">
                            <div
                              className="flex items-center justify-between p-2 hover:bg-secondary/30 cursor-pointer"
                              onClick={() => toggleTopic(topicKey)}
                            >
                              <div className="flex items-center gap-2 ml-4">
                                {expandedTopics.has(topicKey) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <span className="font-medium">{topicData.topic}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({topicData.subtopics.length} subtopics)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRename('topic', { 
                                    superTopic: superTopicData.superTopic,
                                    topic: topicData.topic 
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Subtopics */}
                            {expandedTopics.has(topicKey) && (
                              <div className="p-2 space-y-1 bg-secondary/10">
                                {topicData.subtopics.map((subtopicData) => (
                                  <div
                                    key={subtopicData._id}
                                    className="flex items-center justify-between p-2 ml-8 hover:bg-secondary/30 rounded"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{subtopicData.subtopic}</span>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {subtopicData.questionCount} questions
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRename('subtopic', {
                                          superTopic: superTopicData.superTopic,
                                          topic: topicData.topic,
                                          subtopic: subtopicData.subtopic
                                        })}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(subtopicData._id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddDialog && (
        <TopicFormDialog
          onClose={() => setShowAddDialog(false)}
          onSuccess={fetchHierarchy}
        />
      )}

      {showRenameDialog && renameData && (
        <RenameTopicDialog
          data={renameData}
          onClose={() => {
            setShowRenameDialog(false);
            setRenameData(null);
          }}
          onSuccess={fetchHierarchy}
        />
      )}
    </>
  );
}
