# Habits Together

A personal habit-tracking app that fosters community accountability through validations, comments, and gamification elements to make habit-building engaging and fun.

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
| Sufficient Sleep  | At least 6 hours of sleep.                               |
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
