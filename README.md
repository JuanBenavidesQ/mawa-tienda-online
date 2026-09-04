# Tienda Mawá — comprar.mawa.com.co

Tienda online de entradas (pasadía) de Mawá. Next.js (App Router) + Tailwind 4,
desplegada en Vercel (proyecto `tienda-mawa`, rama `main`).

## Cómo funciona

1. El catálogo (planes, precios base y precio web) se lee de Supabase `planes_tipo`,
   sincronizado desde el admin de mawa-system (tab **Planes**). `src/lib/planes.ts`
   solo tiene un fallback si Supabase falla.
2. `POST /api/ordenes` crea el código `MAWA-XXXXXX` en `codigos_plan` con el
   **precio calculado en el servidor** (service role) y devuelve el hash de
   integridad de Bold.
3. El cliente paga con el botón embebido de Bold. El **webhook de Bold en el
   backend** (mawa-system) marca el código como pagado; `/exito` solo consulta el
   estado vía `GET /api/ordenes/estado`.
4. El sync del backend baja el código a caja, bookea tesorería y envía el código
   por WhatsApp al cliente.

## Medición (Sprint A, 2026-09)

- Meta Pixel y GA4 se cargan en `src/components/Analytics.tsx`; los IDs viven en
  `src/lib/analytics.ts` (públicos, con override por `NEXT_PUBLIC_META_PIXEL_ID`
  y `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- Eventos: `PageView` (Meta), `InitiateCheckout`/`begin_checkout` al confirmar
  la orden, `Purchase`/`purchase` en `/exito` cuando el backend confirma el pago
  (una sola vez por código, `eventID` = código para deduplicar con la API de
  conversiones).
- Open Graph: `public/og.jpg` (1200×630), generado con sharp a partir de la foto
  aérea + logo. Íconos en `src/app/icon.png` y `apple-icon.png`.

## Variables de entorno

Ver `.env.example`. Opcional: `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` (etiqueta
de verificación de dominio de Meta).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
