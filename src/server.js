const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const VoteManager = require('./votes/VoteManager');

const app = express();
const PORT = process.env.PORT || 3000;
const voteManager = new VoteManager();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const feedbackItems = new Map();
const statuses = ['idea', 'planned', 'in-progress', 'done', 'declined'];

app.post('/api/feedback', (req, res) => {
    const { title, description, category, author } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const item = {
        id: uuidv4().slice(0, 8),
        title, description: description || '', category: category || 'general',
        author: author || 'Anonymous', status: 'idea',
        createdAt: new Date().toISOString(), comments: []
    };
    feedbackItems.set(item.id, item);
    res.json(item);
});

app.get('/api/feedback', (req, res) => {
    const { status, category, sort } = req.query;
    let items = Array.from(feedbackItems.values());
    if (status) items = items.filter(i => i.status === status);
    if (category) items = items.filter(i => i.category === category);
    if (sort === 'votes') items.sort((a, b) => voteManager.getScore(b.id) - voteManager.getScore(a.id));
    else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items.map(i => ({ ...i, score: voteManager.getScore(i.id) })));
});

app.get('/api/feedback/:id', (req, res) => {
    const item = feedbackItems.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ...item, score: voteManager.getScore(item.id) });
});

app.put('/api/feedback/:id', (req, res) => {
    const item = feedbackItems.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { status } = req.body;
    if (status && statuses.includes(status)) item.status = status;
    feedbackItems.set(item.id, item);
    res.json(item);
});

app.delete('/api/feedback/:id', (req, res) => {
    if (feedbackItems.delete(req.params.id)) res.json({ message: 'Deleted' });
    else res.status(404).json({ error: 'Not found' });
});

app.post('/api/feedback/:id/vote', (req, res) => {
    const item = feedbackItems.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { direction, userId = 'default' } = req.body;
    if (!['up', 'down'].includes(direction)) return res.status(400).json({ error: 'Invalid direction' });
    const result = voteManager.vote(req.params.id, userId, direction);
    res.json({ ...result, score: voteManager.getScore(req.params.id) });
});

app.post('/api/feedback/:id/comments', (req, res) => {
    const item = feedbackItems.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { content, author } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });
    item.comments.push({ id: uuidv4().slice(0, 8), content, author: author || 'Anonymous', createdAt: new Date().toISOString() });
    feedbackItems.set(item.id, item);
    res.json(item);
});

app.get('/api/stats', (req, res) => {
    const items = Array.from(feedbackItems.values());
    res.json({
        total: items.length,
        byStatus: statuses.reduce((acc, s) => { acc[s] = items.filter(i => i.status === s).length; return acc; }, {}),
        byCategory: [...new Set(items.map(i => i.category))].reduce((acc, c) => { acc[c] = items.filter(i => i.category === c).length; return acc; }, {})
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.listen(PORT, () => console.log(`Feedback board running on http://localhost:${PORT}`));
