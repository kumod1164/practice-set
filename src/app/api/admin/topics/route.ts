import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { topicService } from "@/lib/services/topic-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/admin/topics
 * Get topic hierarchy
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();

    const hierarchy = await topicService.getTopicHierarchy();

    return Response.json({
      success: true,
      data: hierarchy,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST /api/admin/topics
 * Create a new topic
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();

    const body = await request.json();
    const topic = await topicService.createTopic(body);

    return Response.json(
      {
        success: true,
        data: topic,
        message: "Topic created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
