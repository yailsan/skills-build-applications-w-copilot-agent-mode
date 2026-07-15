import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  fitnessGoal: string;
  streak: number;
  createdAt: Date;
}

export interface ITeam extends Document {
  name: string;
  members: number;
  focus: string;
  createdAt: Date;
}

export interface IActivity extends Document {
  type: string;
  durationMinutes: number;
  calories: number;
  date: string;
  user: string;
  createdAt: Date;
}

export interface ILeaderboardEntry extends Document {
  rank: number;
  user: string;
  points: number;
  team: string;
  createdAt: Date;
}

export interface IWorkout extends Document {
  title: string;
  durationMinutes: number;
  level: string;
  focus: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  fitnessGoal: { type: String, required: true, trim: true },
  streak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, trim: true },
  members: { type: Number, required: true, min: 1 },
  focus: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const activitySchema = new Schema<IActivity>({
  type: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  calories: { type: Number, required: true, min: 0 },
  date: { type: String, required: true },
  user: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  rank: { type: Number, required: true, min: 1 },
  user: { type: String, required: true, trim: true },
  points: { type: Number, required: true, min: 0 },
  team: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const workoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  level: { type: String, required: true, trim: true },
  focus: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
