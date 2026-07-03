-- 0002_seed_roles_permissions.sql
-- Idempotent RBAC seed for the platform roles and permissions.
-- This migration intentionally contains no users, user_roles, phone numbers, company documents, or personal data.

insert into public.roles (key, label)
values
  ('guest', '游客'),
  ('student', '学生'),
  ('enterprise', '企业'),
  ('teacher', '教师/机构'),
  ('admin', '管理员')
on conflict (key) do update
set label = excluded.label,
    updated_at = now();

insert into public.permissions (key, description)
values
  ('content:browse', 'Browse published public content.'),
  ('course:enroll', 'Enroll in courses.'),
  ('exam:register', 'Register for certification exams.'),
  ('job:apply', 'Apply for jobs and internships.'),
  ('contest:register', 'Register for contests.'),
  ('certificate:verify', 'Verify public certificate numbers through a controlled entry point.'),
  ('certificate:view', 'View own or authorized certificate details.'),
  ('job:publish', 'Publish and manage owned jobs.'),
  ('course:manage', 'Publish and manage owned courses.'),
  ('content:review', 'Review public content.'),
  ('user:review', 'Review users, enterprises, and institutions.'),
  ('submission:process', 'Process owned submissions and applications.'),
  ('certificate:manage', 'Issue, revoke, and manage certificates.')
on conflict (key) do update
set description = excluded.description,
    updated_at = now();

with desired(role_key, permission_key) as (
  values
    ('guest', 'content:browse'),
    ('guest', 'certificate:verify'),
    ('student', 'content:browse'),
    ('student', 'course:enroll'),
    ('student', 'exam:register'),
    ('student', 'job:apply'),
    ('student', 'contest:register'),
    ('student', 'certificate:verify'),
    ('student', 'certificate:view'),
    ('enterprise', 'content:browse'),
    ('enterprise', 'job:publish'),
    ('enterprise', 'certificate:verify'),
    ('enterprise', 'certificate:view'),
    ('enterprise', 'submission:process'),
    ('teacher', 'content:browse'),
    ('teacher', 'course:manage'),
    ('teacher', 'certificate:verify'),
    ('teacher', 'certificate:view'),
    ('teacher', 'submission:process'),
    ('admin', 'content:browse'),
    ('admin', 'course:enroll'),
    ('admin', 'exam:register'),
    ('admin', 'job:apply'),
    ('admin', 'contest:register'),
    ('admin', 'certificate:verify'),
    ('admin', 'certificate:view'),
    ('admin', 'job:publish'),
    ('admin', 'course:manage'),
    ('admin', 'content:review'),
    ('admin', 'user:review'),
    ('admin', 'submission:process'),
    ('admin', 'certificate:manage')
)
delete from public.role_permissions rp
where rp.role_key in ('guest', 'student', 'enterprise', 'teacher', 'admin')
  and not exists (
    select 1
    from desired
    where desired.role_key = rp.role_key
      and desired.permission_key = rp.permission_key
  );

insert into public.role_permissions (role_key, permission_key)
select role_key, permission_key
from (
  values
    ('guest', 'content:browse'),
    ('guest', 'certificate:verify'),
    ('student', 'content:browse'),
    ('student', 'course:enroll'),
    ('student', 'exam:register'),
    ('student', 'job:apply'),
    ('student', 'contest:register'),
    ('student', 'certificate:verify'),
    ('student', 'certificate:view'),
    ('enterprise', 'content:browse'),
    ('enterprise', 'job:publish'),
    ('enterprise', 'certificate:verify'),
    ('enterprise', 'certificate:view'),
    ('enterprise', 'submission:process'),
    ('teacher', 'content:browse'),
    ('teacher', 'course:manage'),
    ('teacher', 'certificate:verify'),
    ('teacher', 'certificate:view'),
    ('teacher', 'submission:process'),
    ('admin', 'content:browse'),
    ('admin', 'course:enroll'),
    ('admin', 'exam:register'),
    ('admin', 'job:apply'),
    ('admin', 'contest:register'),
    ('admin', 'certificate:verify'),
    ('admin', 'certificate:view'),
    ('admin', 'job:publish'),
    ('admin', 'course:manage'),
    ('admin', 'content:review'),
    ('admin', 'user:review'),
    ('admin', 'submission:process'),
    ('admin', 'certificate:manage')
) as desired(role_key, permission_key)
on conflict (role_key, permission_key) do nothing;
