# TuMuni La Matanza

Todos los trámites del Municipio de La Matanza, en un solo lugar. Escribís lo que necesitás y TuMuni te dice si se hace online, con turno, a distancia o en persona, qué tenés que llevar, cuánto cuesta y dónde ir. Después te lleva al canal oficial del municipio.

Prototipo académico · UNLaM · Visualización e Interfaces · 2026.

## Cómo usarlo

Abrí `index.html` en el navegador. No necesita instalación ni servidor.

- **En la PC** se ve como sitio web.
- **En el celular** se ve como app, con la barra de navegación abajo.

## Cuentas de prueba (MVP)

Iniciar sesión es **opcional**: todo funciona sin cuenta. Para mostrar la app con datos, entrá a **Ingresar** y elegí un perfil, o usá su email con la contraseña `demo1234`.

| Perfil | Email | Edad | Localidad |
|---|---|---|---|
| Marta Gómez · jubilada | marta.gomez@demo.tumuni | 68 | González Catán |
| Lucas Fernández · estudiante | lucas.fernandez@demo.tumuni | 19 | Isidro Casanova |
| Carla Benítez · emprendedora | carla.benitez@demo.tumuni | 34 | Ramos Mejía |
| Jorge Ramírez · taxista | jorge.ramirez@demo.tumuni | 47 | Gregorio de Laferrere |
| Ana Sosa · mamá | ana.sosa@demo.tumuni | 41 | San Justo |

Los datos se guardan solo en tu navegador. Desde **Ayuda → Restablecer la cuenta de prueba** vuelven a los datos de ejemplo.

## Qué incluye

- **55 trámites** de la Guía de Trámites de lamatanza.gov.ar, en 8 categorías, con cada link oficial verificado el 20/11/2026.
- Un buscador tolerante a errores, con sinónimos y sugerencias.
- Una ficha por trámite con:
  - preguntas rápidas
  - checklist para tildar
  - costo
  - sedes ordenadas por cercanía
  - alerta antes de salir de la app
- **Mi cuenta**, con **Editar perfil** y **Personalización** (la web arranca siempre en modo claro; desde ahí cada uno puede pasar a oscuro o automático, activar **Letra más grande** con un solo botón y reducir animaciones).
- Mis trámites y recordatorios.

## Archivos

```
index.html          Estructura de la app
css/styles.css      Estilos: celular, tablet, escritorio y modo oscuro
js/data.js          Trámites, categorías, sedes y localidades
js/usuarios.js      Cuentas de prueba
js/app.js           Navegación, buscador, fichas, cuenta y personalización
docs/ANALISIS_UX_UI.md   Análisis profesional de UX/UI y auditoría de links
EXTRAS/             Brief, flujos, wireframes y capturas
```
