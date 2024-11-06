# Habits Together

A personal habit-tracking app that fosters community accountability through validations and comments from other users.

## Description

Habits Together is designed to help you build and maintain positive habits by allowing you to create personal habits and share your progress with your friends. While each user works on their own habits, the app encourages accountability and support through validations and comments from other users. When you log your habit, other users can validate your entry and leave encouraging comments, helping you stay committed and motivated.

## Features

- **Personal Habit Creation**: Create your own habits with custom rules and track them over time.
- **Daily Habit Logging**: Log your habit daily by providing text entries and/or photos.
- **Community Validations**: Receive validations from other users on your habit logs; at least one validation is needed for the log to be considered validated for the day.
- **Comments**: Engage with the community by leaving comments on habit logs and receiving feedback on yours.
- **Individual Streak Tracking**: Track your personal streaks for each habit based on consecutive validated logs.
- **User Authentication**: Secure sign-up and login processes to protect your data.

## Technologies Used

- **Backend**: NestJS
- **Frontend**: Next.js
- **Database**: PostgreSQL

## Requirements

- **User Authentication**: Users must be able to sign up, log in, and manage their accounts securely.
- **Habit Management**:
  - Users can create, view, and delete their own habits.
  - Each habit includes a name and rules.
- **Habit Logging**:
  - Users can log their habits once per day.
  - Logs must include at least a text entry or a photo, or both.
  - Only one log per habit per day is allowed.
- **Habit Log Validation**:
  - Other users can validate habit logs.
  - A habit log is considered validated when it receives at least one validation.
  - Users cannot validate their own habit logs.
- **Comments on Habit Logs**:
  - Users can leave comments on any habit log.
  - Comments are visible to all users.
- **Streak Calculation**:
  - Personal streaks are calculated based on consecutive days of validated habit logs.
  - Missing a day or not having a log validated resets the streak.

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
| Daily Planning    | Write down your plans and objectives for today                                               |
| Daily Reflection  | Write a short reflection based on your daily planning                                        |
| Language Learning | Take a picture of whatever you are learning about (such as an English Grammar book)          |
| Study and Work    | Take a picture of anything and explain what you've been working on, or what you have studied |
