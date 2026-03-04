# Swiftly - AI Instructor Platform

Swiftly is an educational platform that leverages AI to provide personalized instruction within a validated and monitored environment.

## Features

1.  **Institutional Registry**: Validates school credentials and ingests official curriculum (Textbooks/Syllabi) to ensuring the AI stays on-topic.
2.  **Teacher Command Center**: Allows teachers to define the "Digital Perimeter" (lesson scope) and generate secure invite codes for students.
3.  **Student Active Session**: An AI-driven tutoring interface that adapts to student speed while adhering to the teacher's perimeter.
4.  **Live Dashboard**: Real-time monitoring for teachers to track student progress and intervene when necessary.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the application**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Usage Flow

1.  Go to **/registry** to "Validate" a school (e.g., "Lincoln High School") and upload a mock syllabus.
2.  Go to **/teacher/command-center** to create a lesson topic (e.g. "American Revolution") and get an **Invite Code**.
3.  Open a new tab/window at **/student/session** and enter the Invite Code to join as a student.
    - Chat with the mock AI tutor.
4.  In the original window, go to **/teacher/dashboard** to see the active session and simulated progress.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS
-   **Language**: TypeScript

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
