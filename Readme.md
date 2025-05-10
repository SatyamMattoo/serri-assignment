# 🎬 Video Search App

A fullstack application to search and display videos using PostgreSQL's **full-text search** capabilities (with `GIN` index and `to_tsvector`). The backend is powered by Express, Prisma, and PostgreSQL. The frontend is built using React and `@tanstack/react-table@8` with sorting, filtering, and pagination.

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
- Full-text search using PostgreSQL `to_tsvector` and `GIN` index
- Prisma ORM integration
- Search API with pagination and ranking based on `ts_rank_cd`
- Dockerized backend for easy deployment

### ✅ Frontend
- React table with `@tanstack/react-table@8`
- Supports sorting, pagination, and API integration
- Clean UI to explore search results

---

## 🧪 Getting Started

### 📦 Clone the Repo

```bash
git clone https://github.com/SatyamMattoo/serri-assignment.git
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

## 🗃️ Database Setup Notes

Ensure you have the required PostgreSQL extension and full-text index:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_video_fulltext
  ON "Video"
  USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  );
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
      "rank": 0.245
    }
  ]
}
```

---

## 📦 Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL (`to_tsvector`, GIN index)
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