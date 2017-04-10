-- INSERT INTO posts.thread(subdomain_id, author, title, context) VALUES (1, 'admin', 'Yo', 'Sup');
-- INSERT INTO ratings."ThreadRating"(thread_id, username, rating) VALUES (2, 'admin', 1);
-- UPDATE ratings."ThreadRating" SET rating = -1 WHERE thread_id = 2 AND username = 'admin';
-- INSERT INTO posts.comment(thread_id, author, comment) VALUES (2, 'admin', 'Yo');
-- INSERT INTO ratings."CommentRating"(comment_id, username, rating) VALUES (1, 'admin', 1);
UPDATE ratings."CommentRating" SET rating = -1 WHERE comment_id = 1 AND username = 'admin';