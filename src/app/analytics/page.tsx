"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!stats || stats.totalTests === 0) {
    return (
      <>
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Take some tests to see your detailed analytics here
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuestions} questions attempted
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
            <Progress value={stats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalTimeSpent / 3600)}h {Math.floor((stats.totalTimeSpent % 3600) / 60)}m
            </div>
            <p className="text-xs text-muted-foreground">Total practice time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic-wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Topic-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topicStrength.map((topic: any, index: number) => (
              <div key={topic.topic}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{topic.topic}</span>
                    {topic.averageAccuracy >= 80 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : topic.averageAccuracy < 60 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold">
                    {topic.averageAccuracy.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={topic.averageAccuracy} 
                  className={
                    topic.averageAccuracy >= 80 
                      ? "bg-green-100 [&>div]:bg-green-500" 
                      : topic.averageAccuracy < 60 
                      ? "bg-red-100 [&>div]:bg-red-500" 
                      : ""
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {topic.totalAttempted} questions attempted
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Strengths & Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.strongTopics.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  Strong Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.strongTopics.map((topic: string) => (
                    <Badge 
                      key={topic} 
                      className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {stats.weakTopics.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  Needs Improvement
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.weakTopics.map((topic: string) => (
                    <Badge 
                      key={topic} 
                      className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {stats.strongTopics.length === 0 && stats.weakTopics.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Take more tests to see your strengths and weaknesses
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats.averageScore < 60 && (
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span className="text-sm">
                  Your average score is below 60%. Focus on understanding concepts rather than memorization.
                </span>
              </li>
            )}
            {stats.weakTopics.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span className="text-sm">
                  Practice more questions on: {stats.weakTopics.join(", ")}
                </span>
              </li>
            )}
            {stats.streak === 0 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span className="text-sm">
                  Start a daily practice streak to improve retention and consistency.
                </span>
              </li>
            )}
            {stats.totalTests < 5 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span className="text-sm">
                  Take more tests to get better insights into your performance.
                </span>
              </li>
            )}
            {stats.averageScore >= 80 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span className="text-sm">
                  Great job! Try increasing difficulty or exploring new topics to challenge yourself.
                </span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
