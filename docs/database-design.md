# Database Design — Gold Directory

**Stack:** PostgreSQL · Drizzle ORM · Redis (caching + OTP)

---

## Entity Overview

```
countries
  └── states
        └── cities
              └── areas
                    └── stores (one area → many stores)

users
  └── stores (one user → many stores)
        ├── store_categories   → categories
        ├── store_services     → services
        ├── store_certifications → certifications
        ├── business_hours
        ├── store_holidays
        └── store_photos

users
  └── reviews (one user → many reviews)
        └── review_photos
```

---

## Tables

### `countries`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `varchar(100)` | NOT NULL, UNIQUE |
| `code` | `varchar(5)` | NOT NULL, UNIQUE — e.g. `IN` |

---

### `states`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `country_id` | `uuid` | NOT NULL, FK → `countries.id` |
| `name` | `varchar(100)` | NOT NULL |
| `slug` | `varchar(120)` | NOT NULL, UNIQUE — e.g. `gujarat` |

---

### `cities`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `state_id` | `uuid` | NOT NULL, FK → `states.id` |
| `name` | `varchar(100)` | NOT NULL |
| `slug` | `varchar(120)` | NOT NULL, UNIQUE — e.g. `surat` |

---

### `areas`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `city_id` | `uuid` | NOT NULL, FK → `cities.id` |
| `name` | `varchar(100)` | NOT NULL |
| `slug` | `varchar(120)` | NOT NULL — e.g. `adajan` |

**Unique constraint:** `(city_id, slug)`

---

### `users`

Accounts for jeweller owners/managers. Also used for future buyer accounts.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `full_name` | `varchar(255)` | NOT NULL | Internal only, not public |
| `email` | `varchar(255)` | NOT NULL, UNIQUE | Login + billing |
| `mobile` | `varchar(15)` | NOT NULL, UNIQUE | OTP login + alerts |
| `mobile_verified` | `boolean` | NOT NULL, default `false` | Set true after OTP confirmed |
| `password_hash` | `text` | NOT NULL | bcrypt |
| `designation` | `varchar(50)` | nullable | Owner / Manager / Salesperson / Other |
| `role` | `varchar(20)` | NOT NULL, default `'jeweller'` | `jeweller` \| `buyer` \| `admin` |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

---

### `stores`

One store = one physical location / listing page.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `owner_id` | `uuid` | NOT NULL, FK → `users.id` | |
| `name` | `varchar(255)` | NOT NULL | Displayed exactly as entered |
| `slug` | `varchar(300)` | NOT NULL, UNIQUE | Auto-generated: `{name}-{area}-{city}` → URL-safe |
| `branch_tag` | `varchar(100)` | nullable | e.g. Mahidharpura, Adajan — shown under store name |
| `store_type` | `varchar(50)` | NOT NULL | `Retail` \| `Wholesale` \| `Manufacturer` \| `Online` \| `Both` |
| `description` | `text` | nullable | 50–500 chars, shown on listing |
| `country_id` | `uuid` | NOT NULL, FK → `countries.id` | |
| `state_id` | `uuid` | NOT NULL, FK → `states.id` | |
| `city_id` | `uuid` | NOT NULL, FK → `cities.id` | |
| `area_id` | `uuid` | NOT NULL, FK → `areas.id` | |
| `full_address` | `text` | NOT NULL | |
| `pincode` | `varchar(10)` | NOT NULL | |
| `landmark` | `varchar(255)` | nullable | |
| `google_maps_url` | `text` | nullable | |
| `latitude` | `decimal(10,7)` | nullable | For map pin |
| `longitude` | `decimal(10,7)` | nullable | For map pin |
| `store_phone` | `varchar(20)` | NOT NULL | Verified via test call before approval |
| `whatsapp` | `varchar(20)` | nullable | Enables WhatsApp button on listing |
| `store_email` | `varchar(255)` | nullable | |
| `website` | `text` | nullable | |
| `instagram` | `varchar(100)` | nullable | Handle, e.g. `@anopchand1947` |
| `facebook` | `text` | nullable | Full URL |
| `gst_number` | `varchar(20)` | nullable | |
| `gst_verified` | `boolean` | NOT NULL, default `false` | |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

---

### `categories`

Seed data — not user-created.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `varchar(100)` | NOT NULL, UNIQUE | e.g. Bridal, Diamond, Mangalsutra |
| `slug` | `varchar(120)` | NOT NULL, UNIQUE | e.g. `bridal-jewellery` — used in SEO URLs |
| `display_order` | `integer` | NOT NULL, default `0` | Controls ordering on UI |

**Seed values:**
Bridal, Gold Chains, Gold Bangles, Mangalsutra, Diamond, Antique, Kundan & Polki, Gold Coins, Silver, Earrings

---

### `store_categories` _(junction)_

| Column | Type | Constraints |
|---|---|---|
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE |
| `category_id` | `uuid` | NOT NULL, FK → `categories.id` |

**Primary key:** `(store_id, category_id)`

---

### `services`

Seed data — not user-created.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `varchar(100)` | NOT NULL, UNIQUE |
| `slug` | `varchar(120)` | NOT NULL, UNIQUE |

**Seed values:**
Gold Exchange, Custom Design, Jewellery Repair, Hallmark Certification, EMI Available, Gold Loan, Home Delivery

---

### `store_services` _(junction)_

| Column | Type | Constraints |
|---|---|---|
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE |
| `service_id` | `uuid` | NOT NULL, FK → `services.id` |

**Primary key:** `(store_id, service_id)`

---

