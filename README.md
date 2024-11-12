# Habits Together

A personal habit-tracking app that fosters community accountability through validations, comments, and gamification elements to make habit-building engaging and fun.

## Table of Contents

- [Habits Together](#habits-together)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Requirements](#requirements)
  - [Examples](#examples)
  - [Database Entities](#database-entities)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
      - [`POST /api/auth/signup` ✅](#post-apiauthsignup-)
      - [`POST /api/auth/login` ✅](#post-apiauthlogin-)
    - [Users](#users)
      - [`GET /api/users/profile` ✅](#get-apiusersprofile-)
    - [Habits](#habits)
      - [`GET /api/habits` ✅](#get-apihabits-)
      - [`POST /api/habits` ✅](#post-apihabits-)
      - [`PUT /api/habits/{id}` ✅](#put-apihabitsid-)
      - [`DELETE /api/habits/{id}` ✅](#delete-apihabitsid-)
    - [Habit Logs](#habit-logs)
      - [`GET /api/logs`](#get-apilogs)
  - [Frontend Pages/Routes](#frontend-pagesroutes)
    - [Login `/login`](#login-login)
    - [Signup `/signup`](#signup-signup)
    - [Home `/`](#home-)

---

## Description

Habits Together is designed to help you build and maintain positive habits by allowing you to create personal habits and share your progress with your friends. While each user works on their own habits, the app encourages accountability and support through validations and comments from other users. To make the experience more engaging, Habits Together incorporates gamification features like earning experience points, leveling up, and character progression, similar to RPG games.

## Features

- **Personal Habit Creation**: Create your own habits with custom rules and track them over time.
- **Daily Habit Logging**: Log your habit daily by providing text entries and/or photos.
- **Community Validations**: Receive validations from other users on your habit logs; at least one validation is needed for the log to be considered validated for the day.
- **Comments**: Engage with the community by leaving comments on habit logs and receiving feedback on yours.
- **Individual Streak Tracking**: Track your personal streaks for each habit based on consecutive validated logs.
- **Gamification**:
  - **Experience Points (XP)**: Earn XP for activities like creating habit logs, validating others' logs, reaching streak milestones, etc.
  - **Leveling Up**: Accumulate XP to level up your character, unlocking new features or rewards.
  - **Profile Customization**: Customize your profile with avatars or character images that evolve as you level up.
- **User Profiles**:
  - **Profile Picture**: Upload a profile picture or choose an avatar.
  - **View Other Users' Profiles**: See other users' stats, such as their level, XP, and habits.
- **User Authentication**: Secure sign-up and login processes to protect your data.

## Technologies Used

- **Backend**: NestJS
- **Frontend**: Next.js
- **Database**: PostgreSQL

## Requirements

- **User Authentication**:
  - Users must be able to sign up, log in, and manage their accounts securely.
  - Users can upload a profile picture or select an avatar.
- **Habit Management**:
  - Users can create, view, and delete their own habits.
  - Each habit includes a name and rules.
- **Habit Logging**:
  - Users can log their habits once per day.
  - Logs must include at least a photo. A text entry is optional.
- **Habit Log Validation**:
  - Other users can validate habit logs.
  - A habit log is considered validated when it receives at least one validation.
  - Users cannot validate their own habit logs.
- **Comments on Habit Logs**:
  - Users can leave comments on any habit log.
  - Comments are visible to all users.
- **Streak Calculation**:
  - Personal streaks are calculated based on consecutive days of validated habit logs.
  - Missing a day or not having a log validated resets the streak for the habit.
- **Gamification**:
  - **Experience Points (XP)**:
    - Users earn XP for:
      - Submitting habit logs.
      - Validating others' habit logs.
      - Receiving validations on their own habit logs.
      - Reaching streak milestones (e.g., 3 days, 7 days, 15 days, 30 days).
      - Other community engagement activities.
  - **Leveling Up**:
    - Users level up their character as they accumulate XP.
    - Levels may unlock new features, badges, or profile customization options.
  - **Character Progression**:
    - Users can customize their character or avatar, which may evolve as they level up.
- **User Profiles**:
  - Display user information such as username, profile picture, level, XP, and habits.

## Examples

- **Habits**:

| Habit Name        | Rules                                                    |
| ----------------- | -------------------------------------------------------- |
| Wake Up Early     | We consider "early" any time before 7 am.                |
| Exercise          | At least 30 minutes of exercise.                         |
| Healthy Food      | Eat something healthy during the day (TODO).             |
| Sufficient Sleep  | At least 8 hours of sleep.                               |
| Reading           | At least 15 minutes of reading.                          |
| Daily Planning    | Spend at least 5 minutes writing your Daily Plan.        |
| Daily Reflection  | Spend at least 5 minutes writing about your day.         |
| Language Learning | At least 15 minutes of learning and studying a language. |
| Study and Work    | At least 6 hours of study or work.                       |

- **Habit Logs**:

| Habit Name        | Habit Log Example                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Wake Up Early     | Take a picture of anything showing what time it is (time can be provided by the app)         |
| Exercise          | Take a picture in the mirror after going for a run                                           |
| Healthy Food      | Take a picture of the food you are eating                                                    |
| Sufficient Sleep  | Take a picture when you go to bed showing what time it is (time can be provided by the app)  |
| Reading           | Take a picture of the book or post you are reading                                           |
| Daily Planning    | Take a picture of your notes. Write down your plans and objectives for today                 |
| Daily Reflection  | Take a picture of your notes. Write a short reflection based on your daily planning          |
| Language Learning | Take a picture of whatever you are learning about (such as an English Grammar book)          |
| Study and Work    | Take a picture of anything and explain what you've been working on, or what you have studied |

## Database Entities

- **User**:

  - **Fields**:
    - `id` (UUID, primary key)
    - `username` (string, unique)
    - `email` (string, unique)
    - `password` (hashed)
    - `profile_picture_url` (string, optional)
    - `level` (integer, default `1`)
    - `experience_points` (integer, default `0`)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

- **Habit**:

  - **Fields**:
    - `id` (UUID, primary key)
    - `user_id` (foreign key to **User**)
    - `name` (string)
    - `rules` (text)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
    - `is_deleted` (boolean, default `false`)

- **HabitLog**:

  - **Fields**:
    - `id` (UUID, primary key)
    - `habit_id` (foreign key to **Habit**)
    - `date` (date)
    - `text_entry` (text, optional)
    - `photo_url` (string)
    - `created_at` (timestamp)

- **HabitLogValidation**:

  - **Fields**:
    - `id` (UUID, primary key)
    - `habit_log_id` (foreign key to **HabitLog**)
    - `validator_user_id` (foreign key to **User**)
    - `validated_at` (timestamp)

- **HabitLogComment**:

  - **Fields**:
    - `id` (UUID, primary key)
    - `habit_log_id` (foreign key to **HabitLog**)
    - `user_id` (foreign key to **User**)
    - `text` (text)
    - `created_at` (timestamp)

- **ExperienceLog**:
  - **Fields**:
    - `id` (UUID, primary key)
    - `user_id` (foreign key to **User**)
    - `activity_type` (enum: 'habit_log_creation', 'habit_log_validation', 'streak_milestone', etc)
    - `related_id` (UUID, optional) - References related entity (e.g., HabitLog ID)
    - `xp_gained` (integer)
    - `created_at` (timestamp)

TODO:

- UserFriendship

## API Endpoints

### Auth

#### `POST /api/auth/signup` ✅

Signs up a new user.

- **Request:**

  - **Headers:**

    - `Content-Type: application/json`

  - **Body:**

    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "strongpassword"
    }
    ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "profile_picture_url": null,
      "id": "dcd2f64a-4279-4694-8355-c92bf3afc34a",
      "level": 1,
      "experience_points": 0,
      "created_at": "2024-11-10T23:17:43.884Z",
      "updated_at": "2024-11-10T23:17:43.884Z"
    }
    ```

#### `POST /api/auth/login` ✅

Login existing user with their credentials.

- **Request:**

  - **Headers:**

    - `Content-Type: application/json`

  - **Body:**

    ```json
    {
      "username": "testuser",
      "password": "strongpassword"
    }
    ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
      "accessToken": "eyJhbGciOiJIU..."
    }
    ```

### Users

#### `GET /api/users/profile` ✅

Retrieves information about the authenticated user.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
      "id": "876b197c-a2d1-485d-9fb2-e933ef0853a5",
      "username": "cassie",
      "email": "cassiegiovagnoli@gmail.com",
      "profile_picture_url": null
    }
    ```

### Habits

#### `GET /api/habits` ✅

Retrieves all non-deleted habits of the authenticated User.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    [
      {
        "id": "uuid",
        "name": "Exercise",
        "rules": "At least 30 minutes of exercise"
      },
      {
        "id": "uuid",
        "name": "Sufficient Sleep",
        "rules": "At least 8 hours of sleep"
      }
    ]
    ```

#### `POST /api/habits` ✅

Adds a new habit for the authenticated user.

- **Request:**

  - **Headers:**

    - `Content-Type: application/json`

  - **Body:**

    ```json
    {
      "name": "Exercise",
      "rules": "At least 30 minutes of exercise"
    }
    ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
      "id": "uuid",
      "name": "Exercise",
      "rules": "At least 30 minutes of exercise"
    }
    ```

#### `PUT /api/habits/{id}` ✅

Updates an existing habit.

- **Parameters:**

  - `id` (required): UUID of the habit to update.

- **Request:**

  - **Headers:**

    - `Content-Type: application/json`

  - **Body:**

    ```json
    {
      "name": "Habit Name",
      "rules": "Habit Rules"
    }
    ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
      "id": "uuid",
      "name": "Exercise",
      "rules": "At least 30 minutes of exercise"
    }
    ```

#### `DELETE /api/habits/{id}` ✅

Soft-deletes a habit.

- **Parameters:**

  - `id` (required): UUID of the habit to soft-delete.

- **Response:**

  - **Status:** `204 No Content`

### Habit Logs

#### `GET /api/logs`

TODO

## Frontend Pages/Routes

### Login `/login`

> If user is already authenticated, it gets redirected to `/`

Allows users to login with their credentials.

Displays a form with the following inputs:

- Text input for the username.
- Password input for the password.
- Login button.
- Link to the signup page (text example: "Don't have an account? Signup here").

Basic client-validation must be implemented (example: required fields, min length?).

The Login button sends a POST request to `/api/auth/login` with the following body:

```json
{
  "username": "admin",
  "password": "password123"
}
```

If the request failed, we should display user-friendly errors.

If the request is successfull, we must store the `accessToken` from the response somewhere locally, and use it to execute any following requests to the API (TODO: using an Interceptor or something similar? Find a library.) After that, the user gets redirected to `/`.

The Signup link redirects the page to `/signup`.

### Signup `/signup`

> If user is already authenticated, it gets redirected to `/`

Allows new people to create an user account.

Displays a form with the following inputs:

- Text input for the username.
- Text input for the email.
- Password input for the password.
- Signup button.
- Link to the login page (text example: "Already have an account? Login here").

Basic client-validation must be implemented (example: required fields, min length?).

The Signup button sends a POST request to `/api/auth/signup` with the following body:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "strongpassword"
}
```

If the request failed, we must display the server errors (example: 'Username already exists');

If the request is sucessfull, we should display a "User successfully created" notification. After that, the page gets redirected to `/login`.

### Home `/`

> If user is not authenticated, it gets redirected to `/login`

TODO
