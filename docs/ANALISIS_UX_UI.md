# TuMuni La Matanza · Análisis UX/UI

**Rol:** Lead UX/UI Designer, servicios digitales de gobierno
**Fecha:** 20 de noviembre de 2026
**Versión analizada:** prototipo web TuMuni (HTML, CSS y JS), en celular, tablet y escritorio, en modo claro y oscuro

---

## 1. Resumen ejecutivo

TuMuni resuelve bien el problema central: saber **cómo se hace** un trámite municipal, **qué llevar**, **cuánto cuesta** y **dónde ir**. La base era sólida: lenguaje claro, una etiqueta de modalidad por trámite, el checklist y la alerta antes de salir de la app.

En esta revisión aparecieron tres tipos de problemas:

1. **Destinos que no llevaban a la solución.** Cuatro botones apuntaban a la portada del municipio en lugar de la página exacta. Además, dos enlaces de la propia web oficial están rotos o desactualizados.
2. **La jerarquía de acciones en la ficha.** Había hasta 5 botones del mismo peso, lo que contradice la regla de "una acción principal por pantalla". En el celular, además, la acción principal quedaba lejos, abajo de todo.
3. **Inconsistencias del sistema visual.** Había más de 15 tamaños de letra sueltos, colores fijos que impedían el modo oscuro y un botón A+ suelto en la barra, sin un lugar claro dentro de la cuenta.

Todo lo anterior quedó **corregido en esta versión**. La web arranca **siempre en modo claro**. También se sumaron las cuentas de prueba, la página **Mi cuenta**, **Editar perfil** y **Personalización** (modo claro, oscuro o automático).

---

## 2. Alcance y método

| Qué se revisó | Cómo |
|---|---|
| 55 fichas de trámite | Recorrido automático de cada ficha: que cargue sin errores, que tenga una acción principal y adónde lleva cada botón |
| 22 rutas de la app | Inicio, búsqueda (con resultados, sin resultados y fuera de alcance), 8 categorías, Mis trámites, recordatorio, ayuda, cuenta y 404 |
| 66 destinos externos | Cada link de acción, descarga, paso previo y fuente, comprobado contra la web oficial el 20/11/2026 |
| 5 perfiles de prueba | Inicio de sesión con un clic y con email y contraseña (con error y con éxito), cambio de tema y cierre de sesión |
| 3 tamaños × 2 temas | 390 px (celular), 640 px (tablet) y 1440 px (escritorio), en modo claro y oscuro |

**Criterios:** las 10 heurísticas de Nielsen, WCAG 2.2 nivel AA, los principios de diseño de servicios de gobierno (GOV.UK y Argentina.gob.ar), las reglas de negocio RN-01 a RN-15 del brief y las pautas visuales de la sección 12 del brief.

**Severidad:** 4 = impide completar el trámite · 3 = confunde o hace perder tiempo · 2 = molestia · 1 = detalle.

---

## 3. Auditoría de destinos: que todos los caminos terminen en la solución

Cada trámite tiene que terminar en el canal oficial correcto del Municipio de La Matanza. Para comprobarlo se recorrió la web oficial y se siguieron sus redirecciones.

### 3.1 Errores corregidos en TuMuni

