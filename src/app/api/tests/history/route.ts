import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { testService } from "@/lib/services/test-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/tests/history
 * Get test history for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    const tests = await testService.getTestHistory(session.user.id, limit, skip);

    return Response.json({
      success: true,
      data: tests,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
