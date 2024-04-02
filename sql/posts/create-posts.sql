DO
$$
    DECLARE
        i                     INT := 0;
        current_gender        post_gender_enum;
        current_ages          post_ages_enum[];
        current_researchTypes post_research_types_enum[];
        current_user_id       INT;
    BEGIN
        -- Assuming you have at least one user in your User table, adjust as necessary
        SELECT INTO current_user_id id FROM "user" LIMIT 1;

        FOR i IN 1..100
            LOOP
                -- Example logic to alternate gender
                IF i % 2 = 0 THEN
                    current_gender := 'Male';
                ELSE
                    current_gender := 'Female';
                END IF;

                -- Generate arrays for ages and researchTypes based on iteration
                current_ages := ARRAY ['10-19', '20-29']::post_ages_enum[];
                current_researchTypes :=
                        ARRAY ['survey', 'interview']::post_research_types_enum[];

                -- Adjust the array contents based on the loop iteration for variety
                IF i % 4 = 0 THEN
                    current_ages := ARRAY ['30-39', '40-49']::post_ages_enum[];
                    current_researchTypes :=
                            ARRAY ['userTest', 'other']::post_research_types_enum[];
                ELSIF i % 3 = 0 THEN
                    current_ages := ARRAY ['50-59', '60-69']::post_ages_enum[];
                    current_researchTypes :=
                            ARRAY ['survey']::post_research_types_enum[];
                ELSIF i % 2 = 0 THEN
                    current_ages := ARRAY ['70-79', '80+']::post_ages_enum[];
                    current_researchTypes :=
                            ARRAY ['interview', 'userTest']::post_research_types_enum[];
                END IF;

                INSERT INTO post (title, end_date, gender, ages, research_types,
                                  url, procedure, duration, content, view_count,
                                  author_id, created_at, updated_at)
                VALUES ('Post Title ' || i,
                        NOW() + (i * INTERVAL '1 day') -
                        (20 * INTERVAL '1 day'),
                        current_gender,
                        current_ages,
                        current_researchTypes,
                        'http://example.com',
                        'Procedure for post ' || i,
                        'Duration ' || i || ' hours',
                        'Content for post ' || i,
                        i * 10, -- Example view count
                        current_user_id,
                        NOW(),
                        NOW());
            END LOOP;
    END
$$;
