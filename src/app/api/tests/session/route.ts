import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/tests/session
 * Get current test session for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    const testSession = await testService.getTestSession(session.user.id);

    if (!testSession) {
      return Response.json({
        success: true,
        data: null,
      });
    }

    return Response.json({
      success: true,
      data: testSession,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
