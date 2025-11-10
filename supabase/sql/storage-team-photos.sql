-- Storage bucket and policies for team member images
-- Execute this after creating the `is_admin_user` helper and `admin_users` table.

-- Create bucket if it does not exist
insert into
    storage.buckets (id, name, public)
select 'team-photos', 'team-photos', true
where
    not exists (
        select 1
        from storage.buckets
        where
            id = 'team-photos'
    );

-- Allow anyone to view team images (public bucket)
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Public read access for team photos'
    ) then
        create policy "Public read access for team photos"
            on storage.objects
            for select
            using (bucket_id = 'team-photos');
    end if;
end
$$;

-- Allow admin users to upload team images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin insert team photos'
    ) then
        create policy "Admin insert team photos"
            on storage.objects
            for insert
            with check (
                bucket_id = 'team-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to update team images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin update team photos'
    ) then
        create policy "Admin update team photos"
            on storage.objects
            for update
            using (
                bucket_id = 'team-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            )
            with check (
                bucket_id = 'team-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to delete team images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin delete team photos'
    ) then
        create policy "Admin delete team photos"
            on storage.objects
            for delete
            using (
                bucket_id = 'team-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;