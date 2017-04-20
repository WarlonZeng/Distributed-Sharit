CREATE TRIGGER update_thread AFTER
UPDATE OR INSERT ON ratings."ThreadRating"
FOR EACH ROW
EXECUTE PROCEDURE update_thread_rating();

CREATE TRIGGER update_comment AFTER
UPDATE OR INSERT ON ratings."CommentRating"
FOR EACH ROW
EXECUTE PROCEDURE update_comment_rating();