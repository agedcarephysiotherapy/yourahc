# Your AHC — Allied Health Care

Responsive static marketing website for Your AHC, providing person-centred allied health support for the NDIS community across Melbourne.

## Current site

- Mobile-first responsive design
- Participant, family and support-team focused messaging
- Physiotherapy, occupational therapy, speech pathology and exercise support
- Functional and NDIS support
- Referral pathway and enquiry form
- Accessible mobile navigation
- SEO metadata, Open Graph metadata, robots.txt and sitemap.xml
- Branded 404 page

## Before launch

1. Confirm the final enquiry email address used by the form.
2. Confirm services, practitioner disciplines, provider registration status and service areas.
3. Add final phone number, address and social links if required.
4. Confirm production hosting and `yourahc.com.au` DNS configuration.
5. Test the enquiry form on desktop and mobile devices.

## Important NDIS note

Do not publish a claim that Your AHC can service NDIA-managed participants unless the business has the appropriate NDIS provider registration for the relevant services. The website currently qualifies NDIA-managed availability accordingly.

## Form email notifications

After a form submission succeeds, the site calls the `yahc-form-notify` Supabase Edge Function (CRM project `tlbjzkjueszjnadakqsd`, source in `supabase/functions/yahc-form-notify`). It sends from `support@yourahc.com.au` via Brevo (or `contact@acphysio.com.au` via Resend, the fallback):

- an alert with the full submission to `ashutoshporwal@gmail.com` (change `NOTIFY_TO` to add recipients)
- a short confirmation to the submitter, if they entered an email

Email provider: **Brevo** if a Brevo key is configured, otherwise **Resend**. Keys are read from function secrets (`BREVO_API_KEY` / `RESEND_API_KEY`) or Supabase Vault (`brevo_api_key` / `resend_api_key`). To switch to Brevo, run in the CRM project's SQL editor:

```sql
select vault.create_secret('xkeysib-…your key…', 'brevo_api_key');
```

`yourahc.com.au` is authenticated in Brevo, so `support@yourahc.com.au` can send.
