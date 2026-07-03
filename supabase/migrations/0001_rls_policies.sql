-- 0001_rls_policies.sql
-- Reviewable RLS baseline for the Silk Road e-commerce talent platform.
-- Do not apply to a remote project until the total-control and quality threads approve it.
-- No secrets, URLs, service role keys, database passwords, or real user data belong in this file.

create or replace function public.current_user_role_keys()
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select ur.role_key
  from public.user_roles ur
  join public.users u on u.id = ur.user_id
  where ur.user_id = auth.uid()
    and u.status = 'active'
    and (ur.expires_at is null or ur.expires_at > now())
$$;

create or replace function public.has_permission(required_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.users u on u.id = ur.user_id
    join public.role_permissions rp on rp.role_key = ur.role_key
    where ur.user_id = auth.uid()
      and u.status = 'active'
      and (ur.expires_at is null or ur.expires_at > now())
      and rp.permission_key = required_permission
  )
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.users u on u.id = ur.user_id
    where ur.user_id = auth.uid()
      and u.status = 'active'
      and (ur.expires_at is null or ur.expires_at > now())
      and ur.role_key = 'admin'
  )
  or public.has_permission('user:review')
  or public.has_permission('certificate:manage')
$$;

-- Limited certificate-number verification helper. It intentionally returns no holder identity.
-- Public guest verification should still enter through a rate-limited Server Function first.
create or replace function public.verify_certificate_public(requested_certificate_no text)
returns table (
  valid boolean,
  status text,
  certificate_no text,
  issued_at timestamp with time zone,
  certification_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (c.id is not null and c.status = 'active') as valid,
    coalesce(c.status, 'not_found') as status,
    requested_certificate_no as certificate_no,
    c.issued_at,
    c.certification_id
  from (select 1) marker
  left join public.certificates c on c.certificate_no = requested_certificate_no
$$;

revoke all on function public.current_user_role_keys() from public;
revoke all on function public.has_permission(text) from public;
revoke all on function public.is_admin() from public;
revoke all on function public.verify_certificate_public(text) from public;

grant execute on function public.current_user_role_keys() to authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.verify_certificate_public(text) to authenticated;

alter table public.audit_logs enable row level security;
alter table public.certificate_verification_logs enable row level security;
alter table public.certificates enable row level security;
alter table public.certification_translations enable row level security;
alter table public.certifications enable row level security;
alter table public.contest_registrations enable row level security;
alter table public.contest_translations enable row level security;
alter table public.contests enable row level security;
alter table public.course_translations enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.enterprise_profiles enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.job_applications enable row level security;
alter table public.job_translations enable row level security;
alter table public.jobs enable row level security;
alter table public.news enable row level security;
alter table public.news_translations enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.roles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.users enable row level security;

grant usage on schema public to anon, authenticated;

grant select on
  public.certification_translations,
  public.certifications,
  public.contest_translations,
  public.contests,
  public.course_translations,
  public.courses,
  public.exam_sessions,
  public.job_translations,
  public.jobs,
  public.news,
  public.news_translations
to anon, authenticated;

grant select on
  public.audit_logs,
  public.certificate_verification_logs,
  public.certificates,
  public.contest_registrations,
  public.enrollments,
  public.enterprise_profiles,
  public.job_applications,
  public.permissions,
  public.role_permissions,
  public.roles,
  public.student_profiles,
  public.teacher_profiles,
  public.user_roles,
  public.users
to authenticated;

grant insert on
  public.certificate_verification_logs,
  public.contest_registrations,
  public.enrollments,
  public.job_applications
to authenticated;

grant update (status, updated_at) on public.contest_registrations to authenticated;
grant update (status, updated_at) on public.enrollments to authenticated;
grant update (status, updated_at) on public.job_applications to authenticated;

-- Admin direct writes are policy-gated. Most production writes should still go through Server Functions.
grant insert, update, delete on
  public.audit_logs,
  public.certificates,
  public.certification_translations,
  public.certifications,
  public.contest_translations,
  public.contests,
  public.course_translations,
  public.courses,
  public.enterprise_profiles,
  public.exam_sessions,
  public.job_translations,
  public.jobs,
  public.news,
  public.news_translations,
  public.permissions,
  public.role_permissions,
  public.roles,
  public.student_profiles,
  public.teacher_profiles,
  public.user_roles,
  public.users
to authenticated;

revoke all on
  public.audit_logs,
  public.certificate_verification_logs,
  public.certificates,
  public.contest_registrations,
  public.enrollments,
  public.enterprise_profiles,
  public.job_applications,
  public.permissions,
  public.role_permissions,
  public.roles,
  public.student_profiles,
  public.teacher_profiles,
  public.user_roles,
  public.users
from anon;

create policy "roles_select_authenticated"
on public.roles
for select
to authenticated
using (true);

create policy "roles_admin_all"
on public.roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "permissions_select_authenticated"
on public.permissions
for select
to authenticated
using (true);

create policy "permissions_admin_all"
on public.permissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "role_permissions_select_authenticated"
on public.role_permissions
for select
to authenticated
using (true);

create policy "role_permissions_admin_all"
on public.role_permissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users_select_own"
on public.users
for select
to authenticated
using (id = auth.uid());

create policy "users_admin_all"
on public.users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "user_roles_select_own"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid());

