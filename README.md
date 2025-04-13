# Culinary-Portfolio-Builder


## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **React Router** - Navigation and routing
- **Bootstrap** - Styling and responsive design
- **Vite** - Build tool and development server
- **FontAwesome** - Icons

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport** - Authentication middleware
- **JWT** - Token-based authentication

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/Student-Class-Management-System.git
cd Student-Class-Management-System
```

### Backend Setup

At the root directory:
```bash
npm install
```

Create a development.js file in express-server/config/env/ with your MongoDB connection
(follow the format from development.js.template)

### Environment Variables

Create a `.env` file in the root directory by copying the provided template:
```bash
cp .env.template .env
```

Then update the values in `.env` with your specific configuration:
- `PORT`: The port number for the server (default: 5001)
- `NODE_ENV`: The environment (development, production, etc.)
- `db`: Your MongoDB connection string
- `SESSION_SECRET`: Secret for session management
- `SECRET_KEY`: Secret key for encryption/security

### Frontend Setup

```bash
cd  client-react
npm install
```

## 🚀 Running the Application


At the root directory:
```bash
npm run dev
```

The server will run on <http://localhost:5001>

The frontend will run on <http://localhost:5173>

## 🔧 Testing

### Install dependency

```bash
cd express-server
npm install --save-dev jest supertest
```

### Run testing

```bash
npm test
```
