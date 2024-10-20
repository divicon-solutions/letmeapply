# Backend Requirements

## User Management API

- **Create User**: Endpoint to register a new user, integrating with Clerk for authentication and Supabase for profile management.
- **Get User**: Endpoint to retrieve user details based on the authenticated user's session.
- **Update User**: Endpoint to update user information in both Clerk and Supabase.
- **Delete User**: Endpoint to delete the user’s account from both Clerk and Supabase.

## Technologies

- **Next.js**: Framework for building the application.
- **Supabase**: Database management.
- **Clerk**: Authentication and user management.





-- Users table (unchanged)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    uid VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table (unified approach)
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resumes Table (Stores general resumes)
CREATE TABLE resumes (
    resume_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tailored Resumes Table (Stores job-specific tailored resumes)
CREATE TABLE tailored_resumes (
    tailored_resume_id SERIAL PRIMARY KEY,
    original_resume_id INTEGER REFERENCES resumes(resume_id), -- Links to the original general resume
    job_id INTEGER REFERENCES jobs(job_id),
    user_id INTEGER REFERENCES users(user_id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id) -- Ensures one tailored resume per job for each user
);

-- User Job Interactions Table (Stores user interactions with job listings)
CREATE TABLE user_job_interactions (
    interaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    job_id INTEGER REFERENCES jobs(job_id),
    interaction_type VARCHAR(20) NOT NULL, -- 'marked', 'applied', 'matched'
    status VARCHAR(20),
    score DECIMAL(5,2),
    resume_id INTEGER NOT NULL, -- Reference to either a general or tailored resume
    is_tailored BOOLEAN DEFAULT FALSE, -- Indicates if the resume is tailored for the specific job
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_jobs_active_expiry ON jobs(is_active, expires_at);
CREATE INDEX idx_resumes_user ON resumes(user_id);
CREATE INDEX idx_tailored_resumes_job ON tailored_resumes(job_id);
CREATE INDEX idx_interactions_user_job ON user_job_interactions(user_id, job_id);


// FIX FROM HERE
CREATE TABLE tailored_resumes (
    tailored_resume_id SERIAL PRIMARY KEY,
    original_resume_id INTEGER REFERENCES resumes(resume_id),
    job_id INTEGER REFERENCES jobs(job_id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(original_resume_id, job_id)
);