create policy "user_roles_admin_all"
on public.user_roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Profile self-update is intentionally closed until Server Functions protect review fields.
create policy "student_profiles_select_own"
on public.student_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "student_profiles_admin_all"
on public.student_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "enterprise_profiles_select_own"
on public.enterprise_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "enterprise_profiles_admin_all"
on public.enterprise_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_profiles_select_own"
on public.teacher_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "teacher_profiles_admin_all"
on public.teacher_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "courses_select_published"
on public.courses
for select
to anon, authenticated
using (status = 'published');

create policy "courses_select_owner_or_admin"
on public.courses
for select
to authenticated
using (owner_user_id = auth.uid() or public.is_admin());

create policy "courses_owner_manage"
on public.courses
for all
to authenticated
using (owner_user_id = auth.uid() and public.has_permission('course:manage'))
with check (owner_user_id = auth.uid() and public.has_permission('course:manage'));

create policy "courses_admin_all"
on public.courses
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "course_translations_select_published"
on public.course_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = course_translations.course_id
      and c.status = 'published'
  )
);

create policy "course_translations_owner_manage"
on public.course_translations
for all
to authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = course_translations.course_id
      and c.owner_user_id = auth.uid()
      and public.has_permission('course:manage')
  )
)
with check (
  exists (
    select 1
    from public.courses c
    where c.id = course_translations.course_id
      and c.owner_user_id = auth.uid()
      and public.has_permission('course:manage')
  )
);

create policy "course_translations_admin_all"
on public.course_translations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "jobs_select_published"
on public.jobs
for select
to anon, authenticated
using (status = 'published');

create policy "jobs_select_owner_or_admin"
on public.jobs
for select
to authenticated
using (enterprise_user_id = auth.uid() or public.is_admin());

create policy "jobs_enterprise_manage"
on public.jobs
for all
to authenticated
using (enterprise_user_id = auth.uid() and public.has_permission('job:publish'))
with check (enterprise_user_id = auth.uid() and public.has_permission('job:publish'));

create policy "jobs_admin_all"
on public.jobs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "job_translations_select_published"
on public.job_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.jobs j
    where j.id = job_translations.job_id
      and j.status = 'published'
  )
);

create policy "job_translations_enterprise_manage"
on public.job_translations
for all
to authenticated
using (
  exists (
    select 1
    from public.jobs j
    where j.id = job_translations.job_id
      and j.enterprise_user_id = auth.uid()
      and public.has_permission('job:publish')
  )
)
with check (
  exists (
    select 1
    from public.jobs j
    where j.id = job_translations.job_id
      and j.enterprise_user_id = auth.uid()
      and public.has_permission('job:publish')
  )
);

create policy "job_translations_admin_all"
on public.job_translations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "certifications_select_published"
on public.certifications
for select
to anon, authenticated
using (status = 'published');

create policy "certifications_admin_all"
on public.certifications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "certification_translations_select_published"
on public.certification_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.certifications c
    where c.id = certification_translations.certification_id
      and c.status = 'published'
  )
);

