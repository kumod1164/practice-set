import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";

/**
 * POST /api/tests/submit
 * Submit test and generate results
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI();
    const body = await request.json();

    const { sessionId } = body;

    if (!sessionId) {
      return Response.json(
        {
          success: false,
          error: "Session ID is required",
        },
        { status: 400 }
      );
    }

    const test = await testService.submitTest(sessionId);

    return Response.json({
      success: true,
      data: {
        testId: test._id,
        score: test.score,
        totalQuestions: test.totalQuestions,
        percentage: ((test.score / test.totalQuestions) * 100).toFixed(2),
      },
      message: "Test submitted successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
