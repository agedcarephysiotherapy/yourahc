-- Generalise the Vault lookup so yahc-form-notify can read either provider key.
-- Only the two named secrets are readable, and only by service_role.
-- The old public.get_form_notify_key() (service_role only) is superseded and can be dropped.

create or replace function public.get_form_notify_secret(secret_name text)
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets
  where name = secret_name and secret_name in ('brevo_api_key', 'resend_api_key')
  limit 1;
$$;

revoke all on function public.get_form_notify_secret(text) from public, anon, authenticated;
grant execute on function public.get_form_notify_secret(text) to service_role;
