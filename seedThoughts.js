// seedThoughts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Thought from "./models/Thought.js";

dotenv.config();

const sampleThoughts = [
  {
    title: "Dream Bigger",
    content: "Don’t limit your goals based on current ability. Plan for who you want to become.",
    category: "Goal",
    tags: ["motivation", "growth", "future"],
    isFavorite: false,
    createdAt: new Date("2025-01-01T08:00:00Z"),
    updatedAt: new Date("2025-01-01T08:00:00Z"),
  },
  {
    title: "Build Before You’re Ready",
    content: "Waiting for perfect timing kills momentum. Start messy and refine later.",
    category: "Learning",
    tags: ["startups", "execution"],
    isFavorite: true,
    createdAt: new Date("2025-02-10T09:30:00Z"),
    updatedAt: new Date("2025-02-10T09:30:00Z"),
  },
  {
    title: "The 80/20 Reminder",
    content: "Focus on the 20% that gives 80% of results. Eliminate the rest.",
    category: "Reminder",
    tags: ["productivity", "focus"],
    isFavorite: false,
    createdAt: new Date("2025-03-03T07:15:00Z"),
    updatedAt: new Date("2025-03-03T07:15:00Z"),
  },
  {
    title: "Your Thoughts Shape Reality",
    content: "You act according to what you repeatedly think. So think better.",
    category: "Quote",
    tags: ["mindset", "psychology"],
    isFavorite: false,
    createdAt: new Date("2025-04-12T12:00:00Z"),
    updatedAt: new Date("2025-04-12T12:00:00Z"),
  },
  {
    title: "Idea Vault #101",
    content: "An AI that helps students remember concepts using their own notes and quizzes.",
    category: "Idea",
    tags: ["ai", "education"],
    isFavorite: false,
    createdAt: new Date("2025-04-25T18:45:00Z"),
    updatedAt: new Date("2025-04-25T18:45:00Z"),
  },
  {
    title: "Micro Wins, Macro Impact",
    content: "Small, consistent wins stack into something unstoppable.",
    category: "Goal",
    tags: ["consistency", "discipline"],
    isFavorite: false,
    createdAt: new Date("2025-05-02T06:20:00Z"),
    updatedAt: new Date("2025-05-02T06:20:00Z"),
  },
  {
    title: "Code is Art",
    content: "Every function tells a story. Write like someone will read it a year later.",
    category: "Learning",
    tags: ["programming", "craft"],
    isFavorite: true,
    createdAt: new Date("2025-06-11T14:10:00Z"),
    updatedAt: new Date("2025-06-11T14:10:00Z"),
  },
  {
    title: "Default Alive",
    content: "Your project must survive without new funding — build something people actually use.",
    category: "Reminder",
    tags: ["startups", "revenue"],
    isFavorite: true,
    createdAt: new Date("2025-07-07T11:05:00Z"),
    updatedAt: new Date("2025-07-07T11:05:00Z"),
  },
  {
    title: "Clarity Over Complexity",
    content: "Simple code and simple systems always win long-term.",
    category: "Quote",
    tags: ["design", "simplicity"],
    isFavorite: true,
    createdAt: new Date("2025-08-19T10:00:00Z"),
    updatedAt: new Date("2025-08-19T10:00:00Z"),
  },
  {
    title: "The Random Spark",
    content: "Sometimes ideas hit at 3AM — note them. They might change everything.",
    category: "Random",
    tags: ["creativity", "inspiration"],
    isFavorite: true,
    createdAt: new Date("2025-09-01T03:00:00Z"),
    updatedAt: new Date("2025-09-01T03:00:00Z"),
  },
];

const seedThoughts = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGO_URI in .env — add it and retry.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected.");

    // wipe existing documents (you asked for full seed)
    await Thought.deleteMany();
    console.log("🧹 Cleared existing Thought documents.");

    // insert sample data (all fields included)
    await Thought.insertMany(sampleThoughts);
    console.log(`🌱 Inserted ${sampleThoughts.length} thoughts.`);

    // close connection cleanly
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed. Done.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedThoughts();
