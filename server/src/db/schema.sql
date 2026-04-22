-- PP (Progress Over Perfection) Database Schema (T-SQL / Azure SQL Version)

-- Users table
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    b2c_id NVARCHAR(255) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    name NVARCHAR(255),
    location NVARCHAR(100), -- For holidays
    menstrual_settings NVARCHAR(MAX) DEFAULT '{"cycle_length": 28, "period_length": 5}', -- SQL Server stores JSON in NVARCHAR
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Tasks table (Work List)
CREATE TABLE tasks (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    deadline DATETIMEOFFSET,
    priority NVARCHAR(50) CHECK (priority IN ('urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important')),
    status NVARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    completed_at DATETIMEOFFSET,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Subtasks
CREATE TABLE subtasks (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    task_id UNIQUEIDENTIFIER REFERENCES tasks(id) ON DELETE CASCADE,
    title NVARCHAR(255) NOT NULL,
    is_done BIT DEFAULT 0 -- BOOLEAN -> BIT in SQL Server
);

-- File Attachments (Azure Blob Metadata)
CREATE TABLE task_files (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    task_id UNIQUEIDENTIFIER REFERENCES tasks(id) ON DELETE CASCADE,
    file_name NVARCHAR(255) NOT NULL,
    blob_url NVARCHAR(MAX) NOT NULL,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Events table (Calendar)
CREATE TABLE events (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    start_time DATETIMEOFFSET NOT NULL,
    end_time DATETIMEOFFSET NOT NULL,
    type NVARCHAR(50) DEFAULT 'event', -- event, meeting, deadline, birthday, anniversary, holiday, academic
    recurrence_pattern NVARCHAR(50) DEFAULT 'none', -- none, daily, weekly, monthly, yearly
    color_code NVARCHAR(7),
    emoji NVARCHAR(10),
    is_manual_override BIT DEFAULT 0,
    manual_data NVARCHAR(MAX), -- For specific overrides
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Specialized Logs (Emotional/Mood)
CREATE TABLE mood_logs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    emotions NVARCHAR(MAX), -- Array of objects stored as JSON string
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT UQ_Mood_User_Date UNIQUE(user_id, log_date)
);

-- Specialized Logs (Menstrual)
CREATE TABLE menstrual_logs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptoms NVARCHAR(MAX), -- Array of symptoms
    intensity INT CHECK (intensity BETWEEN 1 AND 5),
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT UQ_Menstrual_User_Date UNIQUE(user_id, log_date)
);

-- Finance Entries
CREATE TABLE finance_entries (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    item_name NVARCHAR(255) NOT NULL,
    category NVARCHAR(100),
    cost DECIMAL(12, 2) NOT NULL,
    payment_mode NVARCHAR(50),
    type NVARCHAR(20) CHECK (type IN ('need', 'want', 'saving')),
    entry_date DATE DEFAULT CAST(GETDATE() AS DATE),
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Grocery List
CREATE TABLE groceries (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    item_name NVARCHAR(255) NOT NULL,
    is_checked BIT DEFAULT 0,
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);

-- Entertainment List
CREATE TABLE entertainment (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    type NVARCHAR(50), -- book, movie, meetup, coffee, recipe
    title NVARCHAR(255) NOT NULL,
    details NVARCHAR(MAX), -- links, recipes, etc.
    created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
);
