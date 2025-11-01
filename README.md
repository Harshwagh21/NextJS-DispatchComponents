# 🚀 NextJS Dispatch Components - Fleet Management Dashboard

A comprehensive, modern fleet management and analytics dashboard built with Next.js 15, React 19, MongoDB, and TypeScript. This application provides real-time fleet monitoring, data visualization, comparison tools, and interactive maps for dispatch management.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

**NextJS Dispatch Components** is a full-stack web application designed for fleet management operations. It enables users to:

- **Monitor Fleet Performance** - Real-time analytics and metrics visualization
- **Compare Simulations** - Side-by-side comparison of different fleet scenarios
- **Interactive Maps** - Visualize fleet locations with Leaflet maps
- **User Management** - Role-based access control (HQ Manager & Fleet Manager)
- **Data Analytics** - Comprehensive charts for revenue, orders, delivery times, and more

The application uses JWT-based authentication, MongoDB for data persistence, and provides a responsive, modern UI built with Tailwind CSS and Radix UI components.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based login system
- **Role-Based Access Control** - Two authority levels:
  - **HQM (Headquarters Manager)** - Full access to all fleets
  - **FM (Fleet Manager)** - Access limited to assigned fleets/locations
- **Cookie-based Session Management** - HTTP-only cookies for security

### 📊 Dashboard & Analytics
- **Interactive Charts** - Multiple chart types (Area, Bar, Line) powered by Recharts
- **Real-time Data Visualization** - Live updates from MongoDB
- **Fleet Metrics Dashboard** - Comprehensive KPIs and performance indicators
- **Chart Categories**:
  - Revenue Growth
  - Order Volume
  - Average Delivery Time
  - Customer Satisfaction
  - Fleet Utilization
  - Driver Retention

### 🔄 Comparison Tools
- **Side-by-Side Fleet Comparison** - Compare two fleets simultaneously
- **Multi-Chart Comparison** - View all metrics across both fleets
- **Search & Filter** - Quick search across chart categories

### 🗺️ Map Integration
- **Interactive Leaflet Maps** - Real-time fleet location visualization
- **Map Navigation** - Smooth fly-to animations
- **Location Tracking** - GPS coordinates for each fleet

