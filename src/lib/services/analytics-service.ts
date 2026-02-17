import connectDB from "../db";
import Test from "@/models/Test";
import { DatabaseError } from "../errors";

export interface UserStats {
  totalTests: number;
  averageScore: number;
  totalQuestions: number;
  totalTimeSpent: number;
  strongTopics: string[];
  weakTopics: string[];
}

export interface ChartData {
  labels: string[];
  scores: number[];
  dates: Date[];
}

export interface TopicStrength {
  topic: string;
  testsAttempted: number;
  averageAccuracy: number;
}

export class AnalyticsService {
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      await connectDB();

      const tests = await Test.find({ userId }).sort({ submittedAt: -1 });

      if (tests.length === 0) {
        return {
          totalTests: 0,
          averageScore: 0,
          totalQuestions: 0,
          totalTimeSpent: 0,
          strongTopics: [],
          weakTopics: [],
        };
      }

      const totalTests = tests.length;
      const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);
      const totalCorrect = tests.reduce((sum, test) => sum + test.correctAnswers, 0);
      const averageScore = (totalCorrect / totalQuestions) * 100;
      const totalTimeSpent = tests.reduce((sum, test) => sum + test.timeTaken, 0);

      // Calculate topic strengths
      const topicStats = new Map<string, { correct: number; total: number }>();

      tests.forEach((test) => {
        test.topicWisePerformance.forEach((perf) => {
          if (!topicStats.has(perf.topic)) {
            topicStats.set(perf.topic, { correct: 0, total: 0 });
          }
          const stats = topicStats.get(perf.topic)!;
          stats.correct += perf.correct;
          stats.total += perf.total;
        });
      });

      const topicAccuracies = Array.from(topicStats.entries()).map(([topic, stats]) => ({
        topic,
        accuracy: (stats.correct / stats.total) * 100,
      }));

      const strongTopics = topicAccuracies
        .filter((t) => t.accuracy >= 70)
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 3)
        .map((t) => t.topic);

      const weakTopics = topicAccuracies
        .filter((t) => t.accuracy < 60)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3)
        .map((t) => t.topic);

      return {
        totalTests,
        averageScore: parseFloat(averageScore.toFixed(2)),
        totalQuestions,
        totalTimeSpent,
        strongTopics,
        weakTopics,
      };
    } catch (error) {
      throw new DatabaseError("Failed to fetch user stats");
    }
  }

  async getProgressChartData(userId: string, limit: number = 10): Promise<ChartData> {
    try {
      await connectDB();

      const tests = await Test.find({ userId })
        .sort({ submittedAt: -1 })
        .limit(limit)
        .select("score totalQuestions submittedAt");

      const reversedTests = tests.reverse();

      return {
        labels: reversedTests.map((_, index) => `Test ${index + 1}`),
        scores: reversedTests.map((test) => (test.score / test.totalQuestions) * 100),
        dates: reversedTests.map((test) => test.submittedAt),
      };
    } catch (error) {
      throw new DatabaseError("Failed to fetch progress chart data");
    }
  }

  async getTopicWiseStrength(userId: string): Promise<TopicStrength[]> {
    try {
      await connectDB();

      const tests = await Test.find({ userId });

      const topicStats = new Map<string, { correct: number; total: number; count: number }>();

      tests.forEach((test) => {
        test.topicWisePerformance.forEach((perf) => {
          if (!topicStats.has(perf.topic)) {
            topicStats.set(perf.topic, { correct: 0, total: 0, count: 0 });
          }
          const stats = topicStats.get(perf.topic)!;
          stats.correct += perf.correct;
          stats.total += perf.total;
          stats.count++;
        });
      });

      return Array.from(topicStats.entries())
        .map(([topic, stats]) => ({
          topic,
          testsAttempted: stats.count,
          averageAccuracy: parseFloat(((stats.correct / stats.total) * 100).toFixed(2)),
        }))
        .sort((a, b) => b.averageAccuracy - a.averageAccuracy);
    } catch (error) {
      throw new DatabaseError("Failed to fetch topic-wise strength");
    }
  }

  async getDailyStreak(userId: string): Promise<number> {
    try {
      await connectDB();

      const tests = await Test.find({ userId })
        .sort({ submittedAt: -1 })
        .select("submittedAt");

      if (tests.length === 0) return 0;

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const test of tests) {
        const testDate = new Date(test.submittedAt);
        testDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
          (currentDate.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === streak) {
          streak++;
        } else if (diffDays > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      throw new DatabaseError("Failed to calculate daily streak");
    }
  }
}

export const analyticsService = new AnalyticsService();
