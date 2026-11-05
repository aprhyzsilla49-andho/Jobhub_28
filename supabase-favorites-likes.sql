create table if not exists public.candidate_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('job', 'company')),
  item_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_key)
);

alter table public.candidate_favorites enable row level security;
drop policy if exists "Users can read own candidate favorites" on public.candidate_favorites;
create policy "Users can read own candidate favorites"
  on public.candidate_favorites for select to authenticated
  using ((select auth.uid())::text = user_id::text);
drop policy if exists "Users can add own candidate favorites" on public.candidate_favorites;
create policy "Users can add own candidate favorites"
  on public.candidate_favorites for insert to authenticated
  with check ((select auth.uid())::text = user_id::text);
drop policy if exists "Users can remove own candidate favorites" on public.candidate_favorites;
create policy "Users can remove own candidate favorites"
  on public.candidate_favorites for delete to authenticated
  using ((select auth.uid())::text = user_id::text);
drop policy if exists "Users can update own candidate favorites" on public.candidate_favorites;
create policy "Users can update own candidate favorites"
  on public.candidate_favorites for update to authenticated
  using ((select auth.uid())::text = user_id::text)
  with check ((select auth.uid())::text = user_id::text);

grant select, insert, update, delete on public.candidate_favorites to authenticated;

create table if not exists public.candidate_profile_likes (
  candidate_post_id uuid not null references public.candidate_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (candidate_post_id, user_id)
);

alter table public.candidate_profile_likes enable row level security;
drop policy if exists "Anyone can read candidate profile likes" on public.candidate_profile_likes;
drop policy if exists "Users can read own candidate profile likes" on public.candidate_profile_likes;
create policy "Users can read own candidate profile likes"
  on public.candidate_profile_likes for select to authenticated
  using ((select auth.uid())::text = user_id::text);
drop policy if exists "Only own candidate profile likes are visible" on public.candidate_profile_likes;
create policy "Only own candidate profile likes are visible"
  on public.candidate_profile_likes as restrictive for select to anon, authenticated
  using ((select auth.uid())::text = user_id::text);
drop policy if exists "Users can like candidate profiles once" on public.candidate_profile_likes;
create policy "Users can like candidate profiles once"
  on public.candidate_profile_likes for insert to authenticated
  with check ((select auth.uid())::text = user_id::text);
drop policy if exists "Users can remove own candidate profile likes" on public.candidate_profile_likes;
create policy "Users can remove own candidate profile likes"
  on public.candidate_profile_likes for delete to authenticated
  using ((select auth.uid())::text = user_id::text);

revoke select on public.candidate_profile_likes from public, anon;
grant select on public.candidate_profile_likes to authenticated;
grant insert, delete on public.candidate_profile_likes to authenticated;

create or replace function public.get_candidate_profile_like_count(p_candidate_post_id uuid)
returns bigint
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select count(*)
  from public.candidate_profile_likes as likes
  where likes.candidate_post_id = p_candidate_post_id
    and exists (
      select 1
      from public.candidate_posts as posts
      where posts.id = p_candidate_post_id
        and posts.is_published = true
    );
$$;

revoke all on function public.get_candidate_profile_like_count(uuid) from public;
grant execute on function public.get_candidate_profile_like_count(uuid) to anon, authenticated;

alter table public.jobhub_applications
  add column if not exists viewed_at timestamptz;

alter table public.jobhub_applications enable row level security;
drop policy if exists "Candidates can create own applications" on public.jobhub_applications;
create policy "Candidates can create own applications"
  on public.jobhub_applications for insert to authenticated
  with check ((select auth.uid())::text = candidate_id::text);
drop policy if exists "Candidates can only apply to active jobs owned by company" on public.jobhub_applications;
create policy "Candidates can only apply to active jobs owned by company"
  on public.jobhub_applications as restrictive for insert to authenticated
  with check (
    exists (
      select 1
      from public.jobhub_jobs as job
      where job.id::text = jobhub_applications.job_id::text
        and job.company_id::text = jobhub_applications.company_id::text
        and job.status = 'active'
    )
  );
drop policy if exists "Candidates can read own applications" on public.jobhub_applications;
create policy "Candidates can read own applications"
  on public.jobhub_applications for select to authenticated
  using ((select auth.uid())::text = candidate_id::text);
drop policy if exists "HRD can access company applications" on public.jobhub_applications;
create policy "HRD can access company applications"
  on public.jobhub_applications for all to authenticated
  using (
    (select auth.jwt()->'app_metadata'->>'role') = 'hrd'
    and company_id::text = (select auth.jwt()->'app_metadata'->>'company_id')
  )
  with check (
    (select auth.jwt()->'app_metadata'->>'role') = 'hrd'
    and company_id::text = (select auth.jwt()->'app_metadata'->>'company_id')
  );

grant select, insert, update, delete on public.jobhub_applications to authenticated;
