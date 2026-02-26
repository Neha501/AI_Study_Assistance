# AI Study Assistance

AI Study Assistance is a comprehensive platform designed to help students organize their study materials and leverage AI for smarter learning.

## Features

- **AI Note Generation**: Automatically generate study notes based on topics.
- **Study Management**: Create, update, and organize your study materials.
- **Profile & Settings**: Manage your user profile and application settings.
- **Analytics**: Track your study progress and notes statistics.
- **Subscription Plans**: Choose from Free, Basic, and Pro plans to unlock more features.
- **OAuth Integration**: Securely login using Google or GitHub.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Passport.js (OAuth), JWT.
- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saumya552/Ai_study_assistance.git
   cd Ai_study_assistance
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the `backend` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Running the Application

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd ../frontend
   npm start
   ```

The application will be available at `http://localhost:3000`.

## License

MIT
