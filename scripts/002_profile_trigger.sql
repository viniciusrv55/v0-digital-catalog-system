-- Auto-create profile on user signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nome, nome_loja, subdominio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'lojista'),
    coalesce(new.raw_user_meta_data ->> 'nome', null),
    coalesce(new.raw_user_meta_data ->> 'nome_loja', null),
    coalesce(new.raw_user_meta_data ->> 'subdominio', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
