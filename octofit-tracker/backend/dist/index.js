"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl: baseUrl, port });
});
app.get('/api/users', async (_req, res) => {
    const users = await models_1.User.find().sort({ createdAt: 1 }).lean();
    res.json({ apiBaseUrl: baseUrl, users });
});
app.get('/api/teams', async (_req, res) => {
    const teams = await models_1.Team.find().sort({ createdAt: 1 }).lean();
    res.json({ apiBaseUrl: baseUrl, teams });
});
app.get('/api/activities', async (_req, res) => {
    const activities = await models_1.Activity.find().sort({ date: 1 }).lean();
    res.json({ apiBaseUrl: baseUrl, activities });
});
app.get('/api/leaderboard', async (_req, res) => {
    const leaderboard = await models_1.LeaderboardEntry.find().sort({ rank: 1 }).lean();
    res.json({ apiBaseUrl: baseUrl, leaderboard });
});
app.get('/api/workouts', async (_req, res) => {
    const workouts = await models_1.Workout.find().sort({ createdAt: 1 }).lean();
    res.json({ apiBaseUrl: baseUrl, workouts });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
});
