import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { topicService } from "@/lib/services/topic-service";
import { handleAPIError } from "@/lib/errors";

/**
 * DELETE /api/admin/topics/[id]
 * Delete a topic
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    await topicService.deleteTopic(id);

    return Response.json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * PATCH /api/admin/topics/[id]
 * Update topic order
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();

    const topic = await topicService.updateTopicOrder(id, body.order);

    return Response.json({
      success: true,
      data: topic,
      message: "Topic order updated successfully",
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
