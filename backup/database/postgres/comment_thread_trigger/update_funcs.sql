CREATE OR REPLACE FUNCTION update_thread_rating()
	RETURNS trigger AS
    $BODY$
    BEGIN
    	IF TG_OP = 'UPDATE'  THEN
        	UPDATE posts.thread SET points = (points + NEW.rating - OLD.rating) WHERE id = OLD.thread_id;
        ELSE
    		UPDATE posts.thread SET points = (points + NEW.rating) WHERE id = NEW.thread_id;
        END IF;
        RETURN NEW;
    END;
    $BODY$ LANGUAGE plpgsql;
    
CREATE OR REPLACE FUNCTION update_comment_rating()
	RETURNS trigger AS
    $BODY$
    BEGIN
    	IF TG_OP = 'UPDATE'  THEN
        	UPDATE posts.comment SET points = (points + NEW.rating - OLD.rating) WHERE id = OLD.comment_id;
        ELSE
    		UPDATE posts.comment SET points = (points + NEW.rating) WHERE id = NEW.comment_id;
        END IF;
        RETURN NEW;
    END;
    $BODY$ LANGUAGE plpgsql;