To-Do App

A full-stack task management application built with Next.js 14 and MongoDB.
The app allows users to create, view, update, and delete tasks through a clean, responsive interface.

Live Demo: https://to-2qzeiwl8u-ishitas-projects-f438584b.vercel.app

Features

Add tasks with title, description, and status (pending or completed)

View all tasks in a structured list

Edit , Update and Delete task details

Filter and sort tasks by status and creation date

Responsive UI 

API-based architecture using Next.js server routes

Deployed on Vercel with automatic GitHub integration

Tech Stack

Frontend: Next.js 14, React, TailwindCSS

Backend: Next.js API Routes

Database: MongoDB (via Mongoose)

 Vercel for deployment

Project Structure
/src
 ├── app
 │   ├── api
 │   │   └── todo
 │   │       ├── route.js        # Handles POST and GET (all tasks)
 │   │       └── [id]/route.js   # Handles GET, PUT, DELETE (single task)
 │   ├── add/page.jsx            # Page to add new tasks
 │   ├── edit/[id]/page.jsx      # Page to edit tasks
 │   ├── components              # Reusable UI components (Modal, etc.)
 │   └── lib/Db.js               # MongoDB connection utility
 ├── models/user.js              # Mongoose schema for tasks

Setup and Installation

Clone the repository

git clone https://github.com/<your-username>/to-do.git
cd to-do


Install dependencies

npm install


Configure environment variables

Create a .env.local file in the root directory.

Add your MongoDB connection string:

MONGODB_URI=your_mongodb_connection_string


Run the development server

npm run dev


Deployment

This project is deployed on Vercel.
Every push to the main branch triggers an automatic production deployment.

Production URL: https://to-2qzeiwl8u-ishitas-projects-f438584b.vercel.app
