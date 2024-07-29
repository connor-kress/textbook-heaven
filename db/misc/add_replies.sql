INSERT INTO replies (question_id, parent_reply_id, author, post_date, body)
VALUES (1, NULL, 'Mandar', TIMESTAMP '2024-1-30 10:23:54', 'Reply 1'),
       (1, 1, 'Connor', TIMESTAMP '2004-9-11 06:35:17', 'Reply 2'),
       (1, 1, 'Omar', TIMESTAMP '2024-3-15 23:59:59', 'Reply 3');

-- CREATE TABLE replies (
--     id SERIAL PRIMARY KEY,
--     author VARCHAR(50) NOT NULL,
--     post_date TIMESTAMP NOT NULL,
--     likes INT DEFAULT 0,
--     dislikes INT DEFAULT 0,
--     body TEXT NOT NULL,
--     parent_reply_id INT
--         REFERENCES replies(id)
--         ON DELETE CASCADE,
--     question_id INT NOT NULL
--         REFERENCES questions(id)
--         ON DELETE CASCADE
-- );
