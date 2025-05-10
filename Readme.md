# 🎬 Video Search App
A fullstack application to search and display videos with fuzzy matching using PostgreSQL's `pg_trgm` and `similarity()`. The backend is powered by Express, Prisma, and PostgreSQL. The frontend is built using React and `@tanstack/react-table@8` with sorting, filtering, and pagination.

---

## 📁 Project Structure

```
.
├── backend          # Node.js + Express + Prisma + PostgreSQL + Docker
├── frontend         # React + TypeScript + @tanstack/react-table
```

---

## 🚀 Features

### ✅ Backend
- Full-text fuzzy search using PostgreSQL + `pg_trgm`
- Prisma ORM integration
- Search API with pagination and similarity-based scoring
- Dockerized backend for easy deployment

### ✅ Frontend
- React table with `@tanstack/react-table@8`
- Supports sorting, pagination, and API integration
- Clean UI to explore search results

---

## 🧪 Getting Started

### 📦 Clone the Repo

```bash
git clone <your-repo-link>
cd backend
```

---

## 🛠️ Backend Setup

### 🔧 Local Development

```bash
npm install
cp .env.example .env
```

> ✍️ Edit `.env` and add your PostgreSQL connection string and any required API keys

```bash
npx prisma generate
npm run dev
```

---

### 🐳 Run Backend with Docker

```bash
docker-compose up --build
```

> ⚠️ Ensure `.env` file exists with required variables before starting Docker.

> For production, we can consider replacing `.env` with Docker secrets for enhanced security.

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running at: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

Example `.env` for backend:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

---

## 🔍 Get Videos API

### Endpoint

```http
GET /api/v1/videos
```

## 🔍 Search API

### Endpoint

```http
GET /api/v1/videos/search?q=your+query&page=1&limit=20
```

### Query Parameters

- `q`: Search query (required)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

### Response

```json
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "videos": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "similarity_score": 0.78
    }
  ]
}
```

---

## 🗃️ Database Setup Notes

Ensure you have the required PostgreSQL extension and indexes:
This has to be done to support fuzzy search cause we cannot do it directly using prisma

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_video_title_trgm
  ON "Video" USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_video_description_trgm
  ON "Video" USING gin (description gin_trgm_ops);
```

---

## 📦 Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL (`pg_trgm`)
- **Frontend**: React, TypeScript, @tanstack/react-table v8
- **DevOps**: Docker (only for backend)

---

## 📬 Contributions

Feel free to open issues or pull requests for improvements or fixes.

---

## ✅ Todo (Optional Enhancements)

- [ ] Dockerize frontend
- [ ] Add global search debounce
- [ ] Improve UI styling
