-- Lets the yahc-form-notify Edge Function read its Resend API key from Vault.
-- Callable by service_role only; the key itself is stored with vault.create_secret(..., 'resend_api_key').
create or replace function public.get_form_notify_key()
returns text
language sql
security definer
set search_path = ''
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
$$;

revoke all on function public.get_form_notify_key() from public, anon, authenticated;
grant execute on function public.get_form_notify_key() to service_role;
