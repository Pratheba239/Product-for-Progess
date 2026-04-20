-- PP (Progress Over Perfection) Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    b2c_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    location VARCHAR(100), -- For holidays
    menstrual_settings JSONB DEFAULT '{"cycle_length": 28, "period_length": 5}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table (Work List)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(50) CHECK (priority IN ('urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important')),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subtasks
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_done BOOLEAN DEFAULT FALSE
);

-- File Attachments (Azure Blob Metadata)
CREATE TABLE IF NOT EXISTS task_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    blob_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table (Calendar)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) DEFAULT 'event', -- event, meeting, deadline, birthday, anniversary, holiday, academic
    recurrence_pattern VARCHAR(50) DEFAULT 'none', -- none, daily, weekly, monthly, yearly
    color_code VARCHAR(7),
    emoji VARCHAR(10),
    is_manual_override BOOLEAN DEFAULT FALSE,
    manual_data JSONB, -- For specific overrides
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Specialized Logs (Emotional/Mood)
CREATE TABLE IF NOT EXISTS mood_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    emotions JSONB, -- Array of objects {emotion: string, color: string}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, log_date)
);

-- Specialized Logs (Menstrual)
CREATE TABLE IF NOT EXISTS menstrual_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptoms JSONB, -- Array of symptoms
    intensity INT CHECK (intensity BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, log_date)
);

-- Finance Entries
CREATE TABLE IF NOT EXISTS finance_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    cost DECIMAL(12, 2) NOT NULL,
    payment_mode VARCHAR(50),
    type VARCHAR(20) CHECK (type IN ('need', 'want', 'saving')),
    entry_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grocery List
CREATE TABLE IF NOT EXISTS groceries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment List
CREATE TABLE IF NOT EXISTS entertainment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50), -- book, movie, meetup, coffee, recipe
    title VARCHAR(255) NOT NULL,
    details JSONB, -- links, recipes, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
