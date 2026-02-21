import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { questionService } from "@/lib/services/question-service";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";
import { TestConfigSchema, validate } from "@/lib/validations";

/**
 * POST /api/tests/start
 * Create test session and select questions
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthAPI();
    const body = await request.json();

    // Validate configuration
    const validation = validate(TestConfigSchema, body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid configuration",
          errors: validation.errors.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const config = {
      ...validation.data,
      userId: session.user.id,
    };

    // Select questions for test
    const questions = await questionService.selectQuestionsForTest(config);

    console.log(`Selected ${questions.length} questions for test (requested: ${config.questionCount})`);

    // Create test session
    const testSession = await testService.createTestSession(
      session.user.id,
      questions
    );

    console.log(`Test session created with ${testSession.questions.length} questions`);

    return Response.json(
      {
        success: true,
        data: {
          sessionId: testSession._id,
          questionCount: questions.length,
          durationMinutes: Math.ceil(questions.length * 1.2),
        },
        message: "Test started successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
