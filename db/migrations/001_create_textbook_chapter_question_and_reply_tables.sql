CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE textbooks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(50),
    description TEXT,
    file_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    num INT NOT NULL,
    textbook_id INT NOT NULL
        REFERENCES textbooks(id)
        ON DELETE CASCADE
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    post_date TIMESTAMP NOT NULL,
    num INT NOT NULL,
    body TEXT NOT NULL,
    chapter_id INT NOT NULL
        REFERENCES chapters(id)
        ON DELETE CASCADE,
    UNIQUE (chapter_id, num)
);

CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
    post_date TIMESTAMP NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    body TEXT NOT NULL,
    parent_reply_id INT
        REFERENCES replies(id)
        ON DELETE CASCADE,
    question_id INT NOT NULL
        REFERENCES questions(id)
        ON DELETE CASCADE
);
