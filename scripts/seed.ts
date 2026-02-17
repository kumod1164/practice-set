import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

import connectDB from "../src/lib/db";
import User from "../src/models/User";
import Question from "../src/models/Question";
import Test from "../src/models/Test";
import TestSession from "../src/models/TestSession";
import Bookmark from "../src/models/Bookmark";
import mongoose from "mongoose";

/**
 * Database seed script for development
 * This script populates the database with sample data for testing
 */

const sampleQuestions = [
  // History - Easy
  {
    topic: "History",
    subtopic: "Ancient India",
    question: "Who was the founder of the Maurya Empire?",
    options: ["Chandragupta Maurya", "Ashoka", "Bindusara", "Chanakya"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Chandragupta Maurya founded the Maurya Empire in 322 BCE with the help of his mentor Chanakya.",
    tags: ["maurya", "ancient-india", "empire"],
  },
  {
    topic: "History",
    subtopic: "Medieval India",
    question: "Which Mughal emperor built the Taj Mahal?",
    options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal between 1632 and 1653.",
    tags: ["mughal", "architecture", "taj-mahal"],
  },
  {
    topic: "History",
    subtopic: "Modern India",
    question: "In which year did India gain independence?",
    options: ["1945", "1946", "1947", "1948"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "India gained independence from British rule on August 15, 1947.",
    tags: ["independence", "modern-india"],
  },
  // History - Medium
  {
    topic: "History",
    subtopic: "Ancient India",
    question: "Which of the following was NOT a part of the Triratna in Buddhism?",
    options: ["Buddha", "Dhamma", "Sangha", "Karma"],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "The Triratna (Three Jewels) in Buddhism consists of Buddha, Dhamma (teachings), and Sangha (community). Karma is a concept but not part of Triratna.",
    tags: ["buddhism", "religion", "ancient-india"],
  },
  {
    topic: "History",
    subtopic: "Medieval India",
    question: "The Vijayanagara Empire was founded in which year?",
    options: ["1336", "1346", "1356", "1366"],
    correctAnswer: 0,
    difficulty: "medium",
    explanation: "The Vijayanagara Empire was founded in 1336 CE by Harihara I and Bukka Raya I.",
    tags: ["vijayanagara", "medieval-india", "empire"],
  },
  // History - Hard
  {
    topic: "History",
    subtopic: "Ancient India",
    question: "Which Gupta ruler performed the Ashvamedha sacrifice?",
    options: ["Chandragupta I", "Samudragupta", "Chandragupta II", "Kumaragupta I"],
    correctAnswer: 1,
    difficulty: "hard",
    explanation: "Samudragupta performed the Ashvamedha sacrifice to assert his sovereignty and imperial status.",
    tags: ["gupta", "ancient-india", "rituals"],
  },
  // Geography - Easy
  {
    topic: "Geography",
    subtopic: "Physical Geography",
    question: "Which is the longest river in India?",
    options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The Ganga (Ganges) is the longest river in India, flowing for about 2,525 km.",
    tags: ["rivers", "physical-geography"],
  },
  {
    topic: "Geography",
    subtopic: "Physical Geography",
    question: "Which mountain range separates India from Tibet?",
    options: ["Aravalli", "Vindhya", "Himalaya", "Western Ghats"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "The Himalayan mountain range forms a natural barrier between India and Tibet.",
    tags: ["mountains", "physical-geography"],
  },
  // Geography - Medium
  {
    topic: "Geography",
    subtopic: "Climate",
    question: "Which type of climate is found in the Thar Desert?",
    options: ["Tropical Wet", "Tropical Dry", "Subtropical Humid", "Hot Desert"],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "The Thar Desert experiences a hot desert climate with very low rainfall and extreme temperatures.",
    tags: ["climate", "desert", "thar"],
  },
  {
    topic: "Geography",
    subtopic: "Economic Geography",
    question: "Which state is the largest producer of coffee in India?",
    options: ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh"],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "Karnataka is the largest coffee-producing state in India, accounting for about 70% of total production.",
    tags: ["agriculture", "coffee", "economic-geography"],
  },
  // Polity - Easy
  {
    topic: "Polity",
    subtopic: "Constitution",
    question: "How many fundamental rights are guaranteed by the Indian Constitution?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The Indian Constitution guarantees 6 fundamental rights (originally 7, but the Right to Property was removed).",
    tags: ["constitution", "fundamental-rights"],
  },
  {
    topic: "Polity",
    subtopic: "Parliament",
    question: "What is the maximum strength of the Lok Sabha?",
    options: ["530", "545", "552", "560"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "The maximum strength of the Lok Sabha is 552 members (530 from states, 20 from UTs, and 2 nominated).",
    tags: ["parliament", "lok-sabha"],
  },
  // Polity - Medium
  {
    topic: "Polity",
    subtopic: "Judiciary",
    question: "Which article of the Constitution deals with the appointment of the Chief Justice of India?",
    options: ["Article 124", "Article 125", "Article 126", "Article 127"],
    correctAnswer: 0,
    difficulty: "medium",
    explanation: "Article 124 deals with the establishment and constitution of the Supreme Court, including the appointment of the Chief Justice.",
    tags: ["judiciary", "supreme-court", "articles"],
  },
  // Economy - Easy
  {
    topic: "Economy",
    subtopic: "Banking",
    question: "What does RBI stand for?",
    options: ["Reserve Bank of India", "Regional Bank of India", "Rural Bank of India", "Retail Bank of India"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "RBI stands for Reserve Bank of India, which is the central bank of India.",
    tags: ["banking", "rbi"],
  },
  {
    topic: "Economy",
    subtopic: "Budget",
    question: "Which type of tax is GST?",
    options: ["Direct Tax", "Indirect Tax", "Property Tax", "Income Tax"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services.",
    tags: ["taxation", "gst"],
  },
  // Economy - Medium
  {
    topic: "Economy",
    subtopic: "Economic Development",
    question: "What is the base year for calculating GDP in India currently?",
    options: ["2004-05", "2010-11", "2011-12", "2015-16"],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The current base year for calculating GDP in India is 2011-12.",
    tags: ["gdp", "economic-indicators"],
  },
  // Science & Technology - Easy
  {
    topic: "Science & Technology",
    subtopic: "Space",
    question: "Which organization is responsible for India's space program?",
    options: ["DRDO", "ISRO", "BARC", "CSIR"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "ISRO (Indian Space Research Organisation) is responsible for India's space program.",
    tags: ["space", "isro"],
  },
  {
    topic: "Science & Technology",
    subtopic: "Physics",
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The SI unit of electric current is Ampere (A).",
    tags: ["physics", "units"],
  },
  // Science & Technology - Medium
  {
    topic: "Science & Technology",
    subtopic: "Biology",
    question: "Which vitamin is produced when skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "Vitamin D is synthesized in the skin when exposed to ultraviolet B (UVB) radiation from sunlight.",
    tags: ["biology", "vitamins", "health"],
  },
  // Environment - Easy
  {
    topic: "Environment",
    subtopic: "Ecology",
    question: "Which gas is primarily responsible for global warming?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Carbon dioxide (CO2) is the primary greenhouse gas responsible for global warming.",
    tags: ["climate-change", "greenhouse-gases"],
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});
    await TestSession.deleteMany({});
    await Bookmark.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create sample users
    console.log("👤 Creating sample users...");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    
    const adminUser = await User.create({
      email: adminEmail,
      name: "Admin User",
      role: "admin",
    });

    const regularUser = await User.create({
      email: "user@example.com",
      name: "Test User",
      role: "user",
    });

    console.log(`✅ Created admin user: ${adminUser.email}`);
    console.log(`✅ Created regular user: ${regularUser.email}`);

    // Create sample questions
    console.log("📝 Creating sample questions...");
    const questions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Created ${questions.length} sample questions`);

    // Create a sample completed test for the regular user
    console.log("📊 Creating sample test history...");
    const testQuestions = questions.slice(0, 10);
    const sampleAnswers = [0, 2, 2, 3, 0, 1, 1, 2, 3, 2]; // Mix of correct and incorrect
    const markedForReview = [false, false, true, false, false, true, false, false, false, false];

    // Calculate results
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unansweredQuestions = 0;

    testQuestions.forEach((q, idx) => {
      if (sampleAnswers[idx] === null) {
        unansweredQuestions++;
      } else if (sampleAnswers[idx] === q.correctAnswer) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });

    // Calculate topic-wise performance
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    testQuestions.forEach((q, idx) => {
      if (!topicPerformance.has(q.topic)) {
        topicPerformance.set(q.topic, { correct: 0, total: 0 });
      }
      const perf = topicPerformance.get(q.topic)!;
      perf.total++;
      if (sampleAnswers[idx] === q.correctAnswer) {
        perf.correct++;
      }
    });

    const topicWisePerformance = Array.from(topicPerformance.entries()).map(([topic, perf]) => ({
      topic,
      correct: perf.correct,
      total: perf.total,
      accuracy: (perf.correct / perf.total) * 100,
    }));

    // Calculate difficulty-wise performance
    const difficultyPerformance = new Map<string, { correct: number; total: number }>();
    testQuestions.forEach((q, idx) => {
      if (!difficultyPerformance.has(q.difficulty)) {
        difficultyPerformance.set(q.difficulty, { correct: 0, total: 0 });
      }
      const perf = difficultyPerformance.get(q.difficulty)!;
      perf.total++;
      if (sampleAnswers[idx] === q.correctAnswer) {
        perf.correct++;
      }
    });

    const difficultyWisePerformance = Array.from(difficultyPerformance.entries()).map(
      ([difficulty, perf]) => ({
        difficulty: difficulty as "easy" | "medium" | "hard",
        correct: perf.correct,
        total: perf.total,
        accuracy: (perf.correct / perf.total) * 100,
      })
    );

    const sampleTest = await Test.create({
      userId: regularUser._id,
      questions: testQuestions.map((q) => q._id),
      answers: sampleAnswers,
      markedForReview,
      score: correctAnswers,
      totalQuestions: testQuestions.length,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      timeTaken: 720, // 12 minutes in seconds
      timeExtensions: 0,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 720000), // 12 minutes after start
      topicWisePerformance,
      difficultyWisePerformance,
    });

    console.log(`✅ Created sample test with ID: ${sampleTest._id}`);

    // Create sample bookmarks
    console.log("🔖 Creating sample bookmarks...");
    const bookmarkedQuestions = questions.slice(0, 3);
    const bookmarks = await Bookmark.insertMany(
      bookmarkedQuestions.map((q) => ({
        userId: regularUser._id,
        questionId: q._id,
      }))
    );
    console.log(`✅ Created ${bookmarks.length} sample bookmarks`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: 2 (1 admin, 1 regular)`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - Tests: 1`);
    console.log(`   - Bookmarks: ${bookmarks.length}`);
    console.log("\n💡 You can now log in with:");
    console.log(`   Admin: ${adminUser.email}`);
    console.log(`   User: ${regularUser.email}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
  }
}

// Run the seed function
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
