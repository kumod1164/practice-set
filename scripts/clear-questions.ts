import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

async function clearQuestions() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    // Get Questions collection
    const db = mongoose.connection.db;
    const questionsCollection = db?.collection("questions");

    if (!questionsCollection) {
      throw new Error("Questions collection not found");
    }

    // Count existing questions
    const count = await questionsCollection.countDocuments();
    console.log(`📊 Found ${count} questions in database`);

    if (count === 0) {
      console.log("✨ Database is already empty");
      process.exit(0);
    }

    // Delete all questions
    console.log("🗑️  Deleting all questions...");
    const result = await questionsCollection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} questions`);

    console.log("\n✨ Database cleared successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Prepare your real questions in JSON format");
    console.log("2. Use the bulk import feature in admin panel");
    console.log("3. Or update scripts/seed.ts with real data and run: npm run seed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

clearQuestions();
