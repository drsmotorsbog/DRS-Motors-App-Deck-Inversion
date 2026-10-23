# DRS Motors App · resumen de costos

Para el equipo de ingeniería. Corte: 22/10/2026. Dudas de negocio o presupuesto: Miguel.

Este documento junta lo que cuesta construir la app, lanzarla y mantenerla funcionando. Los precios se consultaron en octubre de 2026 en las páginas de cada proveedor o en guías de terceros. Antes de contratar cada servicio, confirmen el precio en su página oficial.

**Supuestos generales**

- Conversión: **US$1 = $3.300 COP**. Es un valor conservador: la TRM estuvo entre $3.170 y $3.313 en octubre de 2026.
- Horizonte presupuestado: **4 meses de desarrollo + 4 de lanzamiento**. Si el desarrollo se hace en 3 meses (ver sección 6), el total baja.
- Ingenieros: son parte de los fundadores. El auxilio mensual está **por definir** y no va incluido en los totales (ver sección 5).
- La S.A.S. de la app está **por constituir**. Hasta entonces, DRS Motors opera como sociedad de hecho, no como persona jurídica.

---

## 1. Resumen

| Concepto | COP |
|---|---|
| Etapa 1 · Desarrollo (meses 1–4) | 7.547.700 |
| Etapa 2 · Lanzamiento (meses 5–8) | 15.164.800 |
| **Total 8 meses** | **22.712.500** |
| Funcionamiento mensual después del lanzamiento, solo software | ~451.000 (al lanzar) → ~1.200.000 (con ~10.000 usuarios) |
| Funcionamiento mensual total (software + pauta + comercios) | ~3.950.000 + auxilio de los ingenieros |

El software es una parte pequeña del total. Casi todo el presupuesto se va en pauta.

---

## 2. Desembolsos mes a mes (8 meses)

| Mes | Etapa | Qué se paga | COP |
|---|---|---|---|
| 1 | Desarrollo | Claude Max 20x + Max 5x, Vercel, Apple Developer, Google Play, dominio, constitución de la S.A.S., registro de marca | 3.297.200 |
| 2 | Desarrollo | Claude Max 20x + Max 5x, Vercel | 1.056.000 |
| 3 | Desarrollo | Claude Max 20x + Max 5x, Vercel, salidas a conseguir comercios | 1.556.000 |
| 4 | Desarrollo | Claude Max 20x + Max 5x, Vercel, Supabase Pro, comercios | 1.638.500 |
| 5 | Lanzamiento | Claude Max 5x, Vercel, Supabase Pro, Expo EAS Starter, comercios, pauta | 4.041.200 |
| 6 | Lanzamiento | Lo mismo que el mes 5 | 4.041.200 |
| 7 | Lanzamiento | Claude Max 5x, Vercel, Supabase Pro, Expo EAS Starter, pauta | 3.541.200 |
| 8 | Lanzamiento | Lo mismo que el mes 7 | 3.541.200 |
| | | **Total** | **22.712.500** |

Las salidas a conseguir comercios empiezan en el mes 3 porque el día del lanzamiento el mapa no puede estar vacío: la meta es llegar con 15 comercios firmados.

### Desglose por rubro

| Rubro | Detalle | COP |
|---|---|---|
| Claude | Max 20x ($200) + Max 5x ($100) × 4 meses; luego solo Max 5x ($100) × 4 meses | 5.280.000 |
| Vercel | Pro, 1 puesto ($20) × 8 meses | 528.000 |
| Supabase | Plan gratis en los meses 1–3; Pro ($25) desde el mes 4 | 412.500 |
| Expo EAS | Plan gratis en el desarrollo; Starter ($19) × 4 meses de lanzamiento | 250.800 |
| Apple Developer + Google Play + dominio | $99 + $25 + ~$40 | 541.200 |
| Constitución de la S.A.S. | Socios jóvenes (Ley 1780) | 500.000 |
| Registro de marca | Una marca, dos clases | 1.200.000 |
| Pauta en Meta y TikTok | $3.000.000 × 4 meses de lanzamiento | 12.000.000 |
| Salidas a conseguir comercios | Transporte y material | 2.000.000 |
| **Total** | | **22.712.500** |

**Ahorros posibles**

- Alojar el panel del comercio en Cloudflare Pages en lugar de Vercel: −$528.000.
- Desarrollar en 3 meses en lugar de 4: −$1.056.000 (un mes menos de Claude Max 20x + 5x y de Vercel).

---

## 3. Stack y precio de cada servicio

