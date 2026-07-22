---
name: db-schema-change
description: Usar cuando una tarea requiera crear o modificar una tabla o columna en Supabase. Este proyecto no tiene Prisma ni migraciones locales — el esquema vive solo en el dashboard de Supabase. Da el procedimiento para escribir el SQL, entregarlo al usuario y mantener la documentación sincronizada.
---

Este proyecto no tiene acceso directo a la base de datos desde Claude Code. Nunca asumas que una migración ya se aplicó.

1. Lee `docs/database.md` para conocer el esquema actual y evitar colisiones de nombres antes de escribir SQL nuevo.
2. Escribe el SQL (`CREATE TABLE` / `ALTER TABLE` / etc.) en un bloque de código listo para copiar y pegar, usando `snake_case` para todas las columnas nuevas — es la convención ya existente en la base de datos.
3. Dile explícitamente al usuario, como paso externo suyo: pegar y ejecutar ese SQL en el SQL Editor de su proyecto de Supabase (dashboard → SQL Editor).
4. Si la tabla se va a consultar desde el cliente (no solo desde server actions), incluye también el SQL de las políticas RLS necesarias — no lo dejes implícito.
5. Después de que el usuario confirme que aplicó el cambio, actualiza `docs/database.md` y los tipos en `src/types/index.ts` para que coincidan exactamente con las columnas reales.
6. Actualiza las server actions/queries afectadas siguiendo la convención existente: chequeo de sesión + `profiles.is_admin` cuando aplique, `throw new Error("mensaje en español")` en fallos, `revalidatePath` tras mutar.
7. YAGNI: no añadas columnas ni tablas que la tarea actual no necesite.
