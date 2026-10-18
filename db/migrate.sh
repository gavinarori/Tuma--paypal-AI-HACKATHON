#!/bin/sh
# Applies all migrations in order. Usage: DATABASE_URL=... sh db/migrate.sh
set -e
for f in db/schema.sql db/002_recipients.sql db/003_paypal_payouts.sql db/004_receipts.sql; do
  echo "Applying $f"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done
echo "Done. Now set the demo recipient's PayPal email:"
echo "  UPDATE recipients SET paypal_email='<sandbox personal email>' WHERE lower(name)='mama';"