| Servicio | Para qué | Plan y precio | Nota para ingeniería |
|---|---|---|---|
| **Claude** | Desarrollo | Max 20x: US$200/mes · Max 5x: US$100/mes | Compren en la web: en la app de iOS puede salir más caro. Max es individual y se paga mes a mes |
| **Supabase** | Base de datos, ingreso de usuarios, archivos, tiempo real | Gratis: 500 MB de base de datos, 50.000 usuarios, se pausa tras una semana sin uso · Pro: US$25/mes con US$10 de crédito para la máquina | La máquina se cobra por proyecto y todo el mes, sin pausa. Small: US$15 · Medium: US$60 |
| **Expo EAS** | Compilar para iOS y Android y actualizar sin pasar por las tiendas | Gratis: 15 compilaciones iOS + 15 Android al mes, 1.000 usuarios con actualizaciones · Starter: US$19/mes con US$45 de crédito y 3.000 usuarios · Production: US$199/mes | Compila en la nube: no hace falta un Mac. Cada usuario por encima de 3.000 en Starter cuesta US$0,005 |
| **Vercel** | Panel web del comercio y página de DRS | Hobby: gratis pero **solo uso no comercial** · Pro: US$20 por puesto al mes | No es indispensable: Cloudflare Pages o EAS Hosting pueden alojar el panel |
| **Apple Developer** | Publicar en el App Store | US$99 al año | Para publicar a nombre de la S.A.S. hace falta la sociedad constituida y un número D-U-N-S (gratis) |
| **Google Play** | Publicar en Android | US$25, una sola vez | Con cuenta de persona natural, Google exige una prueba cerrada con 12 testers durante 14 días antes de publicar. Con cuenta de empresa no |
| **Google Maps Platform** | Mapa, búsqueda de lugares, rutas | El SDK del mapa en el celular es gratis. 10.000 consultas gratis al mes por cada servicio Essentials y 5.000 por cada Pro | El crédito de US$200 ya no existe desde marzo de 2025. Cuiden las llamadas a Places y Directions |
| **Notificaciones push** | Alertas y reservas | Gratis (Expo Push / Firebase Cloud Messaging) | |
| **Ingreso de usuarios** | Registro e ingreso | Gratis con Supabase (Google, Apple, correo) | **Eviten el SMS como método principal**: Twilio Verify cuesta US$0,05 por verificación más el SMS |
| **Correo transaccional** (Resend) | Comprobantes y confirmaciones | Gratis hasta 3.000 correos al mes · Pro: ~US$20/mes | |
| **Monitoreo de errores** (Sentry) | Errores en producción | Gratis (Developer) · Team: ~US$26/mes | |
| **Wompi** | Pagos | 2,65 % + $700 + IVA por transacción aprobada | Ver sección 4. Sin mensualidad |
| **Facturación electrónica** | Facturar a los comercios | Gratis con la solución de la DIAN | Es obligatoria para la S.A.S. |
| **GitHub** | Código | Gratis, con repositorios privados | |
| **Dominio** | | ~US$40 al año | |
| **APIs de RUNT, SIMIT y SOAT** | Datos de Mi garaje | $0: consultas automatizadas | Ver los riesgos en la sección 7 |

---

## 4. Funcionamiento mensual después del lanzamiento

### Software

| Servicio | Al lanzar (≤ 1.000 usuarios) | Con ~10.000 usuarios |
|---|---|---|
| Claude Max 5x | 330.000 | 330.000 |
| Supabase | 82.500 (Pro) | ~247.500 (Pro + máquina más grande) |
| Expo EAS | 0 (gratis) | ~178.000 (Starter + usuarios extra) |
| Panel web (Cloudflare Pages) | 0 | 0 (o 66.000 con Vercel Pro) |
| Apple Developer ($99 al año, por mes) | 27.500 | 27.500 |
| Google Maps | 0 | ~247.500 (estimado) |
| Push, ingreso de usuarios, GitHub | 0 | 0 |
| Resend | 0 | 66.000 |
| Sentry | 0 | ~86.000 |
| Dominio (por mes) | 11.000 | 11.000 |
| **Total software** | **≈ 451.000** | **≈ 1.193.500** |

### Funcionamiento total

| Rubro | COP/mes |
|---|---|
| Software | ~451.000 |
| Pauta en Meta y TikTok | 3.000.000 |
| Salidas a conseguir comercios | ~500.000 |
| Auxilio de los ingenieros fundadores | Por definir |
| **Total sin auxilio** | **≈ 3.951.000** |

### Costos variables (no van en los totales)

- **Wompi:** 2,65 % + $700 + IVA por cada pago. En un lavado de $30.000, la pasarela se lleva ~$1.780.
- **Cómo se cobra:** el usuario paga en la app. A cada pago se le descuenta la comisión de DRS antes de girarle el resto al comercio, y cada comercio paga además una mensualidad por aparecer en la app.
- **Recomendación de diseño:** usar una pasarela con **pagos divididos**, para que cada parte reciba lo suyo directamente y el dinero de los comercios nunca quede en una cuenta propia.
- **Apple y Google** no cobran comisión por servicios que se consumen fuera de la app, como parqueadero, lavado o taller (norma 3.1.5 de Apple). El contenido digital que se consume dentro de la app, como un informe vehicular o un plan premium, probablemente tenga que pasar por el sistema de pagos de Apple, que cobra 15–30 %. Hay que confirmarlo antes de construir esas funciones.