### `certifications`

Seed data — types of certifications a store can hold.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `varchar(100)` | NOT NULL, UNIQUE |
| `logo_url` | `text` | nullable |

**Seed values:** BIS, SGL, GIA, IGI, ISO

---

### `store_certifications`

Links a store to a certification and stores its licence details.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE | |
| `certification_id` | `uuid` | NOT NULL, FK → `certifications.id` | |
| `licence_number` | `varchar(100)` | nullable | e.g. `HM/123/SU/2018` |
| `verification_status` | `varchar(20)` | NOT NULL, default `'pending'` | `pending` \| `verified` \| `failed` |
| `verified_at` | `timestamp` | nullable | Set when status → verified |

---

### `business_hours`

One row per day per store. 7 rows inserted on store creation with defaults.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE | |
| `day_of_week` | `integer` | NOT NULL | 0 = Monday … 6 = Sunday |
| `is_open` | `boolean` | NOT NULL, default `true` | false = shown as "Closed" |
| `open_time` | `time` | nullable | e.g. `10:00` |
| `close_time` | `time` | nullable | e.g. `19:00` |
| `break_start` | `time` | nullable | Lunch break start |
| `break_end` | `time` | nullable | Lunch break end |

**Unique constraint:** `(store_id, day_of_week)`

---

### `store_holidays`

Ad-hoc holidays on specific dates (festivals, shutdowns).

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE |
| `date` | `date` | NOT NULL |
| `reason` | `varchar(255)` | nullable |

---

### `store_photos`

All media for a store — cover, logo, and gallery images.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE | |
| `url` | `text` | NOT NULL | CDN URL (Cloudinary / S3) |
| `type` | `varchar(20)` | NOT NULL | `cover` \| `logo` \| `gallery` |
| `display_order` | `integer` | NOT NULL, default `0` | Controls gallery sort order |
| `uploaded_at` | `timestamp` | NOT NULL, default `now()` | |

---

### `reviews`

Customer reviews for a store.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `store_id` | `uuid` | NOT NULL, FK → `stores.id` ON DELETE CASCADE | |
| `user_id` | `uuid` | nullable, FK → `users.id` ON DELETE SET NULL | null = guest review |
| `reviewer_name` | `varchar(255)` | NOT NULL | Display name |
| `rating` | `integer` | NOT NULL | CHECK `rating BETWEEN 1 AND 5` |
| `text` | `text` | nullable | |
| `tags` | `text[]` | NOT NULL, default `'{}'` | e.g. `{Design, Comfort, Craftsmanship, Pricing}` |
| `is_verified` | `boolean` | NOT NULL, default `false` | Verified purchase / visit |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |

---

### `review_photos`

Photos attached by customer to a review.

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `review_id` | `uuid` | NOT NULL, FK → `reviews.id` ON DELETE CASCADE |
| `url` | `text` | NOT NULL |

---

## Indexes

```sql
-- Store lookups (primary query pattern)
CREATE INDEX idx_stores_city        ON stores (city);
CREATE INDEX idx_stores_state       ON stores (state);
CREATE INDEX idx_stores_area        ON stores (area);
CREATE INDEX idx_stores_status      ON stores (listing_status, is_active);
CREATE INDEX idx_stores_owner       ON stores (owner_id);

-- Category filtering
CREATE INDEX idx_store_categories_category ON store_categories (category_id);

-- Review lookups
CREATE INDEX idx_reviews_store      ON reviews (store_id);

-- Full-text search on store name + description
CREATE INDEX idx_stores_fts ON stores USING GIN (
  to_tsvector('english', name || ' ' || coalesce(description, ''))
);
```

---

## Redis Caching Strategy

| Key Pattern | Value | TTL | Invalidate on |
|---|---|---|---|
| `otp:{mobile}` | `{hash, attempts}` JSON | **5 min** | OTP verified or max attempts |
| `store:{slug}` | Full store JSON (with photos, hours, certs) | **1 hour** | Store updated |
| `stores:listing:{city}:{category?}:{page}` | Array of store summary objects | **30 min** | Any store in city updated |
| `categories:all` | Full categories list | **24 hours** | Admin updates category |
| `cities:all` | Cities with jeweller counts | **6 hours** | New store approved |
| `session:{token}` | `user_id` | **7 days** (rolling) | Logout |

> **OTP flow:** Store OTP hash (not plaintext) in Redis with `SET otp:{mobile} {hash} EX 300`. On verify: compare hash, then `DEL` the key. No OTP table needed in PostgreSQL.

---

## Drizzle Schema File Structure (suggested)

```
src/db/
├── schema/
│   ├── users.ts
│   ├── stores.ts
│   ├── categories.ts
│   ├── services.ts
│   ├── certifications.ts
│   ├── business-hours.ts
│   ├── reviews.ts
│   └── index.ts        ← re-exports all tables
├── index.ts            ← drizzle(pool) instance
└── seed.ts             ← seeds categories, services, certifications
```

---

## Relationships Summary

```
users           ←─ one-to-many ─→ stores
stores          ←─ many-to-many ─→ categories        (via store_categories)
stores          ←─ many-to-many ─→ services           (via store_services)
stores          ←─ many-to-many ─→ certifications     (via store_certifications)
stores          ←─ one-to-many ─→ business_hours
stores          ←─ one-to-many ─→ store_holidays
stores          ←─ one-to-many ─→ store_photos
stores          ←─ one-to-many ─→ reviews
reviews         ←─ one-to-many ─→ review_photos
users           ←─ one-to-many ─→ reviews
```
