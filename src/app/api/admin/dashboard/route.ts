import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Test from "@/models/Test";
import Question from "@/models/Question";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/admin/dashboard
 * Get all users and their performance data (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    // Check if user is admin
    if (session.user.role !== "admin") {
      return Response.json(
        {
          success: false,
          error: "Unauthorized. Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all users
    const allUsers = await User.find({}).lean();

    // Get all tests
    const allTests = await Test.find({}).lean();

    // Calculate stats for each user
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const userTests = allTests.filter(
          (test) => test.userId.toString() === user._id.toString()
        );

        if (userTests.length === 0) {
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            totalTests: 0,
            averageScore: 0,
            totalTimeSpent: 0,
            lastTestDate: null,
            strongTopics: [],
            weakTopics: [],
          };
        }

        // Calculate average score
        const totalScore = userTests.reduce((sum, test) => {
          return sum + (test.correctAnswers / test.totalQuestions) * 100;
        }, 0);
        const averageScore = totalScore / userTests.length;

        // Calculate total time spent
        const totalTimeSpent = userTests.reduce((sum, test) => sum + test.timeTaken, 0);

        // Get last test date
        const lastTestDate = userTests.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        )[0].submittedAt;

        // Calculate topic-wise performance
        const topicPerformance = new Map<string, { correct: number; total: number }>();
        
        userTests.forEach((test) => {
          test.topicWisePerformance?.forEach((perf: any) => {
            if (!topicPerformance.has(perf.topic)) {
              topicPerformance.set(perf.topic, { correct: 0, total: 0 });
            }
            const existing = topicPerformance.get(perf.topic)!;
            existing.correct += perf.correct;
            existing.total += perf.total;
          });
        });

        // Identify strong and weak topics
        const strongTopics: string[] = [];
        const weakTopics: string[] = [];

        topicPerformance.forEach((perf, topic) => {
          const accuracy = (perf.correct / perf.total) * 100;
          if (accuracy >= 80) {
            strongTopics.push(topic);
          } else if (accuracy < 60) {
            weakTopics.push(topic);
          }
        });

        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          totalTests: userTests.length,
          averageScore,
          totalTimeSpent,
          lastTestDate,
          strongTopics,
          weakTopics,
        };
      })
    );

    // Calculate overall platform stats
    const totalUsers = allUsers.length;
    const totalTests = allTests.length;
    const totalQuestions = allTests.reduce((sum, test) => sum + test.totalQuestions, 0);
    const averageScore =
      allTests.length > 0
        ? allTests.reduce((sum, test) => {
            return sum + (test.correctAnswers / test.totalQuestions) * 100;
          }, 0) / allTests.length
        : 0;

    return Response.json({
      success: true,
      data: {
        users: usersWithStats,
        overallStats: {
          totalUsers,
          totalTests,
          totalQuestions,
          averageScore,
        },
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
