import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";
import { MarkForReviewSchema, validate } from "@/lib/validations";

/**
 * PUT /api/tests/session/mark-review
 * Toggle mark for review flag
 */
export async function PUT(request: NextRequest) {
  try {
    await requireAuthAPI();
    const body = await request.json();

    // Validate input
    const validation = validate(MarkForReviewSchema, body);
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

    const { sessionId, questionIndex } = validation.data;

    await testService.toggleMarkForReview(sessionId, questionIndex);

    return Response.json({
      success: true,
      message: "Mark status updated successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
