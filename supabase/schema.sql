create extension if not exists "pgcrypto";

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null check (position('@' in email) > 1),
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists waitlist_signups_email_unique_idx on public.waitlist_signups (lower(email));
create index if not exists waitlist_signups_created_at_idx on public.waitlist_signups (created_at desc);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  author_name text not null check (char_length(author_name) between 2 and 40),
  rating int not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 10 and 280),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.review_votes (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (review_id, user_id)
);

alter table public.reviews
add column if not exists updated_at timestamptz not null default timezone('utc', now());

create unique index if not exists reviews_user_id_unique_idx on public.reviews (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();

alter table public.reviews enable row level security;
alter table public.review_votes enable row level security;
alter table public.waitlist_signups enable row level security;

drop policy if exists "anyone can join the waitlist" on public.waitlist_signups;
create policy "anyone can join the waitlist"
on public.waitlist_signups
for insert
to public
with check (true);

drop policy if exists "reviews are viewable by everyone" on public.reviews;
create policy "reviews are viewable by everyone"
on public.reviews
for select
to public
using (true);

drop policy if exists "authenticated users can insert their reviews" on public.reviews;
create policy "authenticated users can insert their reviews"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can delete own reviews" on public.reviews;
create policy "users can delete own reviews"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can update own reviews" on public.reviews;
create policy "users can update own reviews"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "review votes are viewable by everyone" on public.review_votes;
create policy "review votes are viewable by everyone"
on public.review_votes
for select
to public
using (true);

drop policy if exists "authenticated users can insert their votes" on public.review_votes;
create policy "authenticated users can insert their votes"
on public.review_votes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can delete own votes" on public.review_votes;
create policy "users can delete own votes"
on public.review_votes
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_user_id_idx on public.reviews (user_id);
create index if not exists review_votes_user_id_idx on public.review_votes (user_id);