---

## 5. Pendientes que mueven el presupuesto

| Pendiente | Qué cambia |
|---|---|
| **Auxilio mensual por ingeniero** | Ejemplo: $1,5 M × 2 ingenieros = +$3 M al mes. Va con acciones que se ganan con el tiempo (vesting), escrito en el acuerdo de accionistas |
| **Duración real del desarrollo** (3 o 4 meses) | Cada mes de desarrollo cuesta ~$1.056.000 (Claude Max 20x + 5x + Vercel) |
| **Vercel o Cloudflare Pages** para el panel | Hasta −$528.000 en 8 meses |
| Precio real de Google Maps según el uso | Depende de cuántas búsquedas y rutas pida la app |

---

## 6. Alcance de la versión 1 (lo que se presupuesta)

**Va en la versión 1:**

- Reservas y pagos de **parqueadero, lavado y taller**, con promociones en horas valle.
- **Mi garaje**: vencimiento del SOAT y de la tecnomecánica, pico y placa, multas y alertas.
- **Marketplace DRS**, solo con vehículos de DRS.
- **Panel web del comercio**: agenda, confirmación de reservas, servicios, promociones y pagos.

**Queda para después, a medida que se firmen aliados:** puntos y fidelización, renovación de SOAT y tecnomecánica, informe vehicular, seguros, crédito, marketplace abierto a terceros y compraventa protegida.

**Lo más complejo de la versión 1** es la disponibilidad de cupos de parqueadero en tiempo real. Al lanzar, el parqueadero confirma cada reserva a mano desde el panel; la integración con sus sistemas de acceso queda para una versión posterior.

---

## 7. Riesgos técnicos con impacto en costos

- **Consultas automatizadas al RUNT.** La consulta pública pide el documento del propietario y tiene captcha. Automatizarla puede violar las condiciones de uso del RUNT, y puede bloquearse. Si eso pasa, Mi garaje necesitaría un proveedor de datos pagado (por ejemplo, Verifik, que cotiza a pedido). SIMIT es más abierto.
- **Planes gratis con límites.** Supabase gratis se pausa tras una semana sin uso. Expo gratis tiene 15 compilaciones al mes por plataforma. Google Maps cobra por encima de las consultas gratis. Configuren alertas de facturación en cada servicio.
- **Datos personales.** La app maneja placas, documentos y ubicación. Se necesita autorización expresa del usuario y un responsable del tratamiento definido (Ley 1581 de 2012).
- **Repositorio.** El repositorio de la demo es público. El de la app real debe ser privado y sin llaves ni datos de clientes en el código.

---

## Fuentes

- Claude Max: [heyuan110.com](https://www.heyuan110.com/posts/ai/2026-02-25-claude-code-pricing/) · [intuitionlabs.ai](https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits)
- Supabase: [makerkit.dev](https://makerkit.dev/blog/saas/supabase-pricing) · [jetadmin.io](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/)
- Vercel: [makerkit.dev](https://makerkit.dev/blog/saas/vercel-cost) · [temps.sh](https://temps.sh/blog/vercel-pricing-2026-pro-plan-explained)
- Expo EAS: [docs.expo.dev](https://docs.expo.dev/billing/plans/) · [vibecoding.app](https://vibecoding.app/blog/expo-eas-review)
- Google Maps Platform: [developers.google.com](https://developers.google.com/maps/billing/overview/) · [woosmap.com](https://www.woosmap.com/blog/is-google-maps-api-free)
- Wompi: [bancolombia.com](https://www.bancolombia.com/negocios/productos/recaudos/datafono) · [cambiocolombia.com](https://cambiocolombia.com/peso-a-peso-paso-a-paso/articulo/2026/9/wompi-amplia-los-pagos-sin-contacto-y-baja-al-uno-por-ciento-la-tarifa-de-los-pagos-con-qr)
- Twilio Verify: [authgear.com](https://www.authgear.com/post/twilio-verify-pricing-and-alternatives)
- Datos de vehículos: [verifik.co](https://verifik.co/en/verify-vehicle-license-plate-colombia/)
- Norma 3.1.5 de Apple: [developer.apple.com](https://developer.apple.com/forums/thread/88316)
- TRM de octubre de 2026: [portafolio.co](https://www.portafolio.co/economia/finanzas/dolar-hoy-en-colombia-arranca-octubre-cerca-de-3-300-y-acumula-caida-de-11-38-en-503720)
