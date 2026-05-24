# 🗺️ The Secret Route — User Flow

## Overview

**The Secret Route** is a pirate-themed authentication app where users register and log in using a _treasure map_ instead of a traditional password. Instead of typing a password, users tap landmarks on a hand-drawn map in a secret order — that sequence **is** their password, hashed and stored securely using bcrypt.

---

## Full User Flow Diagram

```mermaid
flowchart TD
    A([🌐 User Visits App]) --> B{Has JWT in\nLocalStorage?}

    B -- No --> C[/signin Page]
    B -- Yes --> DASH

    C --> C1[Enter Email]
    C --> REG_LINK[Click 'Join the Crew']
    REG_LINK --> SIGNUP

    %% ─── REGISTRATION FLOW ───────────────────────────────────────
    subgraph SIGNUP ["⚓  Registration — /signup"]
        direction TB
        S1[Step 1: Enter Username + Email]
        S1 --> S2[Click 'Chart My Route']
        S2 --> S3[🗺️ TreasureMap — Setup Mode]
        S3 --> S4[Tap landmarks in secret order\ne.g. Skull Rock → Jungle Temple → Treasure Point]
        S4 --> S5[Click 'Seal the Route ✓']
        S5 --> S6[Route string built\ne.g. '2,6,14']
    end

    SIGNUP --> API_REG

    subgraph API_REG ["🖥️  Backend — POST /api/auth/register"]
        direction TB
        R1[Receive username, email, route]
        R1 --> R2{Email already\nregistered?}
        R2 -- Yes --> R3[❌ 400 — Email already in use]
        R2 -- No --> R4[bcrypt.hash route string\nsalt rounds = 10]
        R4 --> R5[Save User to MongoDB\nusername · email · hashedRoute]
        R5 --> R6[✅ 201 — User registered]
    end

    R3 --> S1
    R6 --> C

    %% ─── LOGIN FLOW ──────────────────────────────────────────────
    C1 --> C2[Click 'Approach the Map']

    subgraph LOGIN ["🔑  Login — /signin"]
        direction TB
        L1[Step 2: 🗺️ TreasureMap — Login Mode]
        L1 --> L2[Retrace landmarks in same secret order]
        L2 --> L3[Click 'Confirm Route']
        L3 --> L4[Route string sent to backend\ne.g. '2,6,14']
    end

    C2 --> LOGIN
    LOGIN --> API_LOGIN

    subgraph API_LOGIN ["🖥️  Backend — POST /api/auth/login"]
        direction TB
        A1[Receive email + route]
        A1 --> A2{User found\nin MongoDB?}
        A2 -- No --> A3[❌ 400 — Invalid credentials]
        A2 -- Yes --> A4[bcrypt.compare\nroute vs stored hash]
        A4 --> A5{Routes\nmatch?}
        A5 -- No --> A6[❌ 400 — Invalid credentials]
        A5 -- Yes --> A7[Sign JWT\n— payload: user._id\n— expires: 1 day]
        A7 --> A8[✅ 200 — Return token + user]
    end

    A3 --> C1
    A6 --> L1
    A8 --> LS[Store JWT + user\nin localStorage]
    LS --> DASH

    %% ─── DASHBOARD ───────────────────────────────────────────────
    subgraph DASH ["🏴‍☠️  Dashboard — /dashboard  ·  Protected Route"]
        direction TB
        D1{JWT present\nin localStorage?}
        D1 -- No --> D2[🔁 Redirect to /signin]
        D1 -- Yes --> D3[Render Captain's Quarters]
        D3 --> D4[Display username · status · ship's clock]
        D4 --> D5[Click 'Abandon Ship' — Logout]
        D5 --> D6[Clear localStorage\ntoken + user]
        D6 --> D2
    end

    %% ─── STYLING ─────────────────────────────────────────────────
    style SIGNUP  fill:#2a1a06,color:#e8c547,stroke:#8b6530,stroke-width:2px
    style LOGIN   fill:#2a1a06,color:#e8c547,stroke:#8b6530,stroke-width:2px
    style API_REG fill:#1a2a06,color:#a8e87a,stroke:#4a8b30,stroke-width:2px
    style API_LOGIN fill:#1a2a06,color:#a8e87a,stroke:#4a8b30,stroke-width:2px
    style DASH    fill:#06152a,color:#7ac8e8,stroke:#305a8b,stroke-width:2px

    style A   fill:#e8c547,color:#2a1a06,stroke:#8b6530
    style LS  fill:#34d399,color:#052e16,stroke:#059669
    style R6  fill:#34d399,color:#052e16,stroke:#059669
    style A8  fill:#34d399,color:#052e16,stroke:#059669
    style R3  fill:#c03030,color:#fff,stroke:#8b2020
    style A3  fill:#c03030,color:#fff,stroke:#8b2020
    style A6  fill:#c03030,color:#fff,stroke:#8b2020
    style D2  fill:#c03030,color:#fff,stroke:#8b2020
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React (Vite) | UI & routing |
| **Auth UI** | Custom TreasureMap component | Creative map-based password input |
| **Routing** | React Router v6 | Page navigation + private route guard |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB Atlas | Cloud user storage |
| **ODM** | Mongoose | MongoDB schema + validation |
| **Password Hashing** | bcryptjs | Hashes the map route string (salt rounds: 10) |
| **Authentication** | JSON Web Tokens (JWT) | Stateless session token, 1-day expiry |
| **Token Storage** | localStorage | Client-side JWT persistence |

---

## Key Security Decisions

- **The map route is the password** — instead of a text password, users tap landmarks in a personal secret order. The resulting ID string (e.g. `"2,6,14"`) is treated as a password.
- **bcrypt hashing** — the route string is hashed with bcrypt (salt rounds: 10) before being stored in MongoDB. The plaintext route is never persisted.
- **JWT authentication** — on successful login the server signs a JWT containing the user's `_id`. The client stores it in `localStorage` and sends it as a `Bearer` token on protected requests.
- **Private route guard** — the `/dashboard` route checks for a valid JWT in `localStorage` before rendering; unauthenticated users are redirected to `/signin`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ Public | Register new user (username, email, route) |
| `POST` | `/api/auth/login` | ❌ Public | Login + receive JWT |
| `GET`  | `/api/auth/me` | ✅ Bearer JWT | Get current user's profile |