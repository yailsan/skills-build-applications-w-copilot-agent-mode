import express from 'express';
import './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl: baseUrl, port });
});

app.get('/api/users', async (_req, res) => {
  const users = await User.find().sort({ createdAt: 1 }).lean();
  res.json({ apiBaseUrl: baseUrl, users });
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().sort({ createdAt: 1 }).lean();
  res.json({ apiBaseUrl: baseUrl, teams });
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().sort({ date: 1 }).lean();
  res.json({ apiBaseUrl: baseUrl, activities });
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().sort({ rank: 1 }).lean();
  res.json({ apiBaseUrl: baseUrl, leaderboard });
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await Workout.find().sort({ createdAt: 1 }).lean();
  res.json({ apiBaseUrl: baseUrl, workouts });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit backend listening on port ${port}`);
  console.log(`API base URL: ${baseUrl}`);
});