| Trámite | Antes | Ahora | Sev. |
|---|---|---|---|
| Consultar la deuda de patente | Portada del municipio | `automotores.lamatanza.gov.ar` (portal de deuda de autos y motos) | 4 |
| Dar de baja la patente del auto | Ficha informativa | `automotoresturnos.lamatanza.gov.ar` (turnero oficial de Automotores) | 4 |
| Consultar multas | Un solo sistema | Los **dos** sistemas que indica el municipio: Infracciones BA (fotomultas desde 2017 y actas desde julio de 2018) y la web municipal (actas anteriores) | 3 |
| Denunciar un ilícito (MTZ) | Página informativa | WhatsApp oficial **11 3630-4527**, abierto las 24 horas, con mensaje modelo | 3 |
| Curso ANSV (licencias) | Dominio no verificado | Ficha oficial de Licencias + "Mi Primera Licencia" en argentina.gob.ar | 3 |
| Antecedentes penales | Dominio antiguo (dnrec) | `argentina.gob.ar/justicia/reincidencia` | 2 |
| Pagar la tasa · boleta por email | Fuente con subdominio directo | Fuente = acceso oficial `lamatanza.gov.ar/externos/…` (redirige a `tsg.` y a `facturadigital.`) | 1 |
| Licencias · sede La Tablada | 7 a 15:30 hs | **8 a 15 hs** con turno, según la ficha oficial actual | 3 |
| Licencias | Sin el formulario | Descarga directa de la **Declaración Jurada de Salud** (PDF oficial) | 2 |
| Pagar la tasa | — | Tutorial oficial "¿Cómo realizo el pago?" | 1 |
| Estacionamiento medido | No existía | Trámite nuevo: comercios adheridos en San Justo y Ramos Mejía | 2 |

### 3.2 Errores de la web oficial que TuMuni le avisa al vecino

| Hallazgo en lamatanza.gov.ar | Qué hace TuMuni | Sev. |
|---|---|---|
| El link **"Turnos · Gestión Judicial"** redirige a `obrasparticulares.lamatanza.gov.ar/Login.aspx`, que pide usuario y contraseña de otra área | Lo explica y ofrece llamar al 4651-0101 para pedir el turno | 4 |
| El **calendario de vencimientos** muestra fechas de 2019 y 2020; no publica las de 2026 de la tasa | Se quitó "cuota 11 · calendario oficial". El recordatorio de la tasa pide la fecha que figura en la boleta | 3 |
| El email `descentralizada.automotor@lamatanza.gov.ar` aparece escrito, pero su enlace abre una dirección `@gmail.com` distinta | Lo advierte en la ficha de deuda de patente y sugiere confirmar por teléfono | 2 |
| El portal de deuda de Automotores muestra el texto "mensaje de error de prueba" | Se registra para informarlo; el portal funciona igual | 1 |
| Las fichas de Licencias no publican la dirección de Ramos Mejía ni la de González Catán | Se muestra "la ficha oficial no la publica" (RN-03) | 2 |

### 3.3 Resultado

- **55 de 55 trámites** tienen una acción principal o una vía de contacto oficial.
- **66 de 66 destinos** son del Municipio, de la Provincia, de la Nación o canales oficiales (WhatsApp, email o teléfono). Ningún link lleva a un sitio que no sea oficial.
- Todos los destinos externos pasan por la **alerta de salida** (RN-07), que dice adónde va el vecino y qué le van a pedir.

---

## 4. Hallazgos de UX/UI y solución aplicada

