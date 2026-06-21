# ReCell Mobile

A full-stack marketplace for buying and selling second-hand smartphones. Browse listings, create your own, message sellers, and manage your account — all in a modern React UI backed by an Express API.

**Repository:** [github.com/Farohar1/recell-clean](https://github.com/Farohar1/recell-clean)

---

## Features

- **Browse listings** — Search and filter by brand, condition, and max price
- **Listing details** — View phone specs, photos, seller info, and view counts
- **Sell a phone** — Create and edit listings with image upload (base64)
- **My listings** — Manage your active listings (edit or delete)
- **Messaging** — Contact sellers about specific listings
- **Authentication** — Register, log in, and log out with session-based auth
- **Seed data** — Pre-loaded demo users and phone listings on startup

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite 6, React Router, Tailwind CSS, Lucide icons |
| **Backend** | Node.js, Express 4, express-session, bcrypt |
| **Data** | In-memory store (`server/db.js`) — resets when the server restarts |
| **Legacy page** | EJS browse view at `/pages/browse` (server-rendered) |

---

## Project Structure

```
recell-clean/
├── client/                 # React frontend (Vite)
│   ├── public/images/      # Static listing images
│   └── src/
│       ├── components/     # Navbar, ListingCard, etc.
│       ├── lib/            # API client, auth context
│       └── pages/          # Home, Browse, Sell, Messages, ...
├── server/                 # Express API
│   ├── routes/             # auth, listings, messages
│   ├── middleware/         # Session auth guard
│   ├── views/              # EJS templates
│   └── db.js               # In-memory database + seed data
└── package.json            # Root scripts (runs both client & server)
```

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Farohar1/recell-clean.git
cd recell-clean
npm install
```

The root `postinstall` script automatically installs client dependencies as well.

---

## Running the App

### Development (recommended)

Starts the API server and Vite dev server together:

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| **React app** | http://localhost:5173 |
| **API** | http://localhost:3000/api |
| **Health check** | http://localhost:3000/api/health |
| **EJS browse page** | http://localhost:3000/pages/browse |

Open **http://localhost:5173** in your browser. Vite proxies `/api` requests to the backend on port 3000.

### Run servers separately

**Backend only:**

```bash
node server/index.js
```

**Frontend only** (from the `client/` directory):

```bash
cd client
npm run dev
```

### Production build (frontend)

```bash
cd client
npm run build
npm run preview
```

The built static files are output to `client/dist/`. For production, serve that folder behind a reverse proxy and run the Express server for the API.

---

## Demo Accounts

The server seeds three users on startup. All use the password **`password123`**:

| Name | Email | Location |
|------|-------|----------|
| Alex | alex@example.com | Berlin |
| Maria | maria@example.com | Munich |
| Jonas | jonas@example.com | Hamburg |

Six sample phone listings (iPhone, Samsung, Pixel, OnePlus, etc.) are also pre-loaded.

---

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Home — hero, search, featured listings |
| `/browse` | Browse — filter and search all listings |
| `/listing/:id` | Listing detail |
| `/listing/:id/edit` | Edit your listing |
| `/sell` | Create a new listing |
| `/my-listings` | Your listings (requires login) |
| `/messages` | Inbox (requires login) |
| `/login` | Log in |
| `/register` | Create an account |

---

## API Endpoints

All API routes are prefixed with `/api`. Session cookies are used for authentication (`credentials: 'include'`).

### Auth — `/api/auth`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/register` | Create account |
| `POST` | `/login` | Log in |
| `POST` | `/logout` | Log out |
| `GET` | `/me` | Current user (or `null`) |

### Listings — `/api/listings`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | List active listings (`?q`, `?brand`, `?condition`, `?maxPrice`) |
| `GET` | `/mine` | Yes | Current user's listings |
| `GET` | `/:id` | No | Single listing (increments view count) |
| `POST` | `/` | Yes | Create listing |
| `PUT` | `/:id` | Yes | Update own listing |
| `DELETE` | `/:id` | Yes | Delete own listing |

### Messages — `/api/messages`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | Yes | Messages for current user |
| `POST` | `/` | Yes | Send message (`listing_id`, `recipient_id`, `content`) |

---

## Notes

- **In-memory database** — Users, listings, and messages are stored in memory. All data is lost when the server restarts (except the seeded demo data, which is re-created on startup).
- **Image uploads** — Listing images are sent as base64 data URLs (PNG, JPEG, or WebP). Max size is roughly 25 MB.
- **CORS** — The API allows requests from `http://localhost:5173` with credentials in development.

---

## License

This project is for educational and portfolio use.
