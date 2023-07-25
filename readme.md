# Actual Deployed App Repo is unable to be shown publicly

# Currency Tracker and Booking Application

A web based application to track currency and book refresher trainings

## Description

This web application allows trainees to:

- track their currency expiries based on a set of currency requirements
- make bookings to attend trainings refresh their currencies
- have their currencies updated after completing a refresher

### [Try the application here (login required)](https://lss-currency.onrender.com)

## Tech Stack and Libraries

- PostgreSQL database
- Express (Typescript) Server
- React (Typescript) Frontend, built using vite
- Node.js
- Render for deployment (Web Service)
- Libraries (and their dependencies)
  - Axios: handle HTTP requests
  - TailwindCSS: CSS framework
  - DaisyUI: Component styles
  - DayJS: Date handling
  - Formik: Form handling
  - Yup: Form validation
  - Jsonwebtoken: JWT signing and verification
  - React-calendar: Calendar display
  - Dotenv: Read environment variables
  - Prisma: Database connection and transactions
  - sgID: Singpass authorization

## Timeframe

5 working days

## Wireframe and User Stories

_User stories_
![User Stories](https://user-images.githubusercontent.com/84754905/225782256-c7e54f1a-785e-45c7-93a9-6f9a61fb4d4c.jpg)

## Development Approach and Details

This application implements basic Create Read Update Delete (CRUD) functions and was implemented using a model-view-controller architectural approach as described below. Our approach and timeline in developing this application was to:

#### Day 1

1. Set up server using express
2. Define all schema and generate PostgreSQL database using Prisma
3. Plan server routers for basic CRUD functions using REST conventions

#### Day 2

1. Authorisation via sgID client
2. Server routers and controllers to CRUD trainees and trainings
3. Front end client to CRUD trainees and trainings

#### Day 3

1. Server algorithm to track currencies and display currencies for trainee
2. Server algoritm to update currencies
3. Front end client for trainees to book and complete trainings

#### Day 4

1. Server routers and controllers to CRUD users
2. Front end client for users
3. Implement authentication across all application paths

#### Day 5

1. Deploy application
2. Style application

### _Model_

![Database Entity Relationship Diagram](https://user-images.githubusercontent.com/84754905/225782759-ff352f85-94af-483f-a56f-759b5764db7a.jpeg)

### _View_

The views and user interactions were developed using the react and react-router-dom libraries.

### _Controller_

There are four categories of controllers in the application: for trainees, trainings, and users, and authentication

The controllers for users, trainings and trainees allow basic CRUD functions for the User, Trainee and Trainings models. The routes for each of these functions adhere to REST conventions. The authentication controller functions as middleware to ensure only authorized users can access the respective functions.

## Deployment Instructions

### Root Folder:

    .

### Build script:

    cd ./client && npm install && npm run build && cd ../server && npm install && npx prisma db push && npm run build

### Start script:

    npm run start
