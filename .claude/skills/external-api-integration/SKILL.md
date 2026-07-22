---
name: external-api-integration
description: Usar cuando una tarea implique conectar una API o servicio externo nuevo (pagos, video, email, etc.) a este proyecto. Da los pasos de integración y qué le corresponde hacer al usuario fuera de Claude Code (cuentas, API keys, variables de entorno, dashboards).
---

1. Confirma con el usuario qué servicio y qué credenciales necesita (API key, secret, webhook signing secret, etc.) antes de escribir código.
2. Variables de entorno: dile al usuario que las añada a `.env.local` (no está versionado). Sigue el patrón existente: `NEXT_PUBLIC_...` solo si el valor debe llegar al navegador; todo lo demás (secret keys) sin ese prefijo y usado únicamente en código de servidor (`"use server"` / route handlers).
3. Crea un cliente/wrapper del servicio en `src/lib/<servicio>/`, siguiendo el mismo patrón que `src/lib/supabase/`. Nunca instancies el SDK con una secret key dentro de un componente cliente.
4. Si la integración necesita persistir datos nuevos (ids de cliente, estado de pago, etc.), usa primero el skill db-schema-change para la tabla/columna antes de escribir el código que la use.
5. Server actions: sigue la convención existente del repo — chequeo de sesión con `supabase.auth.getUser()`, `throw new Error("mensaje en español")` en fallos, `revalidatePath` + `redirect` tras mutar.
6. Pasos externos al usuario — dilos explícitamente, nunca asumas que ya están hechos: crear cuenta/proyecto en el servicio, generar las API keys, configurar webhooks apuntando a la URL de despliegue, y añadir las mismas variables de entorno en el proveedor de hosting (además de `.env.local`).
7. YAGNI: conecta solo lo que la tarea pide ahora (ej. "cobrar con Stripe" no implica añadir soporte multi-moneda o suscripciones si no se pidió).
