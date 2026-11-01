-- Migrasi 002: Pembersihan Duplikasi Mata Kuliah di Database Supabase
-- Menyatukan relasi (jadwal, perubahan jadwal, materi, tugas) ke entri mata kuliah kanonis (yang paling awal dibuat),
-- kemudian menghapus baris duplikatnya secara aman.

do $$
declare
  dup record;
  canonical_id uuid;
  cnt_schedules int := 0;
  cnt_changes int := 0;
  cnt_materials int := 0;
  cnt_tasks int := 0;
  cnt_deleted int := 0;
begin
  raise notice 'Memulai pembersihan duplikasi mata kuliah...';

  -- Loop untuk setiap baris mata kuliah yang memiliki duplikat (yang bukan baris paling awal)
  for dup in (
    select c.id, c.name, c.created_at
    from public.courses c
    where exists (
      select 1 from public.courses c2
      where lower(trim(c2.name)) = lower(trim(c.name))
        and (c2.created_at < c.created_at or (c2.created_at = c.created_at and c2.id < c.id))
    )
    order by c.created_at desc
  ) loop
    -- Cari ID kanonis (baris mata kuliah yang paling awal dibuat dengan nama yang sama)
    select id into canonical_id
    from public.courses
    where lower(trim(name)) = lower(trim(dup.name))
    order by created_at asc, id asc
    limit 1;

    -- Pindahkan relasi schedules ke canonical_id
    update public.schedules
    set course_id = canonical_id
    where course_id = dup.id;
    get diagnostics cnt_schedules = row_count;

    -- Pindahkan relasi schedule_changes ke canonical_id
    update public.schedule_changes
    set course_id = canonical_id
    where course_id = dup.id;
    get diagnostics cnt_changes = row_count;

    -- Pindahkan relasi materials ke canonical_id
    update public.materials
    set course_id = canonical_id
    where course_id = dup.id;
    get diagnostics cnt_materials = row_count;

    -- Pindahkan relasi announcements ke canonical_id
    update public.announcements
    set course_id = canonical_id
    where course_id = dup.id;
    get diagnostics cnt_tasks = row_count;

    -- Hapus baris mata kuliah duplikat
    delete from public.courses
    where id = dup.id;
    cnt_deleted := cnt_deleted + 1;

    raise notice 'Mata kuliah "%" (ID: %) digabung ke (Kanonis: %). Dipindahkan: % jadwal, % materi, % tugas.',
      dup.name, dup.id, canonical_id, cnt_schedules, cnt_materials, cnt_tasks;
  end loop;

  raise notice 'Pembersihan selesai! Total % baris mata kuliah duplikat berhasil dihapus.', cnt_deleted;
end $$;
