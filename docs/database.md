# Base de datos (Supabase)

El esquema vive únicamente en el dashboard de Supabase (cloud) — no hay Prisma, carpeta `supabase/migrations/` ni SQL local en el repo. Este archivo es la única documentación versionada del esquema: **actualízalo a mano cada vez que se ejecute SQL contra Supabase** (alta/baja de tabla o columna).

Convención: columnas en `snake_case` en la base de datos; las server actions las consumen tal cual (no hay capa de mapeo a camelCase). Los tipos de `src/types/index.ts` no siempre coinciden con las columnas reales — ver nota en `purchases`.

## Tablas confirmadas contra el código

### profiles
| columna | notas |
|---|---|
| id | uuid, = auth.users.id |
| email | |
| name | |
| is_admin | gate de acceso admin, chequeado a mano en cada server action |
| created_at | |

### courses
| columna | notas |
|---|---|
| id | |
| title | confirmado |
| description | |
| long_description | text (no array) — confirmado; el código lo parte por `\n\n` en párrafos |
| price | confirmado |
| learning_points | text[] — confirmado (ojo: no `learn_points`) |
| status | 'published' \| 'draft', default 'published' — añadida el 2026-07-23 (no existía; ver migración abajo). Se filtra en `/cursos` y `/cursos/[id]` para ocultar borradores a quien no sea admin. |
| thumbnail_url | nullable — inferido |
| created_at | confirmado |

### sections
| columna | notas |
|---|---|
| id | |
| course_id | FK → courses.id, confirmado |
| title | confirmado |
| order_index | confirmado (ojo: no `order`) |

### lessons
| columna | notas |
|---|---|
| id | |
| section_id | FK → sections.id, confirmado |
| course_id | FK → courses.id, confirmado |
| title | confirmado |
| duration | inferido |
| order_index | confirmado |
| is_preview | inferido |
| blocks | jsonb, confirmado — array de bloques `{type: "video"\|"text", ...}` |

### purchases
| columna | notas |
|---|---|
| id | |
| user_id | confirmado |
| course_id | confirmado |
| amount_paid | confirmado — **el tipo `Purchase.pricePaid` en `src/types/index.ts` no coincide con esta columna. Ese tipo no se usa en las queries reales (se leen filas crudas con `amount_paid`); es código muerto/desincronizado.** |
| purchased_at | confirmado |

### video_views
| columna | notas |
|---|---|
| id | |
| user_id | confirmado |
| lesson_id | confirmado |
| watched_seconds | inferido |
| completed | inferido |
| last_watched_at | inferido |

## Historial de migraciones aplicadas manualmente

- **2026-07-23** — `courses.status` (text, default 'published', check in ('published','draft')). Necesario para poder ocultar el curso mientras está en preparación.

## Seguridad

No se ha confirmado si las tablas tienen Row Level Security (RLS) activado — el control de acceso admin se hace a mano en cada server action (`profiles.is_admin`). Antes de exponer una tabla nueva a queries desde el cliente, verificar/crear políticas RLS en el dashboard de Supabase.

## Integraciones externas

Ninguna todavía. Solo Supabase (auth + DB). El campo `purchases.amount_paid` existe pero no hay procesador de pagos real conectado — revisar cómo se crea una fila en `purchases` hoy (probablemente simulado) antes de asumir que ya hay cobro real.
