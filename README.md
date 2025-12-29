# BrandKiller

A modern search engine to find generic equivalents of brand name products and compare prices.

## Features

- Clean, Google-like search interface
- Real-time search with Supabase database
- Display generic equivalents with price comparisons
- Modern UI built with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your Supabase credentials:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase project URL and anon key

3. Set up your Supabase database:
   - Create a table named `products` with the following columns:
     - `id` (uuid, primary key)
     - `brand_name` (text)
     - `generic_name` (text)
     - `brand_price` (numeric)
     - `generic_price` (numeric)
     - `buy_link` (text, optional)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

Your Supabase `products` table should have these columns:
- `id`: UUID (primary key)
- `brand_name`: Text (the brand name to search for)
- `generic_name`: Text (the generic equivalent name)
- `brand_price`: Numeric (price of the brand product)
- `generic_price`: Numeric (price of the generic product)
- `buy_link`: Text (optional, URL to purchase the generic product)