| # | Hallazgo | Heurística / norma | Sev. | Solución |
|---|---|---|---|---|
| 1 | La ficha tenía hasta 5 botones del mismo peso (ir, secundaria, guardar, compartir, recordatorio) | Jerarquía visual; "una acción principal" (brief §12) | 3 | **1 botón principal** azul, secundarias con borde y una fila de herramientas chicas (Guardar · Compartir · Recordatorio) |
| 2 | En el celular la acción principal quedaba debajo del checklist, a varias pantallas de distancia | Reconocer antes que recordar; ley de Fitts | 3 | **Barra de acción fija** abajo con el costo y el botón principal |
| 3 | En el celular, la barra superior tenía logo, localidad y un botón azul "Ingresar" que competía con la acción de la página | Diseño minimalista | 2 | En el celular, la cuenta pasa a la barra inferior ("Ingresar" o "Mi cuenta") |
| 4 | Más de 15 tamaños de letra distintos (.66 a .98rem) | Consistencia y estándares | 2 | **Escala tipográfica de 3 tamaños chicos** (`--fs-xs`, `--fs-sm`, `--fs-md`) sobre una base de 18 px |
| 5 | Colores fijos en el código: no se podía ofrecer modo oscuro | Flexibilidad; WCAG 1.4.3 | 2 | Colores pasados a variables con un **tema oscuro completo** y contraste medido |
| 6 | El botón A+ estaba suelto en la barra y no se sabía dónde quedaba guardado | Consistencia; WCAG 1.4.4 | 1 | Pasa a **Personalización** como un solo interruptor **"Letra más grande"**: un único nivel (+12 %, de 18 a 20 px), se activa o se desactiva y no rompe proporciones porque todo está en rem |
| 7 | La búsqueda "licencia" traía 12 resultados, con ruido (alcohol, transporte escolar) | Relación con el mundo real | 2 | Si hay coincidencias fuertes en el nombre, se descartan las débiles: ahora devuelve los **6 trámites de licencia** |
| 8 | "Próximo vencimiento: cuota 11" se basaba en un calendario oficial desactualizado | Visibilidad del estado; RN-02 | 3 | La tarjeta muestra el recordatorio real del usuario ("faltan 28 días") o invita a cargar una fecha |
| 9 | El mapa ilustrativo podía leerse como un mapa real | Prevención de errores | 1 | Leyenda "Mapa ilustrativo: la ubicación exacta está en *Cómo llegar*" |
| 10 | La página de resultados no tenía título (h1) | WCAG 2.4.6 y 1.3.1 | 2 | Se agregó un h1 accesible ("Resultados para…") |
| 11 | La barra fija mostraba el nombre del trámite cortado ("Renovar la lice…") | Legibilidad | 1 | Ahora muestra "Cuánto cuesta $20.291" o "Cómo se hace · Online" |
| 12 | En el celular, las opciones de tema partían el texto en 4 líneas | Proporción y lectura | 1 | En el celular son filas (vista previa + texto); en tablet y PC, 3 columnas |
| 13 | El paso previo permitía un solo link | Control del usuario | 1 | Ahora admite varios (por ejemplo, Mi Primera Licencia + ficha oficial del curso) |

---

## 5. Reglas de diseño del sistema (aplicadas en todo el sitio)

### 5.1 Tipografía (Inter)

| Uso | Tamaño | Peso |
|---|---|---|
| Título de página (h1) | 1.5rem en celular / 1.9–2.4rem en PC | 800 |
| Título de sección (h2) | 1.08rem / 1.15rem | 700 |
| Texto base | 18 px en celular / 17 px en PC | 400 |
| Texto de tarjetas y listas | `--fs-md` 0.9375rem | 400–700 |
| Texto secundario | `--fs-sm` 0.875rem | 400 |
| Etiquetas, chips y pies | `--fs-xs` 0.78rem | 700 |

Interlineado de 1.45. Nunca hay texto de lectura por debajo de 15 px.

### 5.2 Espaciado y proporciones

- Grilla de 4 px: 4 · 8 · 12 · 16 · 24 · 32 · 40.
- Márgenes laterales de 16 px (celular), 24 px (tablet) y 32 px (PC); ancho máximo de 1200 px. Las lecturas largas (cuenta, formularios, ayuda) van en columnas de 620–820 px.
- Las áreas táctiles miden 44–52 px como mínimo; los botones principales, 52 px de alto.
- La ficha en PC tiene dos columnas, contenido (fluido) y resumen fijo de 380 px, con 40 px de separación.

### 5.3 Jerarquía de acciones

1. **Principal:** azul lleno, una sola por vista (ir al canal oficial, o guardar si no hay canal).
2. **Secundaria:** con borde azul (segundo canal, trámite relacionado).
3. **Herramienta:** botón chico con ícono (Guardar, Compartir, Recordatorio).
4. **Peligro:** con borde rojo (Cerrar sesión).

### 5.4 Color y contraste (WCAG AA, medido)

