import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";
import { AnswerSchema, validate } from "@/lib/validations";

/**
 * PUT /api/tests/session/answer
 * Save answer for a question
 */
export async function PUT(request: NextRequest) {
  try {
    await requireAuthAPI();
    const body = await request.json();

    // Validate input
    const validation = validate(AnswerSchema, body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid input",
          errors: validation.errors.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { sessionId, questionIndex, answer } = validation.data;

    await testService.saveAnswer(sessionId, questionIndex, answer as 0 | 1 | 2 | 3);

    return Response.json({
      success: true,
      message: "Answer saved successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
