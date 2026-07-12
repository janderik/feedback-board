# feedback-board

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18+-black.svg?style=flat&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A feedback collection and voting platform for product teams. Collect user feedback, prioritize with upvotes, and track feature progress through a visual pipeline.

## Features

- **Submit Feedback** - Users submit ideas, bugs, and improvements
- **Upvote/Downvote** - Community-driven prioritization
- **Status Pipeline** - Track from Idea → Planned → In Progress → Done
- **Categories** - Organize by Feature, Bug, Improvement, General
- **Filtering** - Filter by status and category
- **Sorting** - Sort by newest or most votes
- **No Database** - In-memory storage for simplicity

## Quick Start

```bash
git clone https://github.com/janderik/feedback-board.git
cd feedback-board
npm install
npm start
```

Visit `http://localhost:3000`

### Docker

```bash
docker build -t feedback-board .
docker run -p 3000:3000 feedback-board
```

## Feature Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Basic feedback submission | Done |
| 2 | Voting system | Done |
| 3 | Status pipeline | Done |
| 4 | User authentication | Planned |
| 5 | Email notifications | Planned |
| 6 | Admin dashboard | In Progress |
| 7 | Public roadmap page | Idea |

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback` | Create feedback item |
| GET | `/api/feedback` | List feedback (filterable) |
| GET | `/api/feedback/:id` | Get single item |
| PUT | `/api/feedback/:id` | Update status |
| DELETE | `/api/feedback/:id` | Delete item |
| POST | `/api/feedback/:id/vote` | Upvote/downvote |
| POST | `/api/feedback/:id/comments` | Add comment |
| GET | `/api/stats` | Board statistics |

### Create Feedback

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"title":"Dark mode","description":"Add dark mode support","category":"feature","author":"user1"}'
```

### Vote

```bash
curl -X POST http://localhost:3000/api/feedback/{id}/vote \
  -H "Content-Type: application/json" \
  -d '{"direction":"up","userId":"user1"}'
```

## Architecture

```
feedback-board/
├── src/
│   ├── server.js              # Express API & routes
│   └── votes/
│       └── VoteManager.js     # Voting logic
├── public/
│   └── index.html             # Feedback board UI
├── package.json
└── Dockerfile
```

## Status Pipeline

```
Idea → Planned → In Progress → Done
                         ↘ Declined
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and open PR

## License

MIT License
