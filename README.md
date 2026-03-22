# Car Brands API + Frontend

Demostración de ejemplo de aplicación web full stack construida con Next.js (App Router), Prisma y PostgreSQL.

Incluye:

- API REST para gestionar marcas de autos (CRUD).
- Frontend sencillo para consumir la API (crear, listar, editar y eliminar).
- Estructura por capas inspirada en arquitectura limpia.
- Pruebas unitarias en la capa de casos de uso.

## Objetivo del proyecto

Este proyecto fue construido para demostrar:

- Separación de responsabilidades por capas.
- Integración de base de datos con Prisma.
- Buenas prácticas de seguridad y despliegue para un entorno académico.

## Tecnologías usadas

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Tailwind CSS
- Vitest (tests unitarios)

## Arquitectura y estructura

La app sigue una separación por capas:

- `src/core`: Entidades de dominio y contratos de repositorios.
- `src/application`: Casos de uso (lógica de aplicación).
- `src/infrastructure`: Implementaciones concretas y acceso a DB con Prisma.
- `src/app/api`: Route Handlers, validación, respuestas y rate limit.
- `src/app/page.tsx`: Frontend que consume la API.

## Cómo funciona la web

El frontend principal permite:

- Ver todas las marcas existentes.
- Crear una nueva marca.
- Editar una marca por id.
- Eliminar una marca.

Todas estas acciones llaman a la API interna en:

- `GET /api/brands`
- `POST /api/brands`
- `GET /api/brands/:id`
- `PUT /api/brands/:id`
- `DELETE /api/brands/:id`

## Scripts principales

- Desarrollo: `npm run dev`
- Build de producción: `npm run build`
- Ejecutar build: `npm run start`
- Lint: `npm run lint`
- Tests unitarios: `npm run test`
- Tests modo watch: `npm run test:watch`

## Pruebas

Las pruebas actuales cubren los casos de uso de marcas con un repositorio en memoria.

Archivo principal:

- `src/application/use-cases/brands/BrandUseCases.test.ts`

Ejecución:

```bash
npm run test
```

## Seguridad aplicada

Se implementaron mejoras de seguridad manteniendo la app simple:

- Secretos fuera del repositorio (`.env*` ignorado en git).
- Logs de Prisma reducidos en producción (solo errores).
- Validación de entrada en API (`id` válido y `name/nombre` con longitud controlada).
- Rate limit para operaciones de escritura (`POST`, `PUT`, `DELETE`) por IP y ventana de tiempo.
- Respuestas API con cabeceras de seguridad básicas:
  - `Cache-Control: no-store`
  - `X-Content-Type-Options: nosniff`
- Cabeceras globales en Next.js:
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restringida
- `X-Powered-By` deshabilitado.

Importante: el rate limit en memoria funciona bien para demo y evaluación. En producción de alto tráfico conviene moverlo a Redis/KV compartido.
