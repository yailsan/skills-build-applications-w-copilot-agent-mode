"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const createApp = (baseUrl, port) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
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
    return app;
};
exports.createApp = createApp;
const startServer = () => {
    const port = Number(process.env.PORT || 8000);
    const codespaceNameEnv = process.env.CODESPACE_NAME;
    const baseUrl = codespaceNameEnv
        ? `https://${codespaceNameEnv}-8000.app.github.dev`
        : `http://localhost:${port}`;
    const app = (0, exports.createApp)(baseUrl, port);
    return app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit backend listening on port ${port}`);
        console.log(`API base URL: ${baseUrl}`);
    });
};
exports.startServer = startServer;
