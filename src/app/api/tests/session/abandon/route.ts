import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";

/**
 * DELETE /api/tests/session/abandon
 * POST /api/tests/session/abandon
 * Abandon current test session
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    await testService.abandonTestSession(session.user.id);

    return Response.json({
      success: true,
      message: "Test session abandoned successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

// Support POST method as well
export async function POST(request: NextRequest) {
  return DELETE(request);
}
