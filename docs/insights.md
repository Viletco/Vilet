# Vilét Insights

Vilét Insights is a protected, tenant-scoped GA4 reporting workspace. The first release reads aggregate website performance for the last 30 complete days and presents active users, sessions, views, key events, engagement, average session duration, page performance, and acquisition channels.

## Security and privacy

- The Google service-account JSON is a server-only Vercel variable. It is never stored in Supabase, rendered into HTML, or prefixed with `NEXT_PUBLIC_`.
- The GA4 property ID is allowlisted by the deployment environment.
- Sources, synchronization runs, and metrics carry `organization_id`, use RLS, and validate source ownership with a tenant trigger.
- Only owners/admins with `insights.analytics` may connect or synchronize. Members with `insights.access` may read the dashboard.
- The public measurement tag loads only after explicit analytics consent. Advertising personalization and Google Signals are disabled in the tag configuration.

## Staging activation

1. Apply `supabase/migrations/202608260010_insights_foundation.sql` to staging project `lzohhfmfdqivnjqqwmqu`.
2. Create a GA4 web data stream for `https://vilet.co` and note its `G-...` measurement ID.
3. Create a Google Cloud service account, enable the Google Analytics Data API, and grant its email **Viewer** access to the GA4 property.
4. In the marketing Preview environment set `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
5. In the platform Preview environment set `GOOGLE_ANALYTICS_PROPERTY_ID` and the sensitive `GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON`.
6. Redeploy both Preview applications.
7. In `/o/vilet/insights`, connect the approved numeric property ID and run the first synchronization.

Production remains unchanged until consent behavior, measurement collection, synchronization, RLS, and the rendered dashboard have been manually approved in Preview.
