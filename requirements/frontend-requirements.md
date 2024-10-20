# Frontend Requirements for Jobs Page

## Overview

The jobs page should display a list of available job positions with the following features:

## Features

1. **Search and Filter**

   - Include a search bar for job titles.
   - Provide dropdown filters for:
     - Job Type
       - Full-time
       - Contract
     - Location

2. **Job Listings**

   - Each job listing should include:
     - Job Title
     - Salary Range
     - Employment Type (e.g., Fulltime, Part-time)
     - Department (e.g., Engineering, Design)
     - Location (e.g., San Francisco, Remote)
   - Include an "Apply Now" button for each job.

3. **Design**

   - Use a clean and modern design with clear typography.
   - Ensure the "Apply Now" button is prominent and easy to click.

4. **Responsive Design**

   - Ensure the page is responsive and works well on both desktop and mobile devices.

5. **Accessibility**

   - Follow accessibility best practices to ensure the page is usable for all users.
   - There will be on pagination for the jobs. So the user can scroll to see more jobs.
   - As of now display dummy data.

## Additional Notes

- Ensure the page loads quickly and efficiently.
- Consider using a framework or library for UI components if necessary.
- We will use Next.js, Shadcn, Supabase, Clerk for authentication.

## Current file structure

LETMEAPPLY/
│
├── app/
│ ├── fonts/
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
│
├── lib/
│ └── utils.ts
│
├── node_modules/
│
├── requirements/
│ ├── frontend-requirements.md
│ └── jobspage.png
│
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

## Rules

- All new components should go in /components and be named like example-component.tsx unless otherwise specified.
- All new pages should go in /pages and be named like example-page.tsx unless otherwise specified.
