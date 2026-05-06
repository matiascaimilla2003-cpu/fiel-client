-- TENANTS (botillerías)
create table tenants (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  logo_url text,
  activo boolean default true,
  created_at timestamptz default now()
);

-- USUARIOS
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  nombre text not null,
  telefono text not null,
  fecha_nacimiento date,
  nivel text default 'bronce' check (nivel in ('bronce','plata','oro','platino')),
  puntos_total integer default 0,
  racha_dias integer default 0,
  ultimo_acceso timestamptz default now(),
  created_at timestamptz default now(),
  unique(tenant_id, telefono)
);

-- TRANSACCIONES DE PUNTOS (ledger)
create table transacciones_puntos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  tipo text not null check (tipo in ('compra','canje','bono','ruleta','referido','reversa','mision')),
  puntos integer not null,
  descripcion text,
  referencia_externa text,
  created_at timestamptz default now()
);

-- BENEFICIOS
create table beneficios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  nombre text not null,
  descripcion text,
  puntos_costo integer not null,
  disponible boolean default true,
  tipo text default 'producto',
  created_at timestamptz default now()
);

-- CANJES
create table canjes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  beneficio_id uuid references beneficios(id),
  puntos_usados integer not null,
  codigo_canje text unique default 'FIEL-' || upper(substr(gen_random_uuid()::text, 1, 6)),
  estado text default 'pendiente' check (estado in ('pendiente','confirmado','vencido')),
  created_at timestamptz default now()
);

-- MISIONES
create table misiones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  titulo text not null,
  descripcion text,
  puntos_premio integer not null,
  meta_tipo text not null,
  meta_valor integer not null,
  fecha_inicio timestamptz default now(),
  fecha_fin timestamptz,
  activa boolean default true,
  created_at timestamptz default now()
);

-- PROGRESO DE MISIONES
create table misiones_progreso (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  mision_id uuid references misiones(id) on delete cascade,
  progreso_actual integer default 0,
  completada boolean default false,
  created_at timestamptz default now(),
  unique(usuario_id, mision_id)
);

-- REFERIDOS
create table referidos (
  id uuid primary key default gen_random_uuid(),
  usuario_referidor uuid references usuarios(id),
  usuario_referido uuid references usuarios(id),
  tenant_id uuid references tenants(id) on delete cascade,
  estado text default 'registrado' check (estado in ('registrado','compra_completada')),
  puntos_acreditados integer default 0,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table tenants enable row level security;
alter table usuarios enable row level security;
alter table transacciones_puntos enable row level security;
alter table beneficios enable row level security;
alter table canjes enable row level security;
alter table misiones enable row level security;
alter table misiones_progreso enable row level security;
alter table referidos enable row level security;

-- Insertar tenant de prueba para Tío Polo
insert into tenants (nombre, slug) values ('Tío Polo', 'tio-polo');
