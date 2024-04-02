DO
$$
    DECLARE
        i               INT  := 0;
        user_email      TEXT;
        user_provider   TEXT;
        user_providerId TEXT;
        user_nickname   TEXT;
        user_role       TEXT := 'User'; -- Assuming 'User' is a valid role in your Roles enum
        user_gender     TEXT;
        user_job        TEXT;
        user_interest   TEXT;
        user_birthDate  DATE;
    BEGIN
        FOR i IN 1..100
            LOOP
                user_email := 'user' || i || '@example.com';
                user_provider := 'provider' || (i % 10); -- Example to vary providers
                user_providerId := 'providerId' || i;
                user_nickname := 'Nickname' || i;
                user_gender :=
                        CASE WHEN i % 2 = 0 THEN 'Male' ELSE 'Female' END;
                user_job := 'Job' || (i % 5);
                user_interest := 'Interest' || (i % 4);
                user_birthDate := ('1990-01-01'::DATE + (i * 365) % 10000);

                INSERT INTO public."user" (email, provider, provider_id, role,
                                           created_date, nickname, gender, job,
                                           area_of_interest, birth_date)
                VALUES (user_email, user_provider, user_providerId, user_role,
                        now(), user_nickname, user_gender, user_job,
                        user_interest, user_birthDate);
            END LOOP;
    END
$$;
