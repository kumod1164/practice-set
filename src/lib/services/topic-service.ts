import connectDB from "../db";
import Topic, { ITopic } from "@/models/Topic";
import Question from "@/models/Question";
import Test from "@/models/Test";
import { ValidationError, NotFoundError, DatabaseError } from "../errors";

export interface TopicHierarchy {
  superTopic: string;
  topics: {
    topic: string;
    subtopics: {
      subtopic: string;
      questionCount: number;
      _id: string;
    }[];
  }[];
}

export interface CreateTopicInput {
  superTopic: string;
  topic: string;
  subtopic: string;
  order?: number;
}

export interface RenameTopicInput {
  oldSuperTopic?: string;
  newSuperTopic?: string;
  oldTopic?: string;
  newTopic?: string;
  oldSubtopic?: string;
  newSubtopic?: string;
}

export class TopicService {
  /**
   * Get complete topic hierarchy
   */
  async getTopicHierarchy(): Promise<TopicHierarchy[]> {
    try {
      await connectDB();

      const topics = await Topic.find({ isActive: true }).sort({ superTopic: 1, order: 1 });

      // Group by super topic
      const hierarchyMap = new Map<string, TopicHierarchy>();

      topics.forEach((topic) => {
        if (!hierarchyMap.has(topic.superTopic)) {
          hierarchyMap.set(topic.superTopic, {
            superTopic: topic.superTopic,
            topics: [],
          });
        }

        const superTopicData = hierarchyMap.get(topic.superTopic)!;
        let topicData = superTopicData.topics.find((t) => t.topic === topic.topic);

        if (!topicData) {
          topicData = { topic: topic.topic, subtopics: [] };
          superTopicData.topics.push(topicData);
        }

        topicData.subtopics.push({
          subtopic: topic.subtopic,
          questionCount: topic.questionCount,
          _id: topic._id.toString(),
        });
      });

      return Array.from(hierarchyMap.values());
    } catch (error) {
      throw new DatabaseError("Failed to fetch topic hierarchy");
    }
  }

  /**
   * Create a new topic entry
   */
  async createTopic(data: CreateTopicInput): Promise<ITopic> {
    try {
      await connectDB();

      // Check if already exists
      const existing = await Topic.findOne({
        superTopic: data.superTopic,
        topic: data.topic,
        subtopic: data.subtopic,
      });

      if (existing) {
        throw new ValidationError("This topic combination already exists");
      }

      // Count existing questions for this combination
      const questionCount = await Question.countDocuments({
        topic: data.topic,
        subtopic: data.subtopic,
      });

      const topic = await Topic.create({
        ...data,
        questionCount,
      });

      return topic;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to create topic");
    }
  }

  /**
   * Update topic order
   */
  async updateTopicOrder(topicId: string, newOrder: number): Promise<ITopic> {
    try {
      await connectDB();

      const topic = await Topic.findByIdAndUpdate(
        topicId,
        { order: newOrder },
        { new: true }
      );

      if (!topic) {
        throw new NotFoundError("Topic");
      }

      return topic;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to update topic order");
    }
  }

  /**
   * Delete a topic entry
   */
  async deleteTopic(topicId: string): Promise<void> {
    try {
      await connectDB();

      const topic = await Topic.findByIdAndDelete(topicId);

      if (!topic) {
        throw new NotFoundError("Topic");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to delete topic");
    }
  }

  /**
   * Rename topics and update all related questions and tests
   */
  async renameTopic(data: RenameTopicInput): Promise<{ questionsUpdated: number; testsUpdated: number }> {
    try {
      await connectDB();

      let questionsUpdated = 0;
      let testsUpdated = 0;

      // Rename subtopic
      if (data.oldSubtopic && data.newSubtopic && data.oldTopic) {
        // Update questions
        const questionResult = await Question.updateMany(
          { topic: data.oldTopic, subtopic: data.oldSubtopic },
          { $set: { subtopic: data.newSubtopic } }
        );
        questionsUpdated = questionResult.modifiedCount;

        // Update topic entries
        await Topic.updateMany(
          { topic: data.oldTopic, subtopic: data.oldSubtopic },
          { $set: { subtopic: data.newSubtopic } }
        );
      }

      // Rename topic
      if (data.oldTopic && data.newTopic) {
        // Update questions
        const questionResult = await Question.updateMany(
          { topic: data.oldTopic },
          { $set: { topic: data.newTopic } }
        );
        questionsUpdated = questionResult.modifiedCount;

        // Update topic entries
        await Topic.updateMany(
          { topic: data.oldTopic },
          { $set: { topic: data.newTopic } }
        );

        // Update historical test records
        const testResult = await Test.updateMany(
          { "topicWisePerformance.topic": data.oldTopic },
          { $set: { "topicWisePerformance.$[elem].topic": data.newTopic } },
          { arrayFilters: [{ "elem.topic": data.oldTopic }] }
        );
        testsUpdated = testResult.modifiedCount;
      }

      // Rename super topic
      if (data.oldSuperTopic && data.newSuperTopic) {
        await Topic.updateMany(
          { superTopic: data.oldSuperTopic },
          { $set: { superTopic: data.newSuperTopic } }
        );
      }

      return { questionsUpdated, testsUpdated };
    } catch (error) {
      throw new DatabaseError("Failed to rename topic");
    }
  }

  /**
   * Sync topics from existing questions
   * This creates topic entries for all question combinations
   */
  async syncTopicsFromQuestions(): Promise<{ created: number; updated: number }> {
    try {
      await connectDB();

      // Get all unique topic/subtopic combinations from questions
      const combinations = await Question.aggregate([
        {
          $group: {
            _id: {
              topic: "$topic",
              subtopic: "$subtopic",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      let created = 0;
      let updated = 0;

      for (const combo of combinations) {
        const { topic, subtopic } = combo._id;
        const count = combo.count;

        // Try to find existing topic entry
        const existing = await Topic.findOne({ topic, subtopic });

        if (existing) {
          // Update question count
          await Topic.updateOne(
            { _id: existing._id },
            { $set: { questionCount: count } }
          );
          updated++;
        } else {
          // Create new entry with topic as super topic (default)
          await Topic.create({
            superTopic: topic,
            topic: topic,
            subtopic: subtopic,
            questionCount: count,
            order: 0,
          });
          created++;
        }
      }

      return { created, updated };
    } catch (error) {
      throw new DatabaseError("Failed to sync topics");
    }
  }

  /**
   * Update question counts for all topics
   */
  async updateQuestionCounts(): Promise<void> {
    try {
      await connectDB();

      const topics = await Topic.find();

      for (const topic of topics) {
        const count = await Question.countDocuments({
          topic: topic.topic,
          subtopic: topic.subtopic,
        });

        await Topic.updateOne(
          { _id: topic._id },
          { $set: { questionCount: count } }
        );
      }
    } catch (error) {
      throw new DatabaseError("Failed to update question counts");
    }
  }
}

// Export singleton instance
export const topicService = new TopicService();
