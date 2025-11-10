-- Storage bucket and policies for supporters images
-- Execute this after creating the `is_admin_user` helper and `admin_users` table.

-- Create bucket if it does not exist
insert into
    storage.buckets (id, name, public)
select 'supporters-photos', 'supporters-photos', true
where
    not exists (
        select 1
        from storage.buckets
        where
            id = 'supporters-photos'
    );

-- Allow anyone to view supporters images (public bucket)
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Public read access for supporters photos'
    ) then
        create policy "Public read access for supporters photos"
            on storage.objects
            for select
            using (bucket_id = 'supporters-photos');
    end if;
end
$$;

-- Allow admin users to upload supporters images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin insert supporters photos'
    ) then
        create policy "Admin insert supporters photos"
            on storage.objects
            for insert
            with check (
                bucket_id = 'supporters-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to update supporters images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin update supporters photos'
    ) then
        create policy "Admin update supporters photos"
            on storage.objects
            for update
            using (
                bucket_id = 'supporters-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            )
            with check (
                bucket_id = 'supporters-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to delete supporters images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin delete supporters photos'
    ) then
        create policy "Admin delete supporters photos"
            on storage.objects
            for delete
            using (
                bucket_id = 'supporters-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

