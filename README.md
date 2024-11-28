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
      - [`GET api/users/friends` ✅](#get-apiusersfriends-)
      - [`GET /api/users/xp` ✅](#get-apiusersxp-)
    - [Habits](#habits)
      - [`GET /api/habits` ✅](#get-apihabits-)
      - [`GET /api/habits/{id}` ✅](#get-apihabitsid-)
      - [`POST /api/habits` ✅](#post-apihabits-)
      - [`PUT /api/habits/{id}` ✅](#put-apihabitsid-)
      - [`DELETE /api/habits/{id}` ✅](#delete-apihabitsid-)
    - [Habit Logs](#habit-logs)
      - [`GET /api/logs` ✅](#get-apilogs-)
      - [`GET /api/logs/{id}` ✅](#get-apilogsid-)
      - [`POST /api/logs` ✅](#post-apilogs-)
      - [`DELETE /api/logs/{id}` ✅](#delete-apilogsid-)
      - [`POST /api/logs/{id}/validate` ✅](#post-apilogsidvalidate-)
      - [`POST /api/logs/{logId}/comments` ✅](#post-apilogslogidcomments-)
      - [`DELETE /api/logs/{logId}/comments/{commentId}` ✅](#delete-apilogslogidcommentscommentid-)
  - [Frontend Pages/Routes](#frontend-pagesroutes)
    - [Shared/Layout (Navbar) ✅](#sharedlayout-navbar-)
    - [Login `/login` ✅](#login-login-)
    - [Signup `/signup` ✅](#signup-signup-)
    - [Home `/` ✅](#home--)
    - [Profile `/profile` ✅](#profile-profile-)
    - [Habits `/habits` ✅](#habits-habits-)
    - [View Habit `/habits/{id}` ✅](#view-habit-habitsid-)
    - [Create Habit `/habits/new` ✅](#create-habit-habitsnew-)
    - [Edit Habit `/habits/{id}/edit` ✅](#edit-habit-habitsidedit-)
    - [Log Habit `/logs/new` ✅](#log-habit-logsnew-)
    - [View Habit Log `/logs/{id}` ✅](#view-habit-log-logsid-)
    - [Friends `/friends` ✅](#friends-friends-)
    - [View Friend `/friends/{id}` ✅](#view-friend-friendsid-)

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
| Healthy Food      | Eat something healthy during the day.                    |
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

    ```
    uuid
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

Retrieves information about a User.

- **Query Parameters:**

  - `userId` (optional): Optional user to filter by.
    - If `userId` isn't provided, the endpoint returns information about the authenticated user.
    - Otherwise the endpoint returns information about the given user.

Example: `/api/users/profile?userId={uuid}`

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
      "id": "876b197c-a2d1-485d-9fb2-e933ef0853a5",
      "username": "cassie",
      "profilePictureUrl": null,
      "level": 1,
      "currentExperiencePoints": 1,
      "requiredExperiencePoints": 100
    }
    ```

#### `GET api/users/friends` ✅

Retrieves a list of the user's friends.

**NOTE: UPDATE AFTER IMPLEMENTING FRIENSHIP ENTITY.**

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    [
      {
        "id": "876b197c-a2d1-485d-9fb2-e933ef0853a5",
        "username": "cassie",
        "profile_picture_url": null,
        "level": 1,
        "currentExperiencePoints": 1,
        "requiredExperiencePoints": 100
      }
    ]
    ```

#### `GET /api/users/xp` ✅

Retrieves experience points logs. Sorted by date (recent first). Paginated.

- **Query Parameters:**

- `pageNumber`: Optional page number for pagination. Defaults to 1.
- `pageSize`: Optional page size for pagination. Defaults to 10.

Example: `/api/users/xp?pageNumber={number}&pageSize={number}`

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    [
      {
        "id": "uuid",
        "relatedId": "uuid",
        "xpGained": 10,
        "activityType": "string",
        "createdAt": "date"
      }
    ]
    ```

### Habits

#### `GET /api/habits` ✅

Retrieves all non-deleted habits of the authenticated User. If `userId` is provided, it returns the Habits of that user.

- **Query Parameters:**

  - `userId` (optional): Optional user to filter habits by.
    - If `userId` isn't provided, the endpoint returns habits from the authenticated user.
    - Otherwise the endpoint returns only logs from the given user.

Example: `/api/habits?userId={uuid}`

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    [
      {
        "id": "uuid",
        "name": "Exercise",
        "wasLoggedToday": true,
        "wasValidatedToday": false
      }
    ]
    ```

#### `GET /api/habits/{id}` ✅

Retrieves a specific habit.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Exercise",
        "rules": "At least 30 minutes of exercise",
        "wasLoggedToday": true,
        "wasValidatedToday": false,
        "currentStreak": 1,
        "highestStreak": 10
      },
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

    ```
    uuid
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

  - **Status:** `204 No Content`

#### `DELETE /api/habits/{id}` ✅

Soft-deletes a habit.

- **Parameters:**

  - `id` (required): UUID of the habit to soft-delete.

- **Response:**

  - **Status:** `204 No Content`

### Habit Logs

#### `GET /api/logs` ✅

Retrieves habit logs, optionally filtered by habitId. Sorted by date (recent first). Paginated.

- **Query Parameters:**

  - `habitId` (optional): Optional habit to filter logs by.
    - If `habitId` isn't provided, the endpoint returns logs from any user.
    - Otherwise the endpoint returns only logs from the given habit (for the owner user).
  - `pageNumber`: Optional page number for pagination. Defaults to 1.
  - `pageSize`: Optional page size for pagination. Defaults to 10.

Example: `/api/logs/?habitId={uuid}&pageNumber={number}&pageSize={number}`

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    [
      {
        "id": "uuid",
        "habitId": "uuid",
        "habitName": "string",
        "userId": "uuid",
        "username": "string",
        "userProfilePictureUrl": "string",
        "photoUrl": "Photo Url",
        "createdAt": "date",
        "validatedBy": [
          {
            "userId": "uuid",
            "username": "Username 1",
            "userProfilePictureUrl": "string",
            "validatedAt": "string"
          }
        ]
      }
    ]
    ```

#### `GET /api/logs/{id}` ✅

Retrieves a specific habit log.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
      "id": "uuid",
      "userId": "uuid",
      "username": "string",
      "habitId": "uuid",
      "habitName": "string",
      "textEntry": "string",
      "photoUrl": "string",
      "createdAt": "date",
      "validatedBy": [
        {
          "userId": "uuid",
          "username": "string",
          "userProfilePictureUrl": "string",
          "validatedAt": "string"
        }
      ],
      "comments": [
        {
          "id": "uuid",
          "userId": "uuid",
          "username": "string",
          "userProfilePictureUrl": "string",
          "text": "string",
          "createdAt": "string"
        }
      ]
    }
    ```

#### `POST /api/logs` ✅

Adds a new log for a habit.

- **Request:**

  - **Headers:**

    - `Content-Type: multipart/form-data`

  - **Form Data:**

    - `habitId`: `string` - The id of the habit.
    - `photo`: `File` - Image file as the "proof" of the habit.
    - `text`: `string` - Optional text entry as proof of the habit.

- **Response:**

  - **Status:** `201 Created`
  - **Body:**
    ```
    "uuid"
    ```

#### `DELETE /api/logs/{id}` ✅

Deletes a habit log.

- **Parameters:**

  - `id` (required): UUID of the habit to delete.

- **Response:**

  - **Status:** `204 No Content`

#### `POST /api/logs/{id}/validate` ✅

Validates a Habit Log from a friend (can be performed only once by the same user).

- **Response:**

  - **Status:** `204 No Content`

#### `POST /api/logs/{logId}/comments` ✅

Adds a new comment to a Habit Log.

- **Request:**

  - **Headers:**

    - `Content-Type: application/json`

  - **Body:**

    ```json
    {
      "text": "Good job!"
    }
    ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    "uuid"
    ```

#### `DELETE /api/logs/{logId}/comments/{commentId}` ✅

Deletes a comment from a Habit Log (made by the authenticated user).

- **Parameters:**

  - `logId` (required): UUID of the Habit Log.
  - `commentId` (required): UUID of the comment to delete.

- **Response:**

  - **Status:** `204 No Content`

## Frontend Pages/Routes

### Shared/Layout (Navbar) ✅

**User is authenticated:**

Displays a navbar with the following links:

- Hamburguer menu button:
  - Profile: `/profile`
  - Habits: `/habits`
  - Friends: `/friends`
- Logo image: `/`
- Log Habit button: `/logs/new`
- Logout button: removes the stored token and redirects to login.

**User is not authenticated:**

Displays a navbar with a logo `/` (no action links, no menu, etc).

### Login `/login` ✅

**If user is already authenticated, it gets redirected to `/`**

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

If the request is successfull, we must store the `accessToken` from the response somewhere locally, and use it to execute any following requests to the API. After that, the user gets redirected to `/`.

The Signup link redirects the page to `/signup`.

### Signup `/signup` ✅

**If user is already authenticated, it gets redirected to `/`**

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

If the request is sucessfull, we should display a "User successfully created" alert. After that, the page gets redirected to `/login`.

### Home `/` ✅

> If user is not authenticated, it gets redirected to `/login`

- Displays a header with statistics of your daily habits (example: Today's habits: 3/10).

  - Users can click this header to go to the habits page `/habits`.
  - This data can be obtained by executing a GET request to `/api/habits`

- Displays a timeline with the latest habit logs from everyone, similar to how the Instagram/Facebook feed works (with infinite scroll).
  - Each Habit Log item contains:
    - Username + Avatar Picture
    - Created date (relative, example: "2 hours ago")
    - Picture
    - Habit Name
  - Users can click on these items to go to the View Habit Log page `/logs/{id}`
  - This data can be obtained by executing a GET request to `/api/logs`

### Profile `/profile` ✅

- Displays the following information about the current user:
  - Profile picture
    - Users can click here to update the picture.
  - Username
  - Level
  - Experience points (example: "0/100")
  - This data can be obtained by executing a GET request to `/api/users/profile`
- Displays a list of the experience points received recently, with the ability to load more (paginated table).
  - Each item should display the following data:
    - Amount of experience points gained
    - Reason based on activityType
    - Date (relative)
    - Link to related entity Id
  - There should be a button to load more records.
  - This data can be obtained by executing a GET request to `/api/users/xp`

### Habits `/habits` ✅

- Displays a "Add Habit" button. Redirects to `/habits/new`
- Displays a header with the number of logged habits vs total habits (example: "Logged habits: 1/4")
- Displays a list of your habits:
  - Each item contains the following data or action items:
    - Habit Name
    - Habit Was Logged Icon (☑️)
    - Habit Was Validated Icon (✅)
    - View/Edit button 📂: Redirects to `/habits/{id}`
- The data for this page can be obtained by executing a GET request to `/api/habits`

### View Habit `/habits/{id}` ✅

- Displays the name of the Habit.
- Displays an alert with information about whether the habit was not logged/validated yet (for the current day).
- Displays an Edit Habit button: Redirects to `/habits/{id}/edit`
  - Only visible if the user owns the Habit.
- Displays a Delete Habit button:
  - User must confirm before deleting the Habit.
  - Executes a DELETE request to `/api/habits/{id}`.
  - After success deletion, redirects to `/habits`.
  - Only visible/allowed if the user owns the Habit.
- Displays a label with information about the current streak, and the highest streak achieved.
  - Example: "Current Streak: 5 days (Highest: 14 days)"
- The data for most of this page can be obtained by executing a GET request to `/api/habits/{id}`
- Displays a list of the latest logs for the habit.
  - Each item contains the following information:
    - Created date
    - An icon indicating whether the log was validated (✅)
  - The list is sorted by date (recent first).
  - Users can click to view more details about a Habit Log: Redirects to `/logs/{id}`
  - The data for this list can be obtained by executing a GET request to `/api/logs/?habitId={uuid}`

### Create Habit `/habits/new` ✅

Allows users to create a new habit.

- Displays a form with the following fields:
  - Name: input text, required.
  - Rules: textarea, required.
  - Create button.
- Submitting the form will send a POST request to `/api/habits`

### Edit Habit `/habits/{id}/edit` ✅

Allows users to update an existing habit.

If the current user is not the owner of the Habit, it gets redirected to `/`.

- Displays a form with the following fields:
  - Name: input text, required.
  - Rules: textarea, required.
  - Save button.
- Submitting the form will send a PUT request to `/api/habits/{id}`

### Log Habit `/logs/new` ✅

Allows users to submit a Log for a Habit.

- Displays a form with the following fields:
  - Displays a dropdown for selecting the Habit to log:
    - Habit Dropdown:
      - Allows the user to select the Habit to log.
      - The items for the dropdown can be obtained by executing a GET request to `/api/habits`. Items that were already logged shouldn't be visible.
  - Picture input:
    - User should be able to take a picture or select a file from the device.
  - Text entry (optional): Textarea
  - Save button.
- Submitting the form will send a POST request to `/api/logs`.
  - After submission, an alert is displayed and the user is redirected to `/logs/{id}`.

### View Habit Log `/logs/{id}` ✅

Allows users to view information about a specific Habit Log. Users can view and add comments to the Habit Log. Users can validate Habit Logs from their friends. Users can delete a Habit Log (only if they own the Habit Log).

The information about the Habit Log can be obtained by executing a GET request to `/api/logs/{id}`.

- Displays information about the Habit Log:

  - Fields:
    - Username (owner) + Avatar
    - Photo
    - Habit Name
    - Text entry
    - Created date (relative)

- Displays a Delete Log button.

  - Only visible to the owner of the Habit Log.
  - User must confirm the deletion.
  - Sends a DELETE request to `/api/logs/{id}`.

- Displays a Validate button for validating the habit Log.

  - Not visible to the owner of the Habit Log.
  - Not visible if the current user already validated the Habit Log.
  - User must confirm the action.
  - Sends a POST request to `/api/logs/{id}/validate`.

- Displays a list of the validations made to the Habit Log:

  - Username + Avatar
  - Validation date (relative)

- Displays a list of the comments made to the Habit Log.
  - Comment fields:
    - Username
    - Comment text
    - Created Date (relative)
- Displays a text input for adding a new comment, including a Add Comment button.
  - Executes a POST request to `/api/logs/{logId}/comments`

### Friends `/friends` ✅

Displays a list all users (except the current user):

- Each item contains the following information and action items:
  - Name
  - View button: Redirects to `/friends/{id}`
- This data can be obtained by executing a GET request to `/api/users/friends`

### View Friend `/friends/{id}` ✅

- Displays a section with information about the friend:
  - Fields:
    - Profile picture
    - Username
    - Level
    - Experience points (example: "0/100")
  - This data can be obtained by executing a GET request to `/api/users/profile?userId={id}`
- Display a section with information about its habits:
  - Displays a header with the number of logged habits vs total habits (example: "Logged habits: 1/4")
  - Displays a list of your habits:
    - Each item contains the following data or action items:
      - Habit Name
      - Habit Was Logged Icon (☑️)
      - Habit Was Validated Icon (✅)
      - View/Edit button 📂: Redirects to `/habits/{id}`
    - This data can be obtained by executing a GET request to `/api/habits?userId={id}`
