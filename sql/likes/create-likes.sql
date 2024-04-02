DO
$$
    DECLARE
        user_id INT;
        post_id INT;
    BEGIN
        -- Loop through each user in the user table
        FOR user_id IN SELECT id FROM "user"
            LOOP

                for post_id in select id from "post" order by random() limit 10
                    LOOP
                        INSERT INTO "like" (user_id, post_id)
                        VALUES (user_id, post_id);
                    END LOOP;
            END LOOP;
    END
$$;
