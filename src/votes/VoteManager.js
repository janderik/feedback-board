const { v4: uuidv4 } = require('uuid');

class VoteManager {
    constructor() {
        this.votes = new Map();
    }

    vote(itemId, userId, direction) {
        const key = `${itemId}:${userId}`;
        const existing = this.votes.get(key);

        if (existing === direction) {
            this.votes.delete(key);
            return { voted: false, delta: direction === 'up' ? -1 : 1 };
        }

        let delta = 0;
        if (existing) delta = direction === 'up' ? 2 : -2;
        else delta = direction === 'up' ? 1 : -1;

        this.votes.set(key, direction);
        return { voted: true, delta };
    }

    getScore(itemId) {
        let score = 0;
        for (const [key, dir] of this.votes) {
            if (key.startsWith(itemId + ':')) {
                score += dir === 'up' ? 1 : -1;
            }
        }
        return score;
    }

    getUserVote(itemId, userId) {
        return this.votes.get(`${itemId}:${userId}`) || null;
    }
}

module.exports = VoteManager;
