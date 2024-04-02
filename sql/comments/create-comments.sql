DO
$$
    DECLARE
        post_id INT;
        user_id INT;
    BEGIN
        -- Ensure there's a user to associate with comments, adjust as necessary
        SELECT INTO user_id id FROM public."user" LIMIT 1;

        -- Loop through each post
        FOR post_id IN SELECT id FROM post
            LOOP

                -- Generate 10 comments for the current post
                FOR i IN 1..10
                    LOOP
                        INSERT INTO comment (content, post_id, user_id,
                                             created_at, updated_at)
                        VALUES ('Comment ' || i || ' on post ' || post_id,
                                post_id, user_id, NOW(), NOW());
                    END LOOP;

            END LOOP;
    END
$$;
