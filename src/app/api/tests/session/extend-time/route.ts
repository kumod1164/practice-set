import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";
import { TimeExtensionSchema, validate } from "@/lib/validations";

/**
 * POST /api/tests/session/extend-time
 * Request time extension
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI();
    const body = await request.json();

    // Validate input
    const validation = validate(TimeExtensionSchema, body);
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

    const { sessionId, minutes } = validation.data;

    const updatedSession = await testService.extendTime(sessionId, minutes as 5 | 10);

    return Response.json({
      success: true,
      data: {
        remainingTime: updatedSession.remainingTime,
        timeExtensions: updatedSession.timeExtensions,
      },
      message: `Time extended by ${minutes} minutes`,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
