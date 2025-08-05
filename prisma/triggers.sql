CREATE EXTENSION IF NOT EXISTS http;

CREATE OR REPLACE FUNCTION notify_email_change_selective()
RETURNS TRIGGER AS $$
DECLARE
    has_active_request BOOLEAN := false;
    local_user_id INTEGER;
BEGIN
    SELECT id INTO local_user_id
    FROM public.users
    WHERE email = NEW.email;

    IF local_user_id IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM public.email_change_requests
            WHERE user_id = local_user_id
            AND completed = false
            AND expires_at > NOW()
        ) INTO has_active_request;

        IF has_active_request AND (
            (OLD.new_email IS DISTINCT FROM NEW.new_email) OR
            (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
        ) THEN
            PERFORM net.http_post(
                url := 'https://lanzate.app/api/webhooks/supabase-auth',
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := jsonb_build_object(
                    'type', TG_OP,
                    'table', TG_TABLE_NAME,
                    'record', row_to_json(NEW),
                    'old_record', row_to_json(OLD),
                    'timestamp', NOW(),
                    'source', 'email_change_system',
                    'local_user_id', local_user_id
                )
            );
            RAISE NOTICE 'Email change webhook sent for user: %, has_active_request: %', NEW.email, has_active_request;
        END IF;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in email change webhook: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_change_system_webhook ON auth.users;

CREATE TRIGGER email_change_system_webhook
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION notify_email_change_selective();


































    CREATE EXTENSION IF NOT EXISTS http;

CREATE OR REPLACE FUNCTION notify_email_change_selective()
RETURNS TRIGGER AS $$
DECLARE
    has_active_request BOOLEAN := false;
    local_user_id INTEGER;
    should_notify BOOLEAN := false;
BEGIN
    SELECT id INTO local_user_id
    FROM public.users
    WHERE email = NEW.email;

    IF local_user_id IS NULL AND TG_OP = 'UPDATE' THEN
        SELECT id INTO local_user_id
        FROM public.users
        WHERE email = OLD.email;
    END IF;

    IF local_user_id IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM public.email_change_requests
            WHERE user_id = local_user_id
            AND completed = false
            AND expires_at > NOW()
        ) INTO has_active_request;

        IF has_active_request THEN
            IF TG_OP = 'INSERT' THEN
                should_notify := true;
            ELSIF TG_OP = 'UPDATE' THEN
                should_notify := (
                    (OLD.new_email IS DISTINCT FROM NEW.new_email) OR
                    (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) OR
                    (OLD.new_email_confirmed_at IS DISTINCT FROM NEW.new_email_confirmed_at) OR
                    (OLD.email_change_confirm_status IS DISTINCT FROM NEW.email_change_confirm_status) OR
                    (OLD.email IS DISTINCT FROM NEW.email)
                );
            END IF;

            IF should_notify THEN
                PERFORM net.http_post(
                    url := 'https://lanzate.app/api/webhooks/supabase-auth',
                    headers := '{"Content-Type": "application/json"}'::jsonb,
                    body := jsonb_build_object(
                        'type', TG_OP,
                        'table', TG_TABLE_NAME,
                        'record', row_to_json(NEW),
                        'old_record', row_to_json(OLD),
                        'timestamp', NOW(),
                        'source', 'email_change_system',
                        'local_user_id', local_user_id,
                        'changes_detected', jsonb_build_object(
                            'new_email_changed', (OLD.new_email IS DISTINCT FROM NEW.new_email),
                            'email_confirmed_at_changed', (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at),
                            'new_email_confirmed_at_changed', (OLD.new_email_confirmed_at IS DISTINCT FROM NEW.new_email_confirmed_at),
                            'email_change_confirm_status_changed', (OLD.email_change_confirm_status IS DISTINCT FROM NEW.email_change_confirm_status),
                            'email_changed', (OLD.email IS DISTINCT FROM NEW.email)
                        )
                    )
                );
                
                RAISE NOTICE 'Email change webhook sent for user: %, operation: %, changes: new_email=%, email_confirmed_at=%, confirm_status=%, email=%', 
                    NEW.email, 
                    TG_OP,
                    (OLD.new_email IS DISTINCT FROM NEW.new_email),
                    (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at),
                    (OLD.email_change_confirm_status IS DISTINCT FROM NEW.email_change_confirm_status),
                    (OLD.email IS DISTINCT FROM NEW.email);
            ELSE
                RAISE NOTICE 'No webhook sent for user: % - no relevant changes detected', NEW.email;
            END IF;
        ELSE
            RAISE NOTICE 'No webhook sent for user: % - no active email change request', NEW.email;
        END IF;
    ELSE
        RAISE NOTICE 'No webhook sent - local user not found for email: %', NEW.email;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in email change webhook: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_change_system_webhook ON auth.users;

CREATE TRIGGER email_change_system_webhook
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION notify_email_change_selective();