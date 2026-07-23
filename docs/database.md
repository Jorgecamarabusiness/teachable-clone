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
| status | 'published' \| 'draft', default 'published' — añadida el 2026-07-23. Si el capítulo está en borrador, sus lecciones se ocultan al alumno aunque estén publicadas individualmente. |

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
| status | 'published' \| 'draft', default 'published' — añadida el 2026-07-23. Se filtra en `/cursos/[id]/aprender` junto con `sections.status`. |
| blocks | jsonb, confirmado — array de bloques `{type: "video"\|"video_file"\|"text", ...}`. `"video"` se muestra en el admin como **"Embed media"** (enlace externo tipo YouTube/Vimeo); `"video_file"` es un vídeo subido directamente por el admin a Supabase Storage (bucket `lesson-media`) — añadido el 2026-07-23. Ambos usan el campo `video_url`. El contenido de los bloques `"text"` es HTML (editor de texto enriquecido), se sanea con `isomorphic-dompurify` antes de renderizarlo al alumno. |

### purchases
| columna | notas |
|---|---|
| id | |
| user_id | confirmado |
| course_id | confirmado |
| amount_paid | confirmado — se lee/escribe tal cual desde las queries, sin tipo TS dedicado (no hay `Purchase` en `src/types/index.ts`; se quitó por no usarse en ningún sitio). |
| purchased_at | confirmado |
| payment_method | 'stripe' \| 'whop', default 'stripe' — añadida el 2026-07-23. |
| external_reference | nullable, texto libre — añadida el 2026-07-23. Id de la Checkout Session de Stripe, o la license key/membership id de Whop. Único junto con `payment_method` (evita reutilizar un mismo código/sesión). Hay además un unique en `(user_id, course_id)` para que no se dupliquen compras. |

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
- **2026-07-23** — `sections.status` y `lessons.status` (text, default 'published', check in ('published','draft')). Permite marcar capítulos y lecciones como borrador; un capítulo en borrador oculta también sus lecciones al alumno.
- **2026-07-23** — bucket de Storage `lesson-media` (público) + políticas RLS (lectura pública, escritura/borrado solo admins). Usado para subir vídeos (`video_file`) e imágenes insertadas en el editor de texto enriquecido. Ver sección Storage abajo.
- **2026-07-23** — `purchases.payment_method` + `purchases.external_reference`, unique en `(payment_method, external_reference)` y unique en `(user_id, course_id)`. Necesario para el flujo de pago con Stripe/Whop — ver sección Integraciones externas.

## Seguridad

No se ha confirmado si las tablas tienen Row Level Security (RLS) activado — el control de acceso admin se hace a mano en cada server action (`profiles.is_admin`). Antes de exponer una tabla nueva a queries desde el cliente, verificar/crear políticas RLS en el dashboard de Supabase.

## Storage

- **`lesson-media`** (bucket público) — creado el 2026-07-23. Contiene:
  - `videos/` — archivos de vídeo subidos directamente por el admin para bloques de tipo `video_file`.
  - `images/` — imágenes insertadas dentro del editor de texto enriquecido (bloques `text`).
- La subida se hace desde el navegador con el cliente de Supabase del propio admin (`src/lib/storage/uploadLessonMedia.ts`), no hay server action de por medio. El control de acceso lo hacen las políticas RLS del bucket (solo `profiles.is_admin` puede subir/borrar; la lectura es pública para que los alumnos puedan ver el contenido).

## Integraciones externas

- **Stripe** (checkout de pago único) — `src/lib/stripe/client.ts`. El precio se calcula en el momento desde `courses.price` (no hay Price ID fijo en el dashboard de Stripe). La confirmación de compra llega por webhook (`src/app/api/webhooks/stripe/route.ts`, evento `checkout.session.completed`), nunca solo por el redirect del navegador — el webhook usa el cliente admin de Supabase (`src/lib/supabase/admin.ts`, service role key) porque no hay sesión de usuario en una llamada servidor-a-servidor.
- **Whop** (verificación de compras hechas fuera de la web) — `src/lib/whop/client.ts`. El alumno pega su license key de Whop; se valida contra `GET /memberships/{license_key_o_id}` de la API de Whop (acepta la license key directamente como id). Si el membership está activo y corresponde al `WHOP_PRODUCT_ID` configurado, se crea la fila en `purchases`. No hay webhook de Whop, es validación bajo demanda.
- Variables de entorno necesarias (en `.env.local`, y replicarlas en el proveedor de hosting al desplegar): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `WHOP_API_KEY`, `WHOP_PRODUCT_ID`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`. Ninguna de estas (excepto `NEXT_PUBLIC_SITE_URL`) debe usarse fuera de código de servidor.
- El acceso a `/cursos/[id]/aprender` requiere sesión iniciada y una fila en `purchases` para ese `user_id`+`course_id` (o ser admin) — si no, redirige a `/cursos/[id]`.
