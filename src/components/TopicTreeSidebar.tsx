"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TopicTreeSidebarProps {
  collapsed: boolean;
}

export default function TopicTreeSidebar({ collapsed }: TopicTreeSidebarProps) {
  const router = useRouter();
  const [hierarchy, setHierarchy] = useState<TopicHierarchy[]>([]);
  const [expandedSuperTopics, setExpandedSuperTopics] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!collapsed) {
      fetchHierarchy();
    }
  }, [collapsed]);

  const fetchHierarchy = async () => {
    try {
      const response = await fetch("/api/admin/topics");
      const data = await response.json();
      if (data.success) {
        setHierarchy(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch hierarchy:", error);
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

  const handleSubtopicClick = (topic: string, subtopic: string) => {
    router.push(`/admin/questions?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
  };

  if (collapsed) {
    return null;
  }

  return (
    <div className="space-y-1 pt-2">
      <div className="space-y-0.5 max-h-96 overflow-y-auto">
        {hierarchy.map((superTopicData) => {
          const isSuperExpanded = expandedSuperTopics.has(superTopicData.superTopic);
          
          return (
            <div key={superTopicData.superTopic}>
              {/* Super Topic */}
              <Button
                variant="ghost"
                className="w-full justify-start px-2 h-8 text-xs font-medium"
                onClick={() => toggleSuperTopic(superTopicData.superTopic)}
              >
                {isSuperExpanded ? (
                  <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                <span className="truncate">{superTopicData.superTopic}</span>
              </Button>

              {/* Topics */}
              {isSuperExpanded && (
                <div className="ml-2 space-y-0.5">
                  {superTopicData.topics.map((topicData) => {
                    const topicKey = `${superTopicData.superTopic}-${topicData.topic}`;
                    const isTopicExpanded = expandedTopics.has(topicKey);

                    return (
                      <div key={topicKey}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-2 h-7 text-xs"
                          onClick={() => toggleTopic(topicKey)}
                        >
                          {isTopicExpanded ? (
                            <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                          )}
                          <span className="truncate">{topicData.topic}</span>
                        </Button>

                        {/* Subtopics */}
                        {isTopicExpanded && (
                          <div className="ml-4 space-y-0.5">
                            {topicData.subtopics.map((subtopicData) => (
                              <Button
                                key={subtopicData._id}
                                variant="ghost"
                                className="w-full justify-start px-2 h-6 text-xs hover:bg-primary/10"
                                onClick={() => handleSubtopicClick(topicData.topic, subtopicData.subtopic)}
                              >
                                <span className="truncate">• {subtopicData.subtopic}</span>
                                <span className="ml-auto text-[10px] text-muted-foreground">
                                  {subtopicData.questionCount}
                                </span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
