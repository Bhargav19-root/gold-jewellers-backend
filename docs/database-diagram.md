# Database Diagram — Gold Directory

---

## Location Hierarchy

```
┌─────────────┐
│  COUNTRIES  │
│─────────────│
│ id          │
│ name        │
│ code        │
└──────┬──────┘
       │ 1
       │ has many
       ▼ ∞
┌─────────────┐
│   STATES    │
│─────────────│
│ id          │
│ country_id ─┼──► COUNTRIES
│ name        │
│ slug        │
└──────┬──────┘
       │ 1
       │ has many
       ▼ ∞
┌─────────────┐
│   CITIES    │
│─────────────│
│ id          │
│ state_id ───┼──► STATES
│ name        │
│ slug        │
└──────┬──────┘
       │ 1
       │ has many
       ▼ ∞
┌─────────────┐
│    AREAS    │
│─────────────│
│ id          │
│ city_id ────┼──► CITIES
│ name        │
│ slug        │
└──────┬──────┘
       │ 1
       │ has many
       ▼ ∞
     STORES
```

---

## Core: Users & Stores

```
┌──────────┐          ┌────────────────────────────────────────────┐
│  USERS   │  1       │                  STORES                    │
│──────────│ owns ∞   │────────────────────────────────────────────│
│ id       ├─────────►│ id                                         │
│ full_name│          │ owner_id ──────────────────────────► USERS │
│ email    │          │ name, slug, branch_tag, store_type         │
│ mobile   │          │ description                                │
│ password │          │ country_id ──────────────────────► COUNTRIES│
│ role     │          │ state_id ────────────────────────► STATES  │
└────┬─────┘          │ city_id ─────────────────────────► CITIES  │
     │                │ area_id ─────────────────────────► AREAS   │
     │                │ full_address, pincode, landmark             │
     │                │ google_maps_url, lat, lng                  │
     │                │ store_phone, whatsapp, store_email          │
     │                │ website, instagram, facebook                │
     │                │ gst_number, gst_verified                   │
     │                │ created_at, updated_at                     │
     │                └────────────────────────────────────────────┘
     │
     │
```

---

## Store → Many-to-Many Relations

```
                   STORES
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────────┐
│STORE_CATEGORIES│ │STORE_SERVICES│ │STORE_CERTIFICATIONS│
│──────────────│ │──────────────│ │────────────────────│
│ store_id     │ │ store_id     │ │ id                 │
│ category_id  │ │ service_id   │ │ store_id           │
└──────┬───────┘ └──────┬───────┘ │ certification_id   │
       │                │         │ licence_number      │
       ▼                ▼         │ verification_status │
┌──────────────┐ ┌──────────────┐ └──────────┬─────────┘
│  CATEGORIES  │ │   SERVICES   │            │
│──────────────│ │──────────────│            ▼
│ id           │ │ id           │ ┌──────────────────┐
│ name         │ │ name         │ │  CERTIFICATIONS  │
│ slug         │ │ slug         │ │──────────────────│
│ display_order│ └──────────────┘ │ id               │
└──────────────┘                  │ name             │
                                  │ logo_url         │
                                  └──────────────────┘
```

---

## Store → One-to-Many Relations

```
                   STORES
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
┌────────────────┐ ┌──────────────┐ ┌──────────────┐
│ BUSINESS_HOURS │ │STORE_HOLIDAYS│ │ STORE_PHOTOS │
│────────────────│ │──────────────│ │──────────────│
│ id             │ │ id           │ │ id           │
│ store_id       │ │ store_id     │ │ store_id     │
│ day_of_week    │ │ date         │ │ url          │
│ is_open        │ │ reason       │ │ type         │
│ open_time      │ └──────────────┘ │ (cover/logo/ │
│ close_time     │                  │  gallery)    │
│ break_start    │                  │ display_order│
│ break_end      │                  └──────────────┘
└────────────────┘
```

---

## Reviews

```
┌──────────┐                        ┌────────────┐
│  USERS   │                        │   STORES   │
└────┬─────┘                        └─────┬──────┘
     │ 1                                  │ 1
     │ writes many                        │ receives many
     └──────────────┐   ┌─────────────────┘
                    ▼   ▼
              ┌─────────────────────┐
              │       REVIEWS       │
              │─────────────────────│
              │ id                  │
              │ user_id ───► USERS  │
              │ store_id ──► STORES │
              │ reviewer_name       │
              │ rating (1–5)        │
              │ text                │
              │ tags [ ]            │
              │ is_verified         │
              │ created_at          │
              └──────────┬──────────┘
                         │ 1
                         │ has many
                         ▼ ∞
                ┌─────────────────┐
                │  REVIEW_PHOTOS  │
                │─────────────────│
                │ id              │
                │ review_id       │
                │ url             │
                └─────────────────┘
```

---

## Full Relationship Summary

```
COUNTRIES ──(1:∞)──► STATES ──(1:∞)──► CITIES ──(1:∞)──► AREAS ──(1:∞)──► STORES
                                                                               │
USERS ──────────────────────────────────────────────────────(1:∞)────────────►│
                                                                               │
                           ┌───────────────────────────────────────────────────┤
                           │                                                   │
              (∞:∞) via junction                                        (1:∞) direct
                           │                                                   │
           ┌───────────────┼──────────────┐          ┌────────────────────────┼──────────┐
           ▼               ▼              ▼           ▼                        ▼          ▼
       CATEGORIES       SERVICES   CERTIFICATIONS  BUSINESS_HOURS      STORE_HOLIDAYS  STORE_PHOTOS


USERS ──(1:∞)──► REVIEWS ──(1:∞)──► REVIEW_PHOTOS
STORES ──(1:∞)──► REVIEWS
```
