-- Storage bucket and policies for news images
-- Execute this after creating the `is_admin_user` helper and `admin_users` table.

-- Create bucket if it does not exist
insert into
    storage.buckets (id, name, public)
select 'news-photos', 'news-photos', true
where
    not exists (
        select 1
        from storage.buckets
        where
            id = 'news-photos'
    );

-- Allow anyone to view news images (public bucket)
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Public read access for news photos'
    ) then
        create policy "Public read access for news photos"
            on storage.objects
            for select
            using (bucket_id = 'news-photos');
    end if;
end
$$;

-- Allow admin users to upload new news images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin insert news photos'
    ) then
        create policy "Admin insert news photos"
            on storage.objects
            for insert
            with check (
                bucket_id = 'news-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to update news images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin update news photos'
    ) then
        create policy "Admin update news photos"
            on storage.objects
            for update
            using (
                bucket_id = 'news-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            )
            with check (
                bucket_id = 'news-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;

-- Allow admin users to delete news images
do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Admin delete news photos'
    ) then
        create policy "Admin delete news photos"
            on storage.objects
            for delete
            using (
                bucket_id = 'news-photos'
                and is_admin_user(auth.jwt() ->> 'email')
            );
    end if;
end
$$;