| Combinación | Claro | Oscuro |
|---|---|---|
| Texto principal sobre fondo | 13.65:1 | 15.51:1 |
| Texto secundario sobre tarjeta | 6.46:1 | 7.75:1 |
| Texto blanco sobre botón principal | 6.09:1 | 5.17:1 |
| Link sobre tarjeta | 6.09:1 | 7.91:1 |
| Texto de aviso sobre fondo de aviso | 7.98:1 | 11.17:1 |

La modalidad se comunica siempre con **texto + ícono + color**, nunca solo con color.

### 5.5 Modo oscuro

- Fondo `#0B1220`, tarjetas `#111A2B`, texto `#E6EAF0`.
- El botón principal pasa a `#2563EB` para mantener 5.17:1 con el texto blanco.
- Los chips de modalidad y de categoría tienen sus propios tonos oscuros.
- **Por defecto la web es siempre clara**, para todos y en todos los dispositivos (incluso si el celular está en modo oscuro).
- Cada persona puede cambiarlo en **Mi cuenta → Personalización**: Claro, Oscuro o Automático (sigue al dispositivo). El tema se aplica antes de pintar la página, así que no hay parpadeo.

---

## 6. Nuevas funciones (MVP)

| Función | Detalle |
|---|---|
| **Iniciar sesión (prueba)** | 5 perfiles de distintas edades, con un clic o con email y contraseña (`demo1234`). Es **opcional** (RN-13): todo funciona sin cuenta |
| **Datos por cuenta** | Cada perfil tiene sus checklists, recordatorios, localidad y tema; no se mezclan con los de otro perfil ni con los de invitado |
| **Inicio personalizado** | "Hola, Marta", sus trámites en curso con el progreso y trámites recomendados para su perfil |
| **Mi cuenta** | Tarjeta de perfil, contadores, menú (Editar perfil, Personalización, Mis trámites, Ayuda) y Cerrar sesión |
| **Editar perfil** | 4 campos (nombre y apellido, email, WhatsApp, localidad) con validación en línea. Nunca pide DNI, padrón ni patente (RN-14) |
| **Personalización** | Modo claro (por defecto), oscuro o automático; **Letra más grande** (un botón, un solo nivel); reducir animaciones; localidad |
| **Recordatorios** | Con sesión iniciada se completa el contacto con el email o el WhatsApp del perfil |

### Perfiles de prueba

| Perfil | Edad | Localidad | Para mostrar |
|---|---|---|---|
| Marta Gómez · jubilada | 68 | González Catán | Descuento de la tasa, renovación de licencia con 65+, recordatorios |
| Lucas Fernández · estudiante | 19 | Isidro Casanova | Primera licencia (16–21), alta de moto, cambiar a modo oscuro |
| Carla Benítez · emprendedora | 34 | Ramos Mejía | Habilitación con rubro alimenticio |
| Jorge Ramírez · taxista | 47 | Gregorio de Laferrere | Licencia profesional, multas, deuda de patente |
| Ana Sosa · mamá | 41 | San Justo | CUD, pase libre, exención de patente por discapacidad |

---

## 7. Pendientes y recomendaciones

1. **Avisar al municipio** de los dos enlaces rotos (Gestión Judicial y calendario de vencimientos) y del email que no coincide.
2. **Revisar los datos todos los meses:** montos, horarios y aranceles de licencia cambian seguido. Cada ficha muestra la fecha de verificación (RN-02).
3. **Prueba con usuarios reales:** 5 vecinos de los perfiles de arriba, con 3 tareas cada uno (pagar la tasa, renovar el registro, iniciar el CUD).
4. **Cuentas reales:** si el MVP avanza, el inicio de sesión necesita un servidor, la verificación del email y el envío real de los recordatorios.
5. **Mapa real:** reemplazar el mapa ilustrativo por uno interactivo cuando el prototipo tenga conexión.
