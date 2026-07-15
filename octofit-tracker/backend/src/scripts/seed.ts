import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Maya Chen',
        email: 'maya@example.com',
        fitnessGoal: 'marathon training',
        streak: 14,
      },
      {
        name: 'Liam Patel',
        email: 'liam@example.com',
        fitnessGoal: 'strength building',
        streak: 9,
      },
      {
        name: 'Sofia Alvarez',
        email: 'sofia@example.com',
        fitnessGoal: 'mobility and recovery',
        streak: 11,
      },
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Northwind Cyclists',
        members: 8,
        focus: 'Cycling',
      },
      {
        name: 'Harbor Runners',
        members: 6,
        focus: 'Running',
      },
      {
        name: 'Tide Strength Club',
        members: 7,
        focus: 'Strength',
      },
    ]);

    await Activity.insertMany([
      {
        type: 'run',
        durationMinutes: 32,
        calories: 360,
        date: '2026-07-14',
        user: users[0].name,
      },
      {
        type: 'strength',
        durationMinutes: 45,
        calories: 280,
        date: '2026-07-13',
        user: users[1].name,
      },
      {
        type: 'cycle',
        durationMinutes: 60,
        calories: 610,
        date: '2026-07-12',
        user: users[2].name,
      },
    ]);

    await LeaderboardEntry.insertMany([
      { rank: 1, user: users[0].name, points: 980, team: teams[0].name },
      { rank: 2, user: users[1].name, points: 912, team: teams[1].name },
      { rank: 3, user: users[2].name, points: 895, team: teams[2].name },
    ]);

    await Workout.insertMany([
      {
        title: 'HIIT Intervals',
        durationMinutes: 25,
        level: 'Intermediate',
        focus: 'Cardio',
      },
      {
        title: 'Mobility Flow',
        durationMinutes: 20,
        level: 'Beginner',
        focus: 'Recovery',
      },
      {
        title: 'Power Strength Circuit',
        durationMinutes: 40,
        level: 'Advanced',
        focus: 'Strength',
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
