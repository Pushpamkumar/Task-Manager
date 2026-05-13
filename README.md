# ⚡ TaskFlow — Advanced Project Management Platform

TaskFlow is a high-fidelity, full-stack project management application designed for seamless team collaboration. Built with a modern aesthetic and robust role-based access control, it provides a cinematic user experience while maintaining enterprise-grade functionality.

![TaskFlow Dashboard](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2000)

---

## 🌟 Key Features

### 🔐 Advanced Authentication & Security
- **Strict Validation**: Real-time Regex validation for Names and Emails.
- **Password Strength Intelligence**: Dynamic visual indicator for password complexity (Weak, Medium, Strong).
- **JWT Persistence**: Secure session management using JSON Web Tokens.

### 🏗️ Project & Team Management
- **Instant Team Management**: Administrators can instantly add or remove members by name and email from within the project view.
- **Role-Based Visibility**: Members only see the projects they are assigned to, while Admins have global oversight.
- **Visual Customization**: Projects feature unique emoji icons, curated color palettes, and progress visualization.

### 📋 Task Lifecycle & Collaboration
- **Smart Task Board**: 3-column Kanban board (To Do, In Progress, Done) for tracking task progression.
- **Priority Intelligence**: Tasks are tagged with priority levels (High, Medium, Low) and overdue warnings.
- **Strict RBAC**: Members can only update tasks specifically assigned to them, ensuring data integrity.

### 📊 Professional Dashboard & Reports
- **Interactive Metrics**: Neon-glow cards displaying project health, active tasks, and completion rates.
- **Team Distribution**: Real-time breakdown of tasks per user on the main dashboard.
- **Cinematic Experience**: High-fidelity 3D hover effects and staggered intro animations for a premium feel.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Custom CSS (3D Transform/Glow) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Icons** | Custom High-Fidelity SVG Vectors |

---

## 🗄️ Database Schema

TaskFlow uses a robust relational database structure powered by PostgreSQL and Prisma ORM.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns"
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ TASK : "created"
    USER ||--o{ PROJECT_MEMBER : "has memberships"
    
    PROJECT ||--o{ TASK : "contains"
    PROJECT ||--o{ PROJECT_MEMBER : "has members"

    USER {
        String id PK
        String name
        String email
        String role "admin | member"
        String color
        DateTime joinedAt
    }

    PROJECT {
        String id PK
        String name
        String description
        String emoji
        String color
        DateTime deadline
        String ownerId FK
    }

    PROJECT_MEMBER {
        String id PK
        String projectId FK
        String userId FK
    }

    TASK {
        String id PK
        String title
        String status "todo | inprogress | done"
        String priority "low | medium | high"
        DateTime dueDate
        String projectId FK
        String assigneeId FK
        String creatorId FK
    }

    ACTIVITY {
        String id PK
        String text
        String color
        DateTime createdAt
    }
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Pushpamkumar/Task-Manager.git
   cd Task-Manager
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskmanager"
   JWT_SECRET="your_secure_secret_key"
   PORT=5000
   ```
   Run migrations:
   ```bash
   npx prisma migrate dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application**:
   You can use the provided `start.bat` file in the root directory or run both servers manually:
   - Backend: `npm run dev` (in /backend)
   - Frontend: `npm run dev` (in /frontend)

---

## 🚀 Deployment on Railway

This project is configured for easy deployment on **Railway** with **PostgreSQL**.

### 1. Push to GitHub
Ensure your code is pushed to a GitHub repository.

### 2. Connect to Railway
1. Go to [Railway.app](https://railway.app) and create a new project.
2. Select **"Deploy from GitHub repo"** and choose this repository.
3. Railway will detect the `railway.json` and create two services: **backend** and **frontend**.

### 3. Setup PostgreSQL
1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**.
2. Railway will automatically inject the `DATABASE_URL` into your environment.

### 4. Configure Environment Variables
In the **backend** service settings, ensure the following are set:
- `JWT_SECRET`: A secure random string.
- `PORT`: 5000 (Railway handles this automatically, but ensure it's mapped).

In the **frontend** service settings, set:
- `VITE_API_URL`: The URL of your **backend** service (e.g., `https://backend-production-xxx.up.railway.app`).

### 5. Run Migrations
To initialize the database on Railway:
1. Open the **backend** service in Railway.
2. Go to the **"View Logs"** or **"Console"** tab.
3. Run the following command (one-time):
   ```bash
   npx prisma migrate deploy
   ```

---

## 👥 Role Definitions

### 👑 Administrator
- Full control over all projects and tasks.
- Can create, edit, and delete any project.
- Can manage the global team list (Add/Remove Users).
- Access to global reports and performance metrics.

### 👤 Member
- View assigned projects only.
- View all tasks within their projects.
- **Strict Update Rights**: Can only edit task status (Mark Done/In Progress) for tasks assigned by Admins. Can fully edit and delete tasks they created themselves.

---

## 🎨 Design Philosophy
TaskFlow prioritizes **Visual Excellence**. The UI uses a "Glassmorphism" design system with neon accents (`#e8ff47`) and cinematic animations. Every interaction, from the 8-second slow-gliding logo to the 3D tagline "pop-out" hover effects, is designed to WOW the user.

---

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ for High-Performance Teams.*