### 🎨 User Interface
- **Modern Design** - Clean, responsive UI with Tailwind CSS
- **Component Library** - Radix UI primitives for accessible components
- **Dark Mode Support** - Theme-aware components
- **Mobile Responsive** - Works seamlessly on all devices

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts** - Chart library
- **React Leaflet** - Map integration
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **Node.js** - Runtime environment

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting
- **Turbopack** - Next-generation bundler
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
NextJS-DispatchComponents/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/           # POST /api/auth/login
│   │   │   ├── logout/          # POST /api/auth/logout
│   │   │   ├── me/              # GET /api/auth/me
│   │   │   └── user/[id]/       # GET /api/auth/user/:id
│   │   └── charts/              # Chart data endpoints
│   │       ├── fleets/         # GET /api/charts/fleets
│   │       ├── fleet/[name]/   # GET /api/charts/fleet/:name
│   │       └── compare/        # POST /api/charts/compare
│   ├── map/                     # Map page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── charts/                 # Chart components
│   │   ├── AreaChartCard.tsx
│   │   ├── BarChartCard.tsx
│   │   └── LineChartCard.tsx
│   ├── map/                    # Map components
│   │   ├── MapComponent.tsx
│   │   ├── LegendDropdown.tsx
│   │   └── TimelineScrubber.tsx
│   ├── ui/                     # UI components
│   │   ├── DashboardCharts.tsx
│   │   ├── CompareSimulations.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── [shadcn components]
│   ├── DashboardClient.tsx     # Main dashboard client
│   └── mvpblocks/              # MVP-specific components
│
├── lib/                         # Utility libraries
│   ├── auth.ts                 # Authentication helpers
│   ├── mongo.ts                # MongoDB connection
│   ├── api-utils.ts            # API utilities
│   └── utils.ts                # General utilities
│
├── models/                      # Mongoose models
│   ├── Fleet.ts                # Fleet schema
│   └── User.ts                 # User schema
│
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts          # Debounce hook
│   └── use-mobile.ts           # Mobile detection hook
│
├── public/                     # Static assets
│   └── Dispatchlogo.png       # Logo file
│
├── package.json                # Dependencies & scripts
├── pnpm-lock.yaml             # pnpm lock file
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (Install: `npm install -g pnpm`)
- **MongoDB** connection string (or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NextJS-DispatchComponents
   ```

2. **Install dependencies using pnpm**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```

   > **Note**: The MongoDB URI is currently hardcoded in `lib/mongo.ts`. For production, move it to environment variables.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   The application will start on [http://localhost:2107](http://localhost:2107)

5. **Build for production**
   ```bash
   pnpm build
   ```

6. **Start production server**
   ```bash
   pnpm start
   ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | Yes | `your-secret-key-min-32-chars` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `NEXT_PUBLIC_BASE_PATH` | Base path for deployment | No | `/repo-name` |
| `NEXT_STATIC_EXPORT` | Enable static export | No | `true` or `false` |

**Security Note**: Never commit `.env.local` to version control. Add it to `.gitignore`.

---

## 🔧 How It Works

### Authentication Flow

1. **User Login**
   - User submits email and password via `/api/auth/login`
   - Server validates credentials against MongoDB
   - JWT token is generated with user ID and authority
   - Token is stored in HTTP-only cookie
   - User is redirected to dashboard

2. **Session Validation**
   - Each protected route calls `getAuthUser()` to verify token
   - Token is extracted from cookie and verified with JWT
   - User data is fetched from MongoDB using user ID
   - Access is granted/denied based on authority

3. **Authorization**
   - **HQM (Headquarters Manager)**: Can access all fleets
   - **FM (Fleet Manager)**: Can only access fleets matching their `location` or `fleet` field

### Data Flow

1. **Fleet Data Retrieval**
   ```
   Client → API Route → MongoDB Query → Data Filtering → JSON Response → Chart Components
   ```

2. **Chart Rendering**
   - Fleet data is fetched via `/api/charts/fleet/:name`
   - Chart components transform data into Recharts format
   - Multiple chart types are rendered based on category
   - Search functionality filters visible charts

3. **Comparison Mode**
   - Two fleets are selected via dropdowns
   - Data for both fleets is fetched in parallel
   - Charts are rendered side-by-side in a grid layout
   - Summary comparison is displayed at the bottom

### Map Integration

- **Leaflet Maps** render fleet locations
- Map center is set based on fleet `location` coordinates
- `MapFlyTo` component animates map transitions
- Supports custom tile layers and attribution

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "username": "username",
    "email": "user@example.com",
    "authority": "HQM",
    "location": "Pune",
    "fleet": "Fleet Name"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request body
- `401` - Invalid credentials
- `500` - Server error

---

#### `POST /api/auth/logout`
Logout endpoint that clears authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `GET /api/auth/me`
Get current authenticated user information.

**Response:**
```json
{
  "loggedIn": true,
  "user": {
    "_id": "user-id",
    "username": "username",
    "email": "user@example.com",
    "authority": "HQM",
    "location": "Pune",
    "fleet": "Fleet Name"
  }
}
```

**Status Codes:**
- `200` - Success (loggedIn: false if not authenticated)

---

#### `GET /api/auth/user/[id]`
Get user information by ID.

**Response:**
```json
{
  "username": "username",
  "email": "user@example.com",
  "authority": "HQM",
  "location": "Pune",
  "fleet": "Fleet Name"
}
```

---

### Charts Endpoints

#### `GET /api/charts/fleets`
Get list of all accessible fleets based on user authority.

**Authorization Required:** Yes

**Response:**
```json
[
  {
    "name": "Zomato Fleet Pune",
    "location": {
      "lat": 18.5204,
      "lng": 73.8567
    },
    "charts": [...]
  }
]
```

**Authority Filtering:**
- **HQM**: Returns all fleets
- **FM**: Returns fleets matching user's `location` or `fleet`

---

#### `GET /api/charts/fleet/[name]`
Get specific fleet data including charts.

**Parameters:**
- `name` (URL parameter): Fleet name (URL encoded)

**Response:**
```json
{
  "name": "Zomato Fleet Pune",
  "location": {
    "lat": 18.5204,
    "lng": 73.8567
  },
  "charts": [
    {
      "category": "Revenue Growth",
      "data": [100, 120, 140, 160, 180, 200, 220],
      "summary": "Revenue increased by 120%"
    }
  ],
  "fleetId": "fleet-mongodb-id"
}
```

---

#### `POST /api/charts/compare`
Compare multiple chart categories across fleets.

**Request Body:**
```json
{
  "fleet": "Zomato Fleet Pune",
  "categories": ["Revenue Growth", "Order Volume", "Fleet Utilization"]
}
```

**Response:**
```json
[
  {
    "category": "Revenue Growth",
    "data": [100, 120, 140],
    "summary": "Revenue increased by 120%"
  }
]
```

---

## 🏗️ Architecture

### Frontend Architecture

- **Server Components** - Initial page load and data fetching
- **Client Components** - Interactive UI with React hooks
- **Dynamic Imports** - Code splitting for heavy components
- **Custom Hooks** - Reusable logic (debounce, mobile detection)

### Backend Architecture

- **API Routes** - Serverless functions in `app/api`
- **Middleware Pattern** - Authentication checks via `getAuthUser()`
- **Database Connection** - Singleton pattern with caching (MongoDB)
- **Error Handling** - Consistent error responses across endpoints

### Data Models

#### User Schema
```typescript
{
  username: string;        // Unique username
  email: string;          // Unique email
  password: string;        // Plain text (consider hashing)
  authority: "FM" | "HQM"; // User role
  location?: string;      // Optional location
  fleet?: string;         // Optional fleet assignment
}
```

#### Fleet Schema
```typescript
{
  name: string;           // Unique fleet name
  location: {
    lat: number;          // Latitude
    lng: number;          // Longitude
  };
  charts: [{
    category: string;     // Chart category name
    data: number[];       // Array of data points
    summary: string;      // Summary text
  }];
}
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Static export (for GitHub Pages)
pnpm build:static
```

### Development Server

The development server runs on **port 2107** by default with Turbopack enabled for faster builds.

```bash
pnpm dev
# Server: http://localhost:2107
```

### Code Style

- **Functions**: Keep under 20 lines when possible
- **Variables**: Use descriptive names
- **Code**: Optimized with low time complexity
- **Reusability**: Avoid duplicate code
- **Testing**: Follow TDD principles (write tests before implementation)

### File Organization

- **Components**: Reusable UI components in `components/`
- **API Routes**: Server endpoints in `app/api/`
- **Utilities**: Shared functions in `lib/`
- **Models**: Database schemas in `models/`
- **Hooks**: Custom React hooks in `hooks/`

---

## 🚢 Build & Deployment

### Production Build

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
```

### Static Export (GitHub Pages)

```bash
# Set environment variable
export NEXT_STATIC_EXPORT=true

# Build and export
pnpm build:static

# Output will be in ./out directory
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

#### Traditional Server
1. Build the application: `pnpm build`
2. Start the server: `pnpm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up PM2 or similar process manager

---

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Error
**Problem**: Cannot connect to MongoDB

**Solutions:**
- Verify MongoDB URI is correct
- Check network firewall settings
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify credentials are correct

#### JWT Token Issues
**Problem**: Authentication fails or tokens expire

**Solutions:**
- Check `JWT_SECRET` is set in environment variables
- Ensure secret is at least 32 characters
- Verify cookie settings match your domain

#### Port Already in Use
**Problem**: Port 2107 is already in use

**Solutions:**
- Change port in `package.json`: `"dev": "next dev -p 3000"`
- Kill process using port: `lsof -ti:2107 | xargs kill`

#### Build Errors
**Problem**: TypeScript or build errors

**Solutions:**
- Run `pnpm install` to ensure dependencies are up to date
- Check TypeScript version compatibility
- Clear `.next` folder: `rm -rf .next`
- Run `pnpm lint` to identify issues

#### Map Not Loading
**Problem**: Leaflet map doesn't render

**Solutions:**
- Ensure `react-leaflet` and `leaflet` are installed
- Check CSS import: `import "leaflet/dist/leaflet.css"`
- Verify Leaflet styles are loaded globally

---

## 📝 Additional Notes

### Security Considerations

- **Password Storage**: Currently passwords are stored in plain text. **Implement bcrypt hashing for production**.
- **JWT Secret**: Use a strong, random secret (minimum 32 characters).
- **HTTP-Only Cookies**: Already implemented for token storage.
- **Input Sanitization**: Use `sanitizeInput` utility for user inputs.
- **CORS**: Configure CORS if using separate frontend/backend.

### Performance Optimization

- **Code Splitting**: Dynamic imports for heavy components
- **Database Indexing**: Add indexes on frequently queried fields
- **Caching**: MongoDB connection caching implemented
- **Debouncing**: Search queries are debounced to reduce API calls
- **Lazy Loading**: Charts and maps load on demand

### Future Enhancements

- [ ] Add password hashing (bcrypt)
- [ ] Implement refresh tokens
- [ ] Add data export functionality
- [ ] Real-time updates via WebSockets
- [ ] Advanced filtering and sorting
- [ ] Multi-language support
- [ ] Unit and integration tests
- [ ] CI/CD pipeline setup

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👥 Contributing

This is a private project. For contributions, please contact the project maintainers.

---

## 📞 Support

For issues, questions, or support, please open an issue in the repository or contact the development team.

---

**Made with ❤️ using Next.js, React, and TypeScript**