create policy "certification_translations_admin_all"
on public.certification_translations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "exam_sessions_select_public"
on public.exam_sessions
for select
to anon, authenticated
using (
  status = 'scheduled'
  and exists (
    select 1
    from public.certifications c
    where c.id = exam_sessions.certification_id
      and c.status = 'published'
  )
);

create policy "exam_sessions_admin_all"
on public.exam_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "contests_select_published"
on public.contests
for select
to anon, authenticated
using (status = 'published');

create policy "contests_admin_all"
on public.contests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "contest_translations_select_published"
on public.contest_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.contests c
    where c.id = contest_translations.contest_id
      and c.status = 'published'
  )
);

create policy "contest_translations_admin_all"
on public.contest_translations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "news_select_published"
on public.news
for select
to anon, authenticated
using (status = 'published' and (published_at is null or published_at <= now()));

create policy "news_admin_all"
on public.news
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "news_translations_select_published"
on public.news_translations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.news n
    where n.id = news_translations.news_id
      and n.status = 'published'
      and (n.published_at is null or n.published_at <= now())
  )
);

create policy "news_translations_admin_all"
on public.news_translations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "enrollments_select_own"
on public.enrollments
for select
to authenticated
using (user_id = auth.uid() and public.has_permission('course:enroll'));

create policy "enrollments_insert_own"
on public.enrollments
for insert
to authenticated
with check (user_id = auth.uid() and public.has_permission('course:enroll'));

create policy "enrollments_course_owner_process"
on public.enrollments
for update
to authenticated
using (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.owner_user_id = auth.uid()
  )
)
with check (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.owner_user_id = auth.uid()
  )
);

create policy "enrollments_course_owner_select"
on public.enrollments
for select
to authenticated
using (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.courses c
    where c.id = enrollments.course_id
      and c.owner_user_id = auth.uid()
  )
);

create policy "enrollments_admin_all"
on public.enrollments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "job_applications_select_own"
on public.job_applications
for select
to authenticated
using (user_id = auth.uid() and public.has_permission('job:apply'));

create policy "job_applications_insert_own"
on public.job_applications
for insert
to authenticated
with check (user_id = auth.uid() and public.has_permission('job:apply'));

create policy "job_applications_enterprise_process"
on public.job_applications
for update
to authenticated
using (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.jobs j
    where j.id = job_applications.job_id
      and j.enterprise_user_id = auth.uid()
  )
)
with check (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.jobs j
    where j.id = job_applications.job_id
      and j.enterprise_user_id = auth.uid()
  )
);

create policy "job_applications_enterprise_select"
on public.job_applications
for select
to authenticated
using (
  public.has_permission('submission:process')
  and exists (
    select 1
    from public.jobs j
    where j.id = job_applications.job_id
      and j.enterprise_user_id = auth.uid()
  )
);

create policy "job_applications_admin_all"
on public.job_applications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "contest_registrations_select_own"
on public.contest_registrations
for select
to authenticated
using (user_id = auth.uid() and public.has_permission('contest:register'));

create policy "contest_registrations_insert_own"
on public.contest_registrations
for insert
to authenticated
with check (user_id = auth.uid() and public.has_permission('contest:register'));

create policy "contest_registrations_admin_all"
on public.contest_registrations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "certificates_select_holder"
on public.certificates
for select
to authenticated
using (holder_user_id = auth.uid() and public.has_permission('certificate:view'));

create policy "certificates_admin_all"
on public.certificates
for all
to authenticated
using (public.is_admin() or public.has_permission('certificate:manage'))
with check (public.is_admin() or public.has_permission('certificate:manage'));

create policy "certificate_verification_logs_select_own"
on public.certificate_verification_logs
for select
to authenticated
using (viewer_user_id = auth.uid());

create policy "certificate_verification_logs_insert_authenticated"
on public.certificate_verification_logs
for insert
to authenticated
with check (viewer_user_id = auth.uid() and public.has_permission('certificate:verify'));

create policy "certificate_verification_logs_admin_all"
on public.certificate_verification_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "audit_logs_admin_all"
on public.audit_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- The Supabase service_role bypasses RLS and is reserved for migrations and trusted backend jobs.
-- Ordinary request paths must use anon/authenticated plus Server Function checks, not a service key.
