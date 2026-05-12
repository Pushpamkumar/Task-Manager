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

## 👥 Role Definitions

### 👑 Administrator
- Full control over all projects and tasks.
- Can create, edit, and delete any project.
- Can manage the global team list (Add/Remove Users).
- Access to global reports and performance metrics.

### 👤 Member
- View assigned projects only.
- View all tasks within their projects.
- **Strict Update Rights**: Can only mark their own assigned tasks as "Done" or "In Progress".

---

## 🎨 Design Philosophy
TaskFlow prioritizes **Visual Excellence**. The UI uses a "Glassmorphism" design system with neon accents (`#e8ff47`) and cinematic animations. Every interaction, from the 8-second slow-gliding logo to the 3D tagline "pop-out" hover effects, is designed to WOW the user.

---

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ for High-Performance Teams.*
