INSERT INTO replies (question_id, parent_reply_id, author_id, post_date, body)
VALUES (1, NULL, 2, TIMESTAMP '2024-1-30 10:23:54', 'Reply 1'),
       (1, 1, 1, TIMESTAMP '2004-9-11 06:35:17', 'Reply 2'),
       (1, 1, 3, TIMESTAMP '2024-3-15 23:59:59', 'Reply 3');
