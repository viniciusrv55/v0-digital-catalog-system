-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Create Admin user: contato@zapmaxx.com.br / admin123
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'contato@zapmaxx.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "nome": "Admin ZapMaxx"}',
  now(),
  now(),
  '',
  ''
);

-- Create admin profile
INSERT INTO public.profiles (id, role, nome)
SELECT id, 'admin', 'Admin ZapMaxx'
FROM auth.users WHERE email = 'contato@zapmaxx.com.br'
ON CONFLICT (id) DO NOTHING;

-- 2) Create sample Lojista user: loja@exemplo.com / loja1234
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'loja@exemplo.com',
  crypt('loja1234', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "lojista", "nome": "Maria Silva", "nome_loja": "Doces da Maria", "subdominio": "doces-da-maria"}',
  now(),
  now(),
  '',
  ''
);

-- Create lojista profile
INSERT INTO public.profiles (id, role, nome, nome_loja, subdominio)
SELECT id, 'lojista', 'Maria Silva', 'Doces da Maria', 'doces-da-maria'
FROM auth.users WHERE email = 'loja@exemplo.com'
ON CONFLICT (id) DO NOTHING;

-- Create identity records for email auth to work correctly
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, email, json_build_object('sub', id::text, 'email', email, 'email_verified', true)::jsonb, 'email', now(), now(), now()
FROM auth.users WHERE email = 'contato@zapmaxx.com.br';

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, email, json_build_object('sub', id::text, 'email', email, 'email_verified', true)::jsonb, 'email', now(), now(), now()
FROM auth.users WHERE email = 'loja@exemplo.com';
