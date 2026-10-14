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

After a form submission succeeds, the site calls the `yahc-form-notify` Supabase Edge Function in the same project that stores submissions (`yrevkjrichztuceguhaq`). Source: `supabase/functions/yahc-form-notify/index.ts`. It sends:

- an alert with the full submission to `ashutoshporwal@gmail.com` (change `NOTIFY_TO` to add recipients)
- a short confirmation to the submitter, if they entered an email

Email goes through Brevo from `support@yourahc.com.au`, using the `BREVO_API_KEY` Edge Function secret. JWT verification is off for this function, as for the other public form endpoints. Brevo's "Authorised IPs" restriction must stay off, because Supabase has no fixed outbound IP.
