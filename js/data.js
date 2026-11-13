/* ==========================================================================
   TuMuni La Matanza · Catálogo de trámites
   --------------------------------------------------------------------------
   Fuente: Guía de Trámites de lamatanza.gov.ar (10 temas, 37 fichas) más
   Licencias para conducir (/tramites/41), Defensa del Consumidor y los
   servicios online del municipio. Relevado en noviembre de 2026.

   TuMuni NO modifica requisitos, costos, plazos, sedes ni canales (RN-02).
   Si la ficha oficial no publica un dato, la app lo dice (RN-03).
   ========================================================================== */

const VERIFICADO = "11/2026";
const OFICIAL = "https://www.lamatanza.gov.ar/";
const F = (n) => `https://www.lamatanza.gov.ar/tramites/${n}/details`;

/* Modalidades: una sola por trámite (RN-08) */
const MODALIDADES = {
  online:     { label: "Se hace online",            corto: "Online" },
  turno:      { label: "Turno online + presencial", corto: "Con turno" },
  distancia:  { label: "A distancia",               corto: "A distancia" },
  presencial: { label: "Presencial",                corto: "Presencial" }
};

/* Categorías por necesidad, no por oficina */
const CATEGORIAS = [
  { id: "casa",        nombre: "Mi casa",              icon: "casa",      desc: "Tasa municipal, libre deuda, titular, escrituras" },
  { id: "licencia",    nombre: "Licencia de conducir", icon: "licencia",  desc: "Primera vez, renovación, profesional, duplicado" },
  { id: "auto",        nombre: "Mi auto o moto",       icon: "auto",      desc: "Patentes, altas y bajas, multas, exenciones" },
  { id: "comercio",    nombre: "Mi comercio",          icon: "comercio",  desc: "Habilitación, bajas, traslados, rubros, alcohol" },
  { id: "salud",       nombre: "Salud y discapacidad", icon: "salud",     desc: "CUD, pases libres, pensiones, silla de ruedas" },
  { id: "reclamos",    nombre: "Reclamos y denuncias", icon: "reclamos",  desc: "147, Defensa del Consumidor, MTZ Denuncias" },
  { id: "cementerios", nombre: "Cementerios",          icon: "cementerio", desc: "Concesión de lotes, inhumaciones, nichos" },
  { id: "otros",       nombre: "Mesa de Entradas y otros", icon: "otros", desc: "Notas al municipio, gestión judicial" }
];

/* Búsquedas frecuentes (chips debajo del buscador) */
const POPULARES = ["pagar la tasa", "renovar registro", "habilitar mi local", "libre deuda", "multas", "CUD", "patente moto", "cementerio"];

/* Localidades de La Matanza (coordenadas aproximadas, solo para ordenar sedes · RN-12) */
const LOCALIDADES = [
  { id: "aldo-bonzi",        nombre: "Aldo Bonzi",            lat: -34.708, lng: -58.518 },
  { id: "ciudad-evita",      nombre: "Ciudad Evita",          lat: -34.722, lng: -58.535 },
  { id: "gonzalez-catan",    nombre: "González Catán",        lat: -34.771, lng: -58.646 },
  { id: "laferrere",         nombre: "Gregorio de Laferrere", lat: -34.746, lng: -58.585 },
  { id: "isidro-casanova",   nombre: "Isidro Casanova",       lat: -34.705, lng: -58.585 },
  { id: "la-tablada",        nombre: "La Tablada",            lat: -34.689, lng: -58.526 },
  { id: "lomas-del-mirador", nombre: "Lomas del Mirador",     lat: -34.665, lng: -58.530 },
  { id: "rafael-castillo",   nombre: "Rafael Castillo",       lat: -34.715, lng: -58.623 },
  { id: "ramos-mejia",       nombre: "Ramos Mejía",           lat: -34.642, lng: -58.565 },
  { id: "san-justo",         nombre: "San Justo",             lat: -34.682, lng: -58.560 },
  { id: "tapiales",          nombre: "Tapiales",              lat: -34.705, lng: -58.505 },
  { id: "veinte-de-junio",   nombre: "20 de Junio",           lat: -34.785, lng: -58.705 },
  { id: "villa-celina",      nombre: "Villa Celina",          lat: -34.705, lng: -58.480 },
  { id: "villa-luzuriaga",   nombre: "Villa Luzuriaga",       lat: -34.670, lng: -58.590 },
  { id: "villa-madero",      nombre: "Villa Madero",          lat: -34.690, lng: -58.497 },
  { id: "virrey-del-pino",   nombre: "Virrey del Pino",       lat: -34.835, lng: -58.680 }
];

/* --------------------------------------------------------------------------
   SEDES (direcciones, horarios y teléfonos de las fichas oficiales)
   direccion: null → la ficha oficial no la publica (RN-03)
   -------------------------------------------------------------------------- */
const SJ = { lat: -34.682, lng: -58.560 };
const SEDES = {
  // Tránsito / Licencias
  "transito-tablada": { nombre: "Licencias · La Tablada", direccion: "Arieta y Asamblea, La Tablada", horario: "Lunes a viernes de 7 a 15:30 hs · con turno", tel: "4651-0101", lat: -34.689, lng: -58.526 },
  "transito-ramos":   { nombre: "Licencias · Ramos Mejía", direccion: null, horario: "Lunes a viernes de 8 a 14 hs", tel: "4651-0101", lat: -34.642, lng: -58.565 },
  "transito-catan":   { nombre: "Licencias · González Catán", direccion: null, horario: "Lunes a viernes de 8 a 14 hs", tel: "4651-0101", lat: -34.771, lng: -58.646 },
  "dnrec":            { nombre: "Antecedentes penales (DNRec)", direccion: "Turnos en dnrec.jus.gov.ar o al 0800-666-0055", horario: "Teléfono de 7 a 18 hs", tel: "0800-666-0055", lat: -34.640, lng: -58.470, externo: true },
  "faltas":           { nombre: "Dirección de Faltas", direccion: "Entre Ríos 3058, 1º piso, San Justo", horario: "Lunes a viernes de 8:30 a 13:15 hs", tel: "4651-0101", lat: -34.679, lng: -58.561 },

  // Tasa por Servicios Generales / Recaudación
  "banco-cuentas":    { nombre: "Banco de Cuentas · San Justo", direccion: "Monseñor Marcón 3133 (ex Pichincha), San Justo", horario: "Lunes a viernes de 8 a 14:30 hs", tel: "4350-0401", lat: -34.682, lng: -58.561 },
  "bc-laferrere":     { nombre: "Banco de Cuentas · Laferrere", direccion: "Av. Luro 5757, Gregorio de Laferrere", horario: "Lunes a viernes de 8:15 a 13 hs", tel: "4457-1884", lat: -34.748, lng: -58.587 },
  "bc-tablada":       { nombre: "Banco de Cuentas · La Tablada", direccion: "Av. Crovara 3253, La Tablada", horario: "Lunes a viernes de 8:15 a 13:30 hs", tel: "4699-7696", lat: -34.693, lng: -58.530 },
  "bc-evita":         { nombre: "Banco de Cuentas · Ciudad Evita", direccion: "La Pirincha 2037, Ciudad Evita", horario: "Lunes a viernes de 8:15 a 13:30 hs", tel: "4487-4275", lat: -34.722, lng: -58.535 },
  "region-sur":       { nombre: "Región Descentralizada Sur", direccion: "Av. Juan Manuel de Rosas 17.798, González Catán", horario: "Lunes a viernes de 8:15 a 13:30 hs", tel: "(02202) 439899", lat: -34.771, lng: -58.640 },
  "eximiciones-tsg":  { nombre: "Banco de Cuentas · Sector Eximiciones", direccion: "Monseñor Marcón 3133, San Justo", horario: "Lunes a viernes de 8:15 a 15 hs", tel: "4651-0101 int. 365", lat: -34.682, lng: -58.561 },
  "catastro":         { nombre: "Catastro · ventanilla 8", direccion: "Perú 2250, 2º piso, San Justo", horario: "Lunes a viernes de 8 a 13:30 hs", tel: "4600-7370", lat: -34.683, lng: -58.559 },
  "tierras":          { nombre: "Dirección de Tierras", direccion: "Perú 2430, San Justo", horario: null, tel: "4651-0101", lat: -34.684, lng: -58.558 },
  "rnrd-136":         { nombre: "Registro Notarial RNRD Nº 1-3-6", direccion: "Almafuerte 3192, 1º piso, San Justo", horario: null, tel: "4651-0694", lat: -34.680, lng: -58.562 },
  "rnrd-5":           { nombre: "Registro Notarial RNRD Nº 5", direccion: "Entre Ríos 3208, San Justo", horario: null, tel: "4484-0212", lat: -34.679, lng: -58.563 },
  "rnrd-7sj":         { nombre: "Registro Notarial RNRD Nº 7", direccion: "Hipólito Yrigoyen 2182, San Justo", horario: null, tel: "4482-2767", lat: -34.681, lng: -58.565 },
  "rnrd-7rm":         { nombre: "Registro Notarial RNRD Nº 7 · Ramos", direccion: "Belgrano 181, 6º B, Ramos Mejía", horario: null, tel: "4654-7934", lat: -34.641, lng: -58.566 },
  "rnrd-8":           { nombre: "Registro Notarial RNRD Nº 8", direccion: "José León Larre 536, González Catán", horario: null, tel: "02202-423797", lat: -34.770, lng: -58.648 },

  // Automotores y motos
  "descentralizada":  { nombre: "Descentralización Adm. Tributaria", direccion: "H. Yrigoyen 2147, San Justo", horario: "Lunes a viernes de 8:15 a 13 hs", tel: "4651-0101 int. 293", lat: -34.681, lng: -58.566 },
  "eximiciones-auto": { nombre: "Eximiciones Automotor", direccion: "H. Yrigoyen 2147, San Justo", horario: "Martes y jueves de 9 a 12 hs", tel: "4651-0101", lat: -34.681, lng: -58.566 },
  "noroeste1":        { nombre: "Región Descentralizada Noroeste 1", direccion: "Av. Rivadavia 13.518, Ramos Mejía", horario: "Lunes a viernes de 8:15 a 13 hs", tel: "4654-7454", lat: -34.646, lng: -58.564 },

  // Comercios
  "habilitaciones":   { nombre: "Departamento de Habilitaciones", direccion: "Perú 2250, 4º piso, San Justo", horario: "Lunes a viernes de 8:30 a 13:30 hs", tel: "4651-0101", lat: -34.683, lng: -58.559 },
  "planeamiento":     { nombre: "Dirección de Planeamiento (zonificación)", direccion: "Yrigoyen 2746, San Justo", horario: null, tel: "4651-0014 int. 113", lat: -34.678, lng: -58.564 },
  "pequenos":         { nombre: "Pequeños Contribuyentes", direccion: "Monseñor Marcón 3133, San Justo", horario: "Lunes a viernes de 8 a 13:30 hs", tel: "4651-0101 int. 390", lat: -34.682, lng: -58.561 },
  "medianos":         { nombre: "Medianos y Grandes Contribuyentes", direccion: "Perú 2250, San Justo", horario: "Lunes a viernes de 8:30 a 13:30 hs", tel: "4651-0101", lat: -34.683, lng: -58.559 },
  "control-comunal":  { nombre: "Control Comunal", direccion: "Perú 2250, 4º piso, San Justo", horario: "Lunes a viernes de 8:30 a 13:30 hs", tel: "4600-7339", lat: -34.683, lng: -58.559 },
  "recursos":         { nombre: "Fiscalización · Sector Recursos", direccion: "Perú 2250, 3er piso, San Justo", horario: "Lunes a viernes de 8:30 a 13:30 hs", tel: "4600-7357", lat: -34.683, lng: -58.559 },

  // Salud y discapacidad
  "pases-caba":       { nombre: "Pases libres (Capital Federal)", direccion: "Paseo Colón 135, CABA", horario: "Lunes a viernes de 10 a 16 hs", tel: "4349-7135", lat: -34.611, lng: -58.369, externo: true },
  "cap-catan":        { nombre: "C.A.P. González Catán", direccion: "Ruta 3 Nº 17.798 (Km 32), González Catán", horario: "Lunes a viernes de 9 a 13 hs", tel: "4441-0830", lat: -34.771, lng: -58.640 },
  "cap-laferrere":    { nombre: "C.A.P. Laferrere", direccion: "Obligado 2986 (y Echeverría), Laferrere", horario: "Lunes a jueves de 8 a 12 hs", tel: "4626-6490", lat: -34.750, lng: -58.590 },
  "cap-mirador":      { nombre: "C.A.P. Lomas del Mirador", direccion: "Provincias Unidas 1601, Lomas del Mirador", horario: "Lunes a jueves de 8 a 12 hs", tel: "4484-8694", lat: -34.662, lng: -58.535 },
  "defensoria-sj":    { nombre: "Defensoría General · San Justo", direccion: "Almafuerte 3133, 1º piso, San Justo", horario: null, tel: "4441-8498", lat: -34.680, lng: -58.561 },
  "defensoria-laf":   { nombre: "Defensoría General · Laferrere", direccion: "Beethoven y Piedra Buena, Laferrere", horario: "Lunes a viernes de 7:30 a 12 hs", tel: "4457-3289", lat: -34.745, lng: -58.580 },
  "desarrollo-social":{ nombre: "Secretaría de Desarrollo Social", direccion: "Juan M. de Rosas 4358", horario: null, tel: "4651-0101", lat: -34.695, lng: -58.565 },

  // Reclamos, cementerios y otros
  "consumidor":       { nombre: "Defensa del Consumidor (OMIC)", direccion: "Perú 2250, planta baja, San Justo", horario: "Lunes a viernes de 8:30 a 14 hs", tel: "4651-0101", lat: -34.683, lng: -58.559 },
  "mesa-entradas":    { nombre: "Mesa General de Entradas", direccion: "Almafuerte 3050, San Justo", horario: null, tel: "4651-0101", lat: SJ.lat, lng: SJ.lng },
  "mesa-peru":        { nombre: "Mesa de Entradas · Perú 2250", direccion: "Perú 2250, planta baja, San Justo", horario: null, tel: "4651-0101", lat: -34.683, lng: -58.559 },
  "dir-cementerios":  { nombre: "Dirección de Cementerios", direccion: "Palacio Municipal, Almafuerte 3050, San Justo", horario: "Lunes a viernes de 8:30 a 13:30 hs", tel: "4651-0101", lat: SJ.lat, lng: SJ.lng },
  "cem-sanjusto":     { nombre: "Cementerio de San Justo", direccion: null, horario: "Lun a sáb 8 a 12 hs · dom y feriados 8 a 11 hs", tel: "4651-0101", lat: -34.690, lng: -58.570 },
  "cem-villegas":     { nombre: "Cementerio de Villegas", direccion: null, horario: "Lun a vie 7:30 a 12:30 hs · fines de semana 8 a 12:30 hs", tel: "4651-0101", lat: -34.735, lng: -58.600 }
};

/* Sinónimos y errores frecuentes para el buscador tolerante */
const SINONIMOS = {
  registro: "licencia", carnet: "licencia", carne: "licencia", licensia: "licencia", lisencia: "licencia", licencias: "licencia",
  brevet: "licencia", conducir: "licencia", manejar: "licencia", registros: "licencia",
  abl: "tasa", tsg: "tasa", impuesto: "tasa", boleta: "tasa", padron: "tasa", inmobiliario: "tasa", alumbrado: "tasa",
  local: "comercio", negocio: "comercio", comercial: "comercio", kiosco: "comercio", almacen: "comercio",
  habilitar: "habilitacion", abilitar: "habilitacion", abilitacion: "habilitacion", abilitasion: "habilitacion", habilitasion: "habilitacion",
  infraccion: "multas", infracciones: "multas", multa: "multas", fotomulta: "multas",
  moto: "motos", motocicleta: "motos", patentes: "patente", patentar: "patente", automotor: "auto", coche: "auto", vehiculo: "auto", camioneta: "auto",
  discapacidad: "discapacidad", certificado: "certificado", cud: "cud",
  queja: "reclamo", reclamar: "reclamo", bache: "reclamo", baches: "reclamo", luminaria: "reclamo", luz: "reclamo", basura: "reclamo",
  denunciar: "denuncia", estafa: "consumidor", garantia: "consumidor", empresa: "consumidor",
  colectivo: "pase", boleto: "pase", transporte: "pase",
  cementerio: "cementerios", nicho: "nichos", sepultura: "cementerios", boveda: "cementerios", velatorio: "cementerios", fallecido: "inhumacion", entierro: "inhumacion",
  alcohol: "bebidas", alcoholicas: "bebidas", cerveza: "bebidas", reba: "bebidas",
  jubilado: "jubilados", jubilada: "jubilados", pensionado: "jubilados", descuento: "eximicion", exencion: "eximicion", exento: "eximicion",
  escritura: "escritura", escriturar: "escritura", titulo: "escritura", bien: "vivienda", familia: "vivienda",
  silla: "ruedas", pension: "pensiones", curador: "curatela"
};

/* Avisos reutilizables */
const AV_CANCELAR = { tipo: "aviso", txt: "<b>Importante:</b> si no podés ir, cancelá el turno. Si no, el municipio te bloquea 30 días para pedir otro." };
const AV_45 = { tipo: "info", txt: "Una vez iniciado, tenés <b>45 días corridos</b> para terminar el trámite. Si no, se da de baja y hay que volver a pagar las tasas." };
const AV_GESTORES = { tipo: "info", txt: "Solo son válidas las oficinas del municipio. No te dejes engañar por ofrecimientos en redes para sacar la licencia sin turno." };
const AV_PANDEMIA = { tipo: "aviso", txt: "La ficha oficial dice que, por la pandemia, solo atiende la oficina de San Justo. Puede estar desactualizado: confirmá al 4651-0101 antes de ir." };
const AV_TITULAR = { tipo: "info", txt: "Solo lo puede presentar el titular, su cónyuge o un gestor autorizado por el Colegio de Gestores. Otra persona necesita autorización ante escribano." };
const TURNERO = {
  label: "Sacar turno en la web oficial", url: "https://turnostransito.lamatanza.gov.ar/", destino: "turnostransito.lamatanza.gov.ar",
  tipo: "turnero", queHace: "El turno se saca en el turnero oficial de Tránsito y te lo confirman por mail."
};
const EDAD_PART = { id: "edad", txt: "¿Cuántos años tenés?", ops: [["64", "Hasta 64"], ["65", "65 a 69"], ["70", "70 o más"]] };

/* --------------------------------------------------------------------------
   TRÁMITES
   -------------------------------------------------------------------------- */
const TRAMITES = [

  /* ============================ MI CASA ============================ */
  {
    id: "pagar-tasa", nombre: "Pagar la tasa municipal", oficial: "Tasa por Servicios Generales (ABL)",
    cat: "casa", mod: "online", masBuscado: 1,
    resumen: "Con tarjeta, hasta 12 cuotas, en la web del municipio",
    claves: "tasa pagar abl tsg servicios generales boleta cuota padron alumbrado barrido limpieza casa",
    pasos: ["Buscá en tu boleta el Nº de padrón y la fecha de vencimiento.", "Tocá “Ir a pagar”: se abre tsg.lamatanza.gov.ar.", "Pagá con tarjeta (hasta 12 cuotas) en la web del municipio."],
    tenerAMano: ["Nº de padrón de tu propiedad", "Fecha de vencimiento de la cuota", "Tarjeta de crédito (hasta 12 cuotas)"],
    ayudaBoleta: true,
    costo: { texto: "Depende de tu propiedad: el monto figura en tu boleta.", nota: "TuMuni no cobra ni ve tus datos de pago." },
    acciones: [{ label: "Ir a pagar", url: "https://tsg.lamatanza.gov.ar/", destino: "tsg.lamatanza.gov.ar", tipo: "web", queHace: "El pago se hace en la web del Municipio.", pedira: ["Nº de padrón", "Fecha de vencimiento", "Tarjeta de crédito"] }],
    secundaria: { label: "Recibir la boleta por email", tramite: "boleta-email" },
    recordatorio: "tasa", fuente: "https://tsg.lamatanza.gov.ar/"
  },
  {
    id: "boleta-email", nombre: "Recibir la boleta por email", oficial: "Factura digital de la TSG",
    cat: "casa", mod: "online",
    resumen: "Dejá de esperar la boleta en papel",
    claves: "boleta email mail correo factura digital tasa adhesion papel",
    pasos: ["Tocá “Adherirme” para ir a la web oficial de factura digital.", "Completá los datos que te pide el municipio y tu email.", "Desde la próxima cuota, la boleta te llega por correo."],
    tenerAMano: ["Tu última boleta de la tasa (te van a pedir datos de ella)", "Un email que revises seguido"],
    costo: { texto: "Sin costo." },
    acciones: [{ label: "Adherirme a la boleta por email", url: "https://facturadigital.lamatanza.gov.ar/", destino: "facturadigital.lamatanza.gov.ar", tipo: "web", queHace: "La adhesión se hace en la web del Municipio.", pedira: ["Datos de tu boleta", "Tu email"] }],
    fuente: "https://facturadigital.lamatanza.gov.ar/"
  },
  {
    id: "cuotas-vencidas", nombre: "Pagar cuotas vencidas de la tasa", oficial: "Actualización de Cuotas Vencidas",
    cat: "casa", mod: "presencial",
    resumen: "Llevá las boletas vencidas a un Banco de Cuentas",
    claves: "cuotas vencidas atrasadas deuda tasa actualizar boletas viejas abl",
    pasos: ["Juntá las boletas de las cuotas vencidas.", "Andá al Banco de Cuentas más cercano.", "Te actualizan el monto para pagarlo."],
    checklist: [{ t: "Boletas de las cuotas vencidas" }],
    costo: { texto: null, faltante: "El monto depende de tu deuda; el municipio lo calcula en ventanilla." },
    sedes: ["banco-cuentas", "bc-laferrere", "bc-tablada", "region-sur"],
    contacto: "Consultas: 11-6084-7741 · 2206-1290 (opción 1) · direccionderecaudacion@lamatanza.gov.ar",
    fuente: F(29)
  },
  {
    id: "libre-deuda", nombre: "Pedir el libre deuda de la tasa", oficial: "Certificación de Libre Deuda",
    cat: "casa", mod: "presencial", masBuscado: 1,
    resumen: "Para escriturar, habilitar o construir · Banco de Cuentas",
    claves: "libre deuda tasa certificado venta escritura escriturar habilitacion construccion subdivision abl",
    pasos: ["Llevá el recibo de la tasa.", "Pagá el sellado en las cajas del Banco de Cuentas de San Justo.", "Te entregan el certificado de que el padrón no tiene deuda."],
    preguntas: [{ id: "inq", txt: "¿Sos el propietario o inquilino?", ops: [["prop", "Propietario"], ["inq", "Inquilino"]] }],
    checklist: [
      { t: "Recibo de la Tasa por Servicios Generales / Parte Catastral" },
      { t: "Contrato de alquiler o comodato, con sellado", si: [{ inq: ["inq"] }] },
      { t: "Dinero para el sellado", n: "se paga en las cajas del Banco de Cuentas" }
    ],
    costo: { texto: null, faltante: "El municipio no informa el monto del sellado." },
    sedes: ["banco-cuentas"],
    avisos: [{ tipo: "info", txt: "Lo piden para iniciar habilitaciones, subdivisiones, pagar derechos de construcción y escriturar." }],
    contacto: "Consultas: 11-6084-7741 · 2206-1290 (opción 1) · direccionderecaudacion@lamatanza.gov.ar",
    fuente: F(30)
  },
  {
    id: "eximicion-tsg", nombre: "Pedir el descuento de la tasa para jubilados", oficial: "Eximición de la TSG",
    cat: "casa", mod: "presencial",
    resumen: "Jubilados y pensionados propietarios · requiere turno",
    claves: "eximicion exencion descuento jubilados pensionados tasa abl tsg gratis",
    pasos: ["Pedí turno al 4651-0101 int. 365 (Sector Eximiciones).", "Al turno llevá el recibo de la tasa del año, la última boleta de luz y tu DNI.", "Después presentá toda la documentación en original y copia."],
    checklist: [
      { t: "DNI del titular y del cónyuge", n: "con el domicilio donde pedís la eximición" },
      { t: "Escritura o boleto de compraventa sellado", n: "original y copia" },
      { t: "Último recibo de jubilación o pensión (titular y/o cónyuge)", n: "si incluye aguinaldo, también el anterior" },
      { t: "Última boleta de luz, hasta 400 kW", n: "la del día de la presentación" },
      { t: "Última boleta de la Tasa por Servicios Generales" },
      { t: "Libreta o acta de matrimonio", n: "si no hay libreta, partidas de nacimiento de los hijos" },
      { t: "Acta de defunción del cónyuge", n: "si no figura en la libreta" },
      { t: "Negativa de ANSES del cónyuge que no cobra pensión", n: "si corresponde" }
    ],
    avisos: [
      { tipo: "error", txt: "<b>Si la boleta de luz supera los 400 kW, no se puede tramitar.</b>" },
      { tipo: "info", txt: "El trámite es personal y no necesita gestores." }
    ],
    costo: { texto: "Sin costo según la ficha oficial." },
    sedes: ["eximiciones-tsg"],
    fuente: F(31)
  },
  {
    id: "cambio-titular", nombre: "Cambiar el titular o el domicilio de la tasa", oficial: "Cambio de Titularidad o Domicilio en la TSG",
    cat: "casa", mod: "presencial",
    resumen: "En Catastro, Perú 2250, San Justo",
    claves: "cambio titular titularidad domicilio tasa compre casa escritura catastro boleta llega a otro nombre",
    pasos: ["Juntá la documentación en original y copia.", "Andá a Catastro, 2º piso, ventanilla 8.", "Presentá todo en ventanilla."],
    preguntas: [{ id: "que", txt: "¿Qué querés cambiar?", ops: [["tit", "El titular"], ["dom", "El domicilio postal"]] }],
    checklist: [
      { t: "Escritura completa con inscripción de dominio", si: [{ que: ["tit"] }], n: "original y copia · si es por Ley 24.374, con esa mención" },
      { t: "Escritura, boleto de compraventa o libreta de pagos con inscripción de dominio", si: [{ que: ["dom"] }], n: "original y copia" },
      { t: "Recibo de Servicios Generales", n: "original y copia" },
      { t: "DNI", n: "original y copia" }
    ],
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sedes: ["catastro"],
    fuente: F(32)
  },
  {
    id: "proteccion-vivienda", nombre: "Proteger mi vivienda (ex bien de familia)", oficial: "Protección de la Vivienda · Ley 26.994",
    cat: "casa", mod: "presencial",
    resumen: "Gratis · protege tu casa de embargos",
    claves: "bien de familia proteccion vivienda embargo casa familia ley 26994",
    pasos: ["Juntá la documentación en original y fotocopia simple.", "Presentala en el municipio (el trámite es personal).", "La afectación demora aproximadamente 150 días."],
    checklist: [
      { t: "Título de propiedad o certificado de resguardo", n: "con copia certificada del título original" },
      { t: "Declaratoria de herederos inscripta", n: "si lo recibiste por sucesión" },
      { t: "Plano de anexión o unificación", n: "si el inmueble fue modificado" },
      { t: "DNI y CUIT/CUIL de los titulares" },
      { t: "Libreta de familia o partidas que acrediten el parentesco con los beneficiarios" }
    ],
    avisos: [{ tipo: "info", txt: "El trámite es <b>gratuito y personal</b>: no necesitás gestores. Demora unos 150 días." }],
    costo: { texto: "Gratis." },
    sinSede: "La ficha oficial no indica la oficina de atención. Consultá al 4651-0101.",
    fuente: F(33)
  },
  {
    id: "regularizacion-dominial", nombre: "Escriturar mi casa (regularización dominial)", oficial: "Regularización Dominial",
    cat: "casa", mod: "presencial",
    resumen: "Para quienes compraron sin escritura",
    claves: "escritura escriturar regularizacion dominial ley 24374 10830 boleto sin escritura titulo casa",
    preguntas: [{ id: "ley", txt: "¿Cuál es tu caso?", ops: [["24374", "Compré antes de 2006"], ["cons", "Ya tengo el acta y pasaron 10 años"], ["10830", "Bajos ingresos (Ley 10.830)"]] }],
    pasos: ["Respondé cuál es tu caso.", "Llevá la documentación al registro notarial o a la Dirección de Tierras.", "No hace falta gestor ni abogado: el trámite es personal."],
    checklist: [
      { t: "DNI y CUIL/CUIT con domicilio actualizado", si: [{ ley: ["24374", "10830"] }] },
      { t: "Acta de matrimonio", si: [{ ley: ["24374"] }], n: "si corresponde" },
      { t: "Boleto de compraventa o cesión anterior a 2006", si: [{ ley: ["24374"] }], n: "si lo tenés" },
      { t: "Libreta de pagos", si: [{ ley: ["24374"] }], n: "si la tenés" },
      { t: "Un recibo de impuestos (Rentas y Municipal) por año, de los últimos 10 años", si: [{ ley: ["24374"] }] },
      { t: "Un recibo de servicios (luz, gas, teléfono) por año, de los últimos 10 años", si: [{ ley: ["24374"] }] },
      { t: "Acta de la Ley 24.374", si: [{ ley: ["cons"] }] },
      { t: "DNI", si: [{ ley: ["cons"] }] },
      { t: "Constancia de CUIL", si: [{ ley: ["cons"] }] },
      { t: "DNI y CUIL/CUIT de compradores y vendedores", si: [{ ley: ["10830"] }], n: "original y fotocopia" },
      { t: "Boleto de compraventa y cesiones", si: [{ ley: ["10830"] }] },
      { t: "Escritura del inmueble a transferir", si: [{ ley: ["10830"] }] },
      { t: "Plano o croquis del inmueble", si: [{ ley: ["10830"] }] },
      { t: "Recibo de impuestos y de servicios", si: [{ ley: ["10830"] }] },
      { t: "Foto del frente de la casa", si: [{ ley: ["10830"] }] },
      { t: "Poder especial si el vendedor no está", si: [{ ley: ["10830"] }] }
    ],
    costo: { porRespuesta: "ley", valores: { "24374": "1% de la valuación", "cons": "Consultar", "10830": "Gratis" }, etiquetas: { "24374": "Ley 24.374", "cons": "consolidación", "10830": "Ley 10.830" }, desde: "Desde gratis", nota: "Ley 24.374: 1% de la valuación especial, se paga solo en Banco Provincia." },
    sedesPorRespuesta: { ley: { "24374": ["rnrd-136", "rnrd-5", "rnrd-7sj", "rnrd-7rm", "rnrd-8"], "cons": ["rnrd-136", "rnrd-5", "rnrd-7sj", "rnrd-7rm", "rnrd-8"], "10830": ["tierras"] } },
    avisos: [{ tipo: "info", txt: "Ley 10.830: valuación fiscal de hasta $1.700.000 ($850.000 si es terreno baldío)." }],
    fuente: F(34)
  },

  /* ======================== LICENCIA DE CONDUCIR ======================== */
  {
    id: "renovar-licencia", nombre: "Renovar la licencia de conducir", oficial: "Licencia para conducir · Renovación particular",
    cat: "licencia", mod: "turno", masBuscado: 1,
    resumen: "Desde $20.291 · 3 sedes",
    claves: "renovar renovacion licencia registro carnet conducir vencio vence particular auto moto",
    etapas: ["Preparar lo que llevás", "Sacar turno", "Ir a la sede"],
    preguntas: [EDAD_PART, { id: "venc", txt: "¿Venció hace más de 90 días?", ops: [["no", "No"], ["si", "Sí"]] }],
    checklist: [
      { t: "DNI digitalizado con domicilio en La Matanza" },
      { t: "Licencia actual", si: [{ venc: ["no"] }] },
      { t: "Certificado del curso online de la ANSV", si: [{ venc: ["si"] }], n: "paso previo nacional" },
      { t: "Declaración Jurada de Salud", n: "se descarga de la web del municipio" },
      { t: "Certificado médico de aptitud física", si: [{ edad: ["70"] }] },
      { t: "Examen teórico y práctico", si: [{ edad: ["65", "70"] }, { venc: ["si"] }], n: "se rinde en la sede" },
      { t: "Examen psicofísico", n: "se hace en la sede" },
      { t: "Todo con 1 fotocopia" }
    ],
    avisosPorRespuesta: [{ si: { venc: ["si"] }, tipo: "aviso", txt: "Pasados 90 días del vencimiento, se rinde como licencia original (con todos los exámenes), aunque conservás la antigüedad." }],
    costo: { porRespuesta: "edad", valores: { "64": "$21.590", "65": "$20.291", "70": "$20.291" }, etiquetas: { "64": "hasta 64 años", "65": "65 años o más", "70": "65 años o más" }, desde: "Desde $20.291", nota: "Arancel de la ficha oficial. Hasta 90 días después del vencimiento podés renovar, pero no podés manejar." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    avisos: [AV_CANCELAR, AV_45, AV_GESTORES],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email para la confirmación", "Elegir sede, día y hora"] }],
    recordatorio: "licencia", fuente: F(41)
  },
  {
    id: "licencia-original", nombre: "Sacar la licencia por primera vez", oficial: "Licencia para conducir · Original clases A y B",
    cat: "licencia", mod: "turno", masBuscado: 1,
    resumen: "Desde $21.740 · requiere curso online ANSV",
    claves: "licencia registro carnet conducir primera vez original nueva sacar aprender joven",
    etapas: ["Hacer el curso ANSV", "Sacar turno", "Ir a la sede"],
    pasoPrevio: { txt: "Hacé el curso obligatorio de la Agencia Nacional de Seguridad Vial e imprimí el certificado. Si tenés entre 16 y 21 años, además el curso “Mi Primera Licencia” en Mi Argentina.", url: "https://curso.seguridadvial.gob.ar/ansv", label: "Curso ANSV" },
    preguntas: [{ id: "edad", txt: "¿Cuántos años tenés?", ops: [["joven", "16 a 21"], ["64", "22 a 64"], ["65", "65 a 69"], ["70", "70 o más"]] }],
    checklist: [
      { t: "DNI digitalizado con domicilio en La Matanza" },
      { t: "Certificado del curso online de la ANSV" },
      { t: "Certificado del curso “Mi Primera Licencia”", si: [{ edad: ["joven"] }] },
      { t: "Autorización de ambos padres o tutor firmada ante escribano", si: [{ edad: ["joven"] }], n: "solo menores de 17 años" },
      { t: "Declaración Jurada de Salud" },
      { t: "Certificado médico de aptitud física", si: [{ edad: ["70"] }] },
      { t: "Examen psicofísico, teórico y práctico", n: "se rinden en la sede · hay que saber leer y escribir" },
      { t: "Todo con 1 fotocopia" }
    ],
    costo: { porRespuesta: "edad", valores: { "joven": "$22.648", "64": "$22.648", "65": "$21.740", "70": "$21.740" }, etiquetas: { "joven": "hasta 64 años", "64": "hasta 64 años", "65": "65 años o más", "70": "65 años o más" }, desde: "Desde $21.740", nota: "Arancel de la ficha oficial para clases A y B particular." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    avisos: [AV_CANCELAR, AV_45, { tipo: "info", txt: "Embarazadas: hasta las 24 semanas, con certificado del obstetra de embarazo sin riesgo. Insulinodependientes: certificado del médico tratante." }],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email", "Certificado del curso ANSV"] }],
    fuente: F(41)
  },
  {
    id: "licencia-profesional", nombre: "Renovar la licencia profesional", oficial: "Licencia para conducir · Renovación profesional",
    cat: "licencia", mod: "turno",
    resumen: "Taxi, remis, carga o pasajeros · desde $20.923",
    claves: "licencia profesional registro camion taxi remis colectivo carga pasajeros renovar",
    etapas: ["Pedir antecedentes penales", "Sacar turno", "Ir a la sede"],
    pasoPrevio: { txt: "Pedí el certificado de antecedentes penales en el Registro Nacional de Reincidencia (vale 30 días corridos). Es un trámite nacional.", url: "https://www.dnrec.jus.gov.ar/", label: "Turnos DNRec" },
    preguntas: [{ id: "edad", txt: "¿Cuántos años tenés?", ops: [["44", "Hasta 44"], ["45", "45 a 64"], ["65", "65 a 69"], ["70", "70 o más"]] }],
    checklist: [
      { t: "DNI digitalizado con domicilio en La Matanza" },
      { t: "Licencia original anterior" },
      { t: "Certificado de antecedentes penales", n: "vigencia de 30 días corridos" },
      { t: "Declaración Jurada de Salud" },
      { t: "Certificado médico de aptitud física", si: [{ edad: ["70"] }] },
      { t: "Examen teórico y práctico", si: [{ edad: ["65", "70"] }] },
      { t: "Examen psicofísico", n: "se hace en la sede" },
      { t: "Todo con 1 fotocopia" }
    ],
    costo: { porRespuesta: "edad", valores: { "44": "$20.923", "45": "$21.246", "65": "$21.246", "70": "$21.246" }, etiquetas: { "44": "hasta 44 años", "45": "45 años o más", "65": "45 años o más", "70": "45 años o más" }, desde: "Desde $20.923", nota: "Arancel de la ficha oficial." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    avisos: [{ tipo: "info", txt: "Las licencias profesionales que vencen entre el 1º de julio y el 31 de octubre de 2026 tienen una prórroga de 120 días." }, AV_CANCELAR, AV_45],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email", "Clase de licencia"] }],
    fuente: F(41)
  },
  {
    id: "licencia-ampliacion", nombre: "Ampliar la licencia a profesional (C, D o E)", oficial: "Licencia para conducir · Ampliación C, D y E",
    cat: "licencia", mod: "turno",
    resumen: "Entre 21 y 64 años · desde $21.199",
    claves: "ampliacion ampliar clase licencia profesional camion colectivo c d e registro",
    etapas: ["Curso ANSV y antecedentes", "Sacar turno", "Ir a la sede"],
    pasoPrevio: { txt: "Hacé el curso obligatorio de la ANSV y pedí el certificado de antecedentes penales (vale 30 días). Son trámites nacionales.", url: "https://curso.seguridadvial.gob.ar/ansv", label: "Curso ANSV" },
    preguntas: [{ id: "edad", txt: "¿Cuántos años tenés?", ops: [["44", "21 a 44"], ["45", "45 a 64"]] }],
    checklist: [
      { t: "DNI digitalizado con domicilio en La Matanza" },
      { t: "Licencia clase B con al menos 1 año de antigüedad" },
      { t: "Certificado del curso online de la ANSV" },
      { t: "Certificado de antecedentes penales", n: "vigencia de 30 días" },
      { t: "Declaración Jurada de Salud" },
      { t: "Examen psicofísico, teórico y práctico", n: "se rinden en la sede" },
      { t: "Todo con 1 fotocopia" }
    ],
    avisos: [{ tipo: "aviso", txt: "No se aceptan personas con visión monocular. Desde los 65 años solo se puede renovar, no acceder por primera vez." }, AV_CANCELAR, AV_45],
    costo: { porRespuesta: "edad", valores: { "44": "$21.740", "45": "$21.199" }, etiquetas: { "44": "21 a 44 años", "45": "45 años o más" }, desde: "Desde $21.199", nota: "Arancel de la ficha oficial." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email", "Certificados del curso y de antecedentes"] }],
    fuente: F(41)
  },
  {
    id: "licencia-duplicado", nombre: "Sacar un duplicado por robo o pérdida", oficial: "Licencia para conducir · Duplicado",
    cat: "licencia", mod: "turno",
    resumen: "$23.343 · con denuncia de robo o extravío",
    claves: "duplicado perdi robaron licencia registro carnet extravio robo",
    etapas: ["Hacer la denuncia", "Sacar turno", "Ir a la sede"],
    checklist: [
      { t: "DNI digitalizado o constancia de DNI en trámite" },
      { t: "Denuncia de robo o extravío", n: "donde conste tu domicilio en La Matanza" },
      { t: "Declaración Jurada de Salud" },
      { t: "Certificado de legalidad", n: "solo si la licencia es de una comuna fuera de la provincia" },
      { t: "Todo con 1 fotocopia" }
    ],
    costo: { texto: "$23.343", nota: "Arancel de la ficha oficial. Certificado de legalidad: $3.174." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    avisos: [AV_CANCELAR],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email", "Denuncia de robo o extravío"] }],
    fuente: F(41)
  },
  {
    id: "licencia-cambio-datos", nombre: "Cambiar datos o traer mi licencia de otro municipio", oficial: "Licencia para conducir · Reemplazo y cambio de jurisdicción",
    cat: "licencia", mod: "turno",
    resumen: "Hasta 90 días después de mudarte · $20.923",
    claves: "cambio de datos domicilio mudanza otra jurisdiccion otro municipio provincia reemplazo licencia registro",
    etapas: ["Pedir certificado de legalidad", "Sacar turno", "Ir a la sede"],
    preguntas: [{ id: "caso", txt: "¿Qué cambió?", ops: [["datos", "Mis datos o domicilio"], ["juris", "Vengo de otro municipio"]] }],
    checklist: [
      { t: "Licencia original" },
      { t: "DNI con último domicilio en La Matanza" },
      { t: "Declaración Jurada de Salud" },
      { t: "Certificado de legalidad original de la Dirección de Tránsito que la emitió", si: [{ caso: ["juris"] }], n: "no se acepta fax ni fotocopia · vale 30 días" },
      { t: "Examen psicofísico, teórico y práctico", si: [{ caso: ["juris"] }], n: "se rinden en la sede" },
      { t: "Todo con 1 fotocopia" }
    ],
    avisos: [{ tipo: "aviso", txt: "Tenés <b>90 días</b> desde el cambio para hacer el reemplazo. Si no, la licencia caduca y hay que rendir todos los exámenes. Las licencias de otras provincias no se renuevan: el cambio se hace en este municipio." }, AV_CANCELAR],
    costo: { porRespuesta: "caso", valores: { datos: "$20.923", juris: "$20.923" }, etiquetas: { datos: "reemplazo", juris: "reemplazo" }, desde: "$20.923", nota: "Certificado de legalidad por cambio de jurisdicción: $3.565." },
    sedes: ["transito-ramos", "transito-tablada", "transito-catan"],
    acciones: [{ ...TURNERO, pedira: ["DNI", "Email", "Licencia actual"] }],
    fuente: F(41)
  },

  /* ========================== MI AUTO O MOTO ========================== */
  {
    id: "multas", nombre: "Consultar mis multas de tránsito", oficial: "Consulta de infracciones",
    cat: "auto", mod: "online", masBuscado: 1,
    resumen: "Hay que buscar en dos sistemas: el municipal y el provincial",
    claves: "multas infracciones fotomulta transito deuda auto moto libre deuda faltas",
    pasos: ["Buscá por DNI o por dominio en el sistema del municipio.", "Buscá también en el sistema provincial SACIT: ahí están las fotomultas desde mayo de 2017.", "Si necesitás el libre deuda de infracciones, se pide en la Dirección de Faltas ($300)."],
    tenerAMano: ["DNI o dominio (patente) del vehículo"],
    pasoPrevio: { txt: "Las fotomultas y actas digitalizadas están en el sistema de la Provincia de Buenos Aires (SACIT). TuMuni no lo gestiona.", url: "https://www.infraccionesba.gba.gob.ar/", label: "infraccionesba.gba.gob.ar" },
    costo: { texto: "Consultar es gratis. Libre deuda de infracciones: $300." },
    sedes: ["faltas"],
    acciones: [{ label: "Consultar multas del municipio", url: OFICIAL, destino: "consulta de infracciones en lamatanza.gov.ar", tipo: "web", queHace: "La consulta se hace en la web oficial del Municipio.", pedira: ["DNI o dominio del vehículo"] }],
    fuente: OFICIAL
  },
  {
    id: "deuda-patente", nombre: "Consultar la deuda de patente", oficial: "Deuda de Patentes",
    cat: "auto", mod: "online",
    resumen: "Autos y motos con patente municipal",
    claves: "patente deuda auto moto automotor impuesto consultar pagar",
    pasos: ["Tocá “Consultar deuda” para ir a la web del municipio.", "Ingresá el dominio del vehículo.", "Para consultas, escribí a descentralizada.automotor@lamatanza.gov.ar (autos) o descentralizada.moto@gmail.com (motos)."],
    tenerAMano: ["Dominio (patente) del vehículo"],
    costo: { texto: "Consultar es gratis." },
    contacto: "Atención al público: 8:30 a 13 hs",
    acciones: [{ label: "Consultar deuda", url: OFICIAL, destino: "Deuda de Patentes en lamatanza.gov.ar", tipo: "web", queHace: "La consulta se hace en la web oficial del Municipio.", pedira: ["Dominio del vehículo"] }],
    fuente: OFICIAL
  },
  {
    id: "alta-auto", nombre: "Dar de alta la patente de mi auto", oficial: "Automotores · Inscripción o Alta",
    cat: "auto", mod: "distancia", masBuscado: 1,
    resumen: "Se manda por email · modelos 1977 a 2010",
    claves: "alta inscripcion patente auto automotor radicar otra jurisdiccion cambio titular domicilio postal",
    preguntas: [{ id: "caso", txt: "¿Cuál es tu caso?", ops: [["juris", "Viene de otro distrito"], ["tit", "Cambio de titular"], ["dom", "Cambio de domicilio postal"]] }],
    pasos: ["Respondé tu caso y juntá la documentación.", "Mandala por email a altas.automotor@lamatanza.gov.ar.", "Si hay que presentar originales, el alta queda provisoria hasta que los lleves."],
    checklist: [
      { t: "Título de propiedad y cédula", si: [{ caso: ["juris"] }] },
      { t: "Baja en la jurisdicción de origen", si: [{ caso: ["juris"] }] },
      { t: "Última patente paga en el distrito anterior", si: [{ caso: ["juris"] }] },
      { t: "Formulario 13A o 31A", si: [{ caso: ["juris"] }], n: "según corresponda" },
      { t: "Libre deuda de patentes (formulario R-541 si es municipio)", si: [{ caso: ["juris"] }] },
      { t: "Patentes al día", si: [{ caso: ["tit"] }] },
      { t: "Título de propiedad del automotor", si: [{ caso: ["tit"] }] },
      { t: "Fotocopia del título del automotor", si: [{ caso: ["dom"] }] },
      { t: "DNI", si: [{ caso: ["tit", "dom"] }] }
    ],
    plantilla: ["Asunto: Alta de automotor", "Nombre y apellido: ____", "DNI: ____", "Dominio: ____", "Caso: otra jurisdicción / cambio de titular / cambio de domicilio", "Adjunto la documentación solicitada."],
    avisos: [{ tipo: "info", txt: "En el municipio se inscriben los modelos 1977 a 2010." }, { tipo: "info", txt: "Si el auto fue recuperado tras un robo, el trámite es presencial: título, formulario 04 de recupero y disposición judicial de tenencia definitiva." }],
    costo: { texto: null, faltante: "La ficha oficial no informa un costo." },
    acciones: [{ label: "Escribir a altas.automotor", mail: "altas.automotor@lamatanza.gov.ar", asunto: "Alta de automotor", tipo: "email", destino: "altas.automotor@lamatanza.gov.ar", queHace: "Se abre tu email con el mensaje modelo. Completalo, adjuntá la documentación y envialo vos.", pedira: ["Documentación escaneada o en fotos"] }],
    fuente: F(1)
  },
  {
    id: "baja-auto", nombre: "Dar de baja la patente de mi auto", oficial: "Automotores · Baja",
    cat: "auto", mod: "turno",
    resumen: "Por mudanza, robo o destrucción",
    claves: "baja patente auto automotor robo destruccion cambio radicacion mudanza",
    etapas: ["Preparar lo que llevás", "Sacar turno", "Ir a la oficina"],
    preguntas: [{ id: "mot", txt: "¿Por qué das de baja el auto?", ops: [["rad", "Cambio de radicación"], ["robo", "Robo"], ["dest", "Destrucción"]] }],
    checklist: [
      { t: "Título de propiedad o copia certificada por el Registro del Automotor", si: [{ mot: ["rad"] }] },
      { t: "Cédula", si: [{ mot: ["rad"] }] },
      { t: "Formulario TP y/o 02 (certificado de dominio)", si: [{ mot: ["robo", "dest"] }], n: "se pide en el Registro del Automotor" },
      { t: "Formulario TP y/o 04 (constancia de titularidad)", si: [{ mot: ["robo"] }], n: "se pide en el Registro del Automotor" },
      { t: "Denuncia policial", si: [{ mot: ["robo"] }] },
      { t: "Formulario 04D", si: [{ mot: ["dest"] }], n: "se pide en el Registro del Automotor" },
      { t: "DNI" },
      { t: "Original y fotocopia de todo, con letra de imprenta" }
    ],
    avisosPorRespuesta: [{ si: { mot: ["rad"] }, tipo: "info", txt: "Por cambio de radicación, la documentación se envía a descentralizada.automotor@lamatanza.gov.ar." }],
    avisos: [AV_TITULAR, AV_PANDEMIA],
    costo: { texto: null, faltante: "La ficha oficial no informa un costo." },
    sedes: ["descentralizada"],
    acciones: [{ label: "Sacar turno en la web oficial", url: F(2), destino: "ficha oficial de Baja de Automotores", tipo: "turnero", queHace: "Según la ficha oficial, todas las bajas se hacen con turno pedido por la página del municipio.", pedira: ["DNI", "Dominio del vehículo"] }],
    fuente: F(2)
  },
  {
    id: "denuncia-venta", nombre: "Avisar que vendí mi auto", oficial: "Automotores · Denuncia de Venta Impositiva",
    cat: "auto", mod: "presencial",
    resumen: "Para dejar de pagar la patente de un auto vendido",
    claves: "denuncia de venta vendi auto patente sigue llegando comprador no transfirio",
    pasos: ["Hacé la denuncia de venta en el Registro Automotor.", "Juntá la documentación.", "Presentala en Descentralización Tributaria con la deuda paga hasta la fecha de la denuncia."],
    checklist: [
      { t: "Denuncia de venta ante el Registro Automotor" },
      { t: "Carta documento intimando al comprador" },
      { t: "Boleto de compraventa o de responsabilidad civil" },
      { t: "Pago de la deuda hasta la fecha de la denuncia" },
      { t: "DNI" }
    ],
    avisos: [AV_PANDEMIA],
    costo: { texto: null, faltante: "La ficha oficial no informa montos." },
    sedes: ["descentralizada", "noroeste1"],
    contacto: "Consultas: descentralizada.automotor@lamatanza.gov.ar",
    fuente: F(3)
  },
  {
    id: "exencion-discapacidad", nombre: "No pagar patente por discapacidad", oficial: "Exención de Patentes por Discapacidad",
    cat: "auto", mod: "distancia",
    resumen: "Gratis · por email o presencial · 1 a 3 meses",
    claves: "exencion eximicion patente discapacidad cud auto no pagar",
    pasos: ["Completá el Formulario de Solicitud y la Nota de Eximición (en la ficha oficial).", "Escaneá toda la documentación en PDF y enviala por email, o llevala martes o jueves de 9 a 12 a Yrigoyen 2147.", "La resolución dura lo que dure tu CUD: renovala cuando venza."],
    checklist: [
      { t: "Formulario de Solicitud de Eximición y Nota de Eximición" },
      { t: "DNI y CUIT del beneficiario y de quienes van a manejar", n: "con documentación del vínculo" },
      { t: "Título de propiedad del automotor", n: "a nombre de la persona con discapacidad o de un familiar habilitado" },
      { t: "Certificado Único de Discapacidad (CUD)" },
      { t: "Licencia de conducir emitida por La Matanza", n: "del beneficiario o de los autorizados" },
      { t: "Póliza de seguro vigente" }
    ],
    plantilla: ["Asunto: Exención de patente por discapacidad", "Nombre y apellido del beneficiario: ____", "DNI: ____", "Dominio: ____", "Adjunto en PDF la documentación completa."],
    avisos: [{ tipo: "info", txt: "Si vendés el auto, tenés que dar de baja la exención con la nota de Baja de Exención." }],
    costo: { texto: "Gratis. Demora entre 1 y 3 meses." },
    sedes: ["eximiciones-auto"],
    acciones: [{ label: "Enviar por email", mail: "eximicionesautomotor@lamatanza.gov.ar", asunto: "Exención de patente por discapacidad", tipo: "email", destino: "eximicionesautomotor@lamatanza.gov.ar", queHace: "Se abre tu email con el mensaje modelo. Adjuntá la documentación en PDF y envialo vos.", pedira: ["Documentación completa en PDF"] }],
    fuente: F(4)
  },
  {
    id: "exencion-excombatientes", nombre: "No pagar patente siendo ex combatiente", oficial: "Exención Ex Combatientes",
    cat: "auto", mod: "distancia",
    resumen: "Veteranos de Malvinas · por email o presencial",
    claves: "ex combatiente veterano malvinas exencion eximicion patente auto",
    pasos: ["Completá la Nota de Eximición Ex Combatientes (en la ficha oficial).", "Enviá todo en PDF por email, o llevalo martes o jueves de 9 a 12 a Yrigoyen 2147."],
    checklist: [
      { t: "Declaración Jurada de Solicitud (Nota de Eximición)" },
      { t: "DNI" },
      { t: "Certificado de participación en el conflicto avalado por el Ministerio de Defensa" },
      { t: "Certificado de domicilio de la Secretaría Electoral", n: "10 años de residencia en la Provincia" },
      { t: "Título de propiedad a nombre del ex combatiente" },
      { t: "Licencia de conducir emitida por La Matanza" },
      { t: "Póliza de seguro vigente y último pago" }
    ],
    plantilla: ["Asunto: Exención ex combatientes", "Nombre y apellido: ____", "DNI: ____", "Dominio: ____", "Adjunto en PDF la documentación completa."],
    avisos: [{ tipo: "info", txt: "Los certificados tienen 120 días de vigencia, salvo el de Malvinas del Ministerio de Defensa." }],
    costo: { texto: "La ficha oficial no indica costo." },
    sedes: ["eximiciones-auto"],
    acciones: [{ label: "Enviar por email", mail: "eximicionesautomotor@lamatanza.gov.ar", asunto: "Exención ex combatientes", tipo: "email", destino: "eximicionesautomotor@lamatanza.gov.ar", queHace: "Se abre tu email con el mensaje modelo. Adjuntá la documentación en PDF y envialo vos.", pedira: ["Documentación completa en PDF"] }],
    fuente: F(38)
  },
  {
    id: "exencion-entidades", nombre: "Exención de patente para entidades", oficial: "Exención Entidades",
    cat: "auto", mod: "distancia",
    resumen: "Iglesias, mutuales, cooperadoras, ambulancias",
    claves: "exencion eximicion entidad iglesia culto mutual sindicato cooperadora ambulancia partido politico patente",
    pasos: ["Completá la Solicitud y la Nota de Eximición.", "Enviá todo en PDF por email, o llevalo martes o jueves de 9 a 12 a Yrigoyen 2147."],
    checklist: [
      { t: "Formulario de Solicitud y Nota de Eximición" },
      { t: "Libre deuda y último pago" },
      { t: "DNI, CUIT/CUIL y licencia de quienes manejan", n: "con autorización de la entidad" },
      { t: "Póliza de seguro vigente" },
      { t: "Título del vehículo a nombre de la institución" },
      { t: "Estatuto, acta de autoridades y personería jurídica" },
      { t: "Constancia de CUIT de la entidad" }
    ],
    verCompleto: true,
    avisos: [{ tipo: "info", txt: "Hay requisitos extra según el tipo de entidad (cultos, mutuales, partidos políticos). Revisá la lista completa." }],
    costo: { texto: null, faltante: "La ficha oficial no indica sellados ni montos." },
    sedes: ["eximiciones-auto"],
    acciones: [{ label: "Enviar por email", mail: "eximicionesautomotor@lamatanza.gov.ar", asunto: "Exención de entidades", tipo: "email", destino: "eximicionesautomotor@lamatanza.gov.ar", queHace: "Se abre tu email. Adjuntá la documentación en PDF y envialo vos.", pedira: ["Documentación completa en PDF"] }],
    plantilla: ["Asunto: Exención de entidades", "Entidad: ____", "CUIT: ____", "Dominio: ____", "Adjunto en PDF la documentación completa."],
    fuente: F(5)
  },
  {
    id: "baja-eximicion", nombre: "Dar de baja una exención de patente", oficial: "Baja de Eximición",
    cat: "auto", mod: "presencial",
    resumen: "Si vendiste el auto o falleció el titular",
    claves: "baja eximicion exencion patente vendi fallecio",
    pasos: ["Completá la nota modelo (en la ficha oficial).", "Llevá todo en original y copia, martes o jueves de 9 a 12."],
    checklist: [
      { t: "Nota modelo de pedido" },
      { t: "DNI" },
      { t: "Acreditación de representación", n: "si lo presenta otra persona" },
      { t: "Resolución que otorgó la exención" },
      { t: "Acta de defunción", n: "si falleció el titular" },
      { t: "Boleto de compraventa, denuncia de venta o informe de dominio", n: "si se vendió el auto" }
    ],
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sedes: ["eximiciones-auto"],
    fuente: F(39)
  },
  {
    id: "devolucion-pago", nombre: "Pedir la devolución de un pago de patente", oficial: "Devolución por pago erróneo o duplicidad",
    cat: "auto", mod: "presencial",
    resumen: "Si pagaste dos veces o después de la baja",
    claves: "devolucion pago duplicado erroneo patente pague dos veces reintegro",
    preguntas: [{ id: "tipo", txt: "¿Qué pasó?", ops: [["dup", "Pagué dos veces la misma cuota"], ["err", "Pagué después de la baja"]] }],
    pasos: ["Respondé qué pasó.", "Pago duplicado: mandá los comprobantes por email y el pago se pasa al próximo período con deuda.", "Pago erróneo: se inicia un expediente en Mesa de Entradas, con sellado."],
    checklist: [
      { t: "Comprobantes de los dos pagos", si: [{ tipo: ["dup"] }] },
      { t: "Nota modelo de pedido", si: [{ tipo: ["err"] }] },
      { t: "DNI del titular", si: [{ tipo: ["err"] }] },
      { t: "Recibos de los pagos a devolver", si: [{ tipo: ["err"] }] },
      { t: "Título de propiedad del vehículo", si: [{ tipo: ["err"] }] },
      { t: "Constancia de alta en la nueva jurisdicción", si: [{ tipo: ["err"] }] },
      { t: "Deuda generada en la nueva jurisdicción por esos períodos", si: [{ tipo: ["err"] }] }
    ],
    avisosPorRespuesta: [{ si: { tipo: ["dup"] }, tipo: "aviso", txt: "Email de consultas: eximiciones.automotor@gmail.com. Ojo: el link de la ficha oficial dice “automoto” sin la r. Confirmá la dirección antes de enviar." }],
    costo: { texto: null, faltante: "Pago erróneo: hay que pagar un sellado, pero el municipio no informa el monto." },
    sedes: ["mesa-entradas", "descentralizada"],
    fuente: F(36)
  },
  {
    id: "condonacion-escolar", nombre: "Condonación de patente para transporte escolar", oficial: "Condonación transporte escolar 2020 y 2021",
    cat: "auto", mod: "presencial", incompleto: true,
    resumen: "Deudas 2020 y 2021 · vigencia a confirmar",
    claves: "condonacion transporte escolar combi deuda patente 2020 2021",
    pasos: ["Confirmá al 4651-0101 que el beneficio siga vigente.", "Llevá la documentación con la nota modelo, de 9 a 12."],
    checklist: [
      { t: "Póliza de seguro al día" }, { t: "VTV vigente" }, { t: "Habilitación del Municipio de La Matanza" },
      { t: "Título del vehículo" }, { t: "DNI del titular" }, { t: "Nota de pedido (modelo en la ficha oficial)" }
    ],
    avisos: [{ tipo: "aviso", txt: "No tenés que tener deuda anterior a 2020. El beneficio es de la Ordenanza 26.210/21 y la web no aclara si sigue vigente." }],
    costo: { texto: "Sin costo: el beneficio es la condonación de la deuda." },
    sedes: ["descentralizada"],
    fuente: F(37)
  },
  {
    id: "alta-moto", nombre: "Dar de alta la patente de mi moto", oficial: "Motos · Alta de Patentes",
    cat: "auto", mod: "distancia",
    resumen: "Se inicia por email; después llevás originales",
    claves: "moto motos patente alta compre nueva patentar radicar",
    pasos: ["Copiá el mensaje modelo y completalo.", "Envialo a descentralizada.moto@gmail.com con los adjuntos.", "Si te lo piden, presentá los originales en San Justo."],
    checklist: [
      { t: "Título de propiedad con radicación en el partido" },
      { t: "Constancia de baja de la patente del lugar de origen", n: "si viene de otro distrito" },
      { t: "DNI del titular" }
    ],
    plantilla: ["Asunto: Alta de patente de moto", "Nombre y apellido: ____", "DNI: ____", "Teléfono: ____", "Dominio de la moto: ____", "Adjunto título, constancia de baja y DNI."],
    avisos: [{ tipo: "info", txt: "Si el agente lo pide, tenés que presentar informe histórico y/o certificado de fábrica, en original y fotocopia." }, AV_TITULAR],
    costo: { texto: null, faltante: "La ficha oficial no informa un costo." },
    sedes: ["descentralizada"],
    acciones: [{ label: "Escribir a Motos", mail: "descentralizada.moto@gmail.com", asunto: "Alta de patente de moto", tipo: "email", destino: "descentralizada.moto@gmail.com", queHace: "Se abre tu email con el mensaje modelo. Adjuntá los documentos y envialo vos.", pedira: ["Fotos del título, constancia de baja y DNI"] }],
    fuente: F(6)
  },
  {
    id: "baja-moto", nombre: "Dar de baja la patente de mi moto", oficial: "Motos · Baja de Patentes",
    cat: "auto", mod: "presencial",
    resumen: "Robo o destrucción: presencial sin turno",
    claves: "baja moto patente robo destruccion",
    preguntas: [{ id: "mot", txt: "¿Por qué das de baja la moto?", ops: [["robo", "Robo o destrucción"], ["otro", "Otro motivo"]] }],
    pasos: ["Robo o destrucción: andá sin turno a San Justo.", "Otros casos: consultá por email a descentralizada.moto@gmail.com."],
    checklist: [
      { t: "Patentes sin deuda" },
      { t: "Título de propiedad con la transferencia a otro partido", si: [{ mot: ["otro"] }] },
      { t: "Denuncia policial", si: [{ mot: ["robo"] }] },
      { t: "Formulario 04 de baja del Registro Automotor", si: [{ mot: ["robo"] }] },
      { t: "DNI" },
      { t: "Original y fotocopia de todo, con letra de imprenta" }
    ],
    avisos: [AV_TITULAR, AV_PANDEMIA],
    costo: { texto: null, faltante: "La ficha oficial no informa un costo." },
    sedes: ["descentralizada", "noroeste1"],
    fuente: F(7)
  },
  {
    id: "deuda-moto", nombre: "Pedir el certificado de deuda de mi moto", oficial: "Motos · Certificado de Estado de Deuda",
    cat: "auto", mod: "presencial",
    resumen: "Presencial con DNI y cédula o título",
    claves: "certificado estado de deuda moto libre deuda patente vender",
    pasos: ["Llevá DNI y cédula o título.", "Pedí el certificado en ventanilla."],
    checklist: [{ t: "DNI" }, { t: "Cédula o título del rodado" }, { t: "Original y fotocopia, con letra de imprenta" }],
    avisos: [AV_TITULAR],
    costo: { texto: null, faltante: "La ficha oficial no informa un costo." },
    sedes: ["descentralizada", "noroeste1"],
    fuente: F(8)
  },

  /* ============================ MI COMERCIO ============================ */
  {
    id: "habilitar-comercio", nombre: "Habilitar un comercio", oficial: "Comercios · Habilitación",
    cat: "comercio", mod: "online", masBuscado: 1,
    resumen: "Online · asesoramiento presencial gratuito",
    claves: "habilitar habilitacion comercio local negocio abrir rubro alimentos kiosco pasteleria almacen",
    preguntas: [
      { id: "rubro", txt: "¿Vendés o elaborás alimentos?", ops: [["no", "No"], ["si", "Sí"]] },
      { id: "alc", txt: "¿Vas a vender bebidas alcohólicas?", ops: [["no", "No"], ["si", "Sí"]] },
      { id: "m2", txt: "¿Es un rubro básico de hasta 70 m²?", ops: [["si", "Sí"], ["no", "No / no sé"]] }
    ],
    pasos: ["Antes de alquilar, consultá en Planeamiento si la zona es apta para tu rubro.", "Prepará la documentación (te ayudan a completar los formularios en Perú 2250, 4º piso).", "Iniciá la habilitación online."],
    checklist: [
      { t: "DNI frente y dorso", n: "extranjeros: residencia vigente · sociedades: DNI de la máxima autoridad, estatuto y acta" },
      { t: "Certificado RDAM (deudores alimentarios)", n: "gratis en rdam.mjus.gba.gob.ar" },
      { t: "Escritura certificada, comodato (3 años) o alquiler (36 meses)", n: "con rubro declarado y sellado" },
      { t: "Libre deuda de ABL y contrato certificado en Catastro" },
      { t: "Plano de obra o croquis de un profesional matriculado", si: [{ m2: ["no"] }] },
      { t: "Formulario F15 firmado por propietario y titular", si: [{ m2: ["si"] }], n: "reemplaza al croquis" },
      { t: "Troquel de matafuegos vigente o factura de recarga", n: "ABC de 5 kg" },
      { t: "Inscripción en AFIP y ARBA con la actividad y el domicilio del local" },
      { t: "Análisis de agua", si: [{ rubro: ["si"] }], n: "en Mesa de Entradas, Perú 2250 PB" },
      { t: "Curso de manipulación de alimentos", si: [{ rubro: ["si"] }] },
      { t: "Factura de desinfección de empresa habilitada en La Matanza", si: [{ rubro: ["si"] }] },
      { t: "Permiso REBA de bebidas alcohólicas", si: [{ alc: ["si"] }], n: "por email a reba@lamatanza.gov.ar, con el Nº de expediente" }
    ],
    verCompleto: true,
    avisos: [
      { tipo: "aviso", txt: "<b>Consultá la zonificación antes de alquilar:</b> Dirección de Planeamiento, Yrigoyen 2746, tel. 4651-0014 int. 113." },
      { tipo: "info", txt: "Si el local es parte de un edificio, sumá el reglamento de copropiedad que permita la actividad. Rubros no básicos: requisitos específicos." }
    ],
    costo: { texto: null, faltante: "El municipio no informa montos: los derechos se calculan con la planilla de liquidación." },
    sedes: ["habilitaciones", "planeamiento"],
    acciones: [{ label: "Iniciar la habilitación online", url: F(17), destino: "lamatanza.gov.ar · Habilitación de comercios", tipo: "web", queHace: "La habilitación se inicia en la web del Municipio. Ahí están los formularios para descargar.", pedira: ["Documentación en digital", "Formularios completos"] }],
    fuente: F(17)
  },
  {
    id: "rubros", nombre: "Saber si mi rubro tiene requisitos extra", oficial: "Clasificación de Rubros",
    cat: "comercio", mod: "online",
    resumen: "Rubros básicos, con autorización especial o con ordenanza",
    claves: "rubro clasificacion requisitos especiales quiniela armeria escuela peluqueria restaurante gimnasio",
    pasos: ["Abrí el listado oficial de rubros.", "Fijate si tu rubro es básico, necesita autorización de otro organismo o tiene ordenanza propia."],
    tenerAMano: ["El nombre de tu rubro o actividad"],
    avisos: [{ tipo: "info", txt: "Ejemplos: lotería y quiniela piden certificado de Lotería; armerías, autorización del RENAR; escuelas, de la DIEGEP. Kioscos, carnicerías, panaderías y verdulerías son rubros básicos." }],
    costo: { texto: "Consultar es gratis." },
    acciones: [{ label: "Ver el listado de rubros", url: F(22), destino: "lamatanza.gov.ar · Clasificación de Rubros", tipo: "fuente", queHace: "Vas a ver la lista oficial de rubros y sus requisitos.", pedira: [] }],
    fuente: F(22)
  },
  {
    id: "seguridad-higiene", nombre: "Pagar Seguridad e Higiene", oficial: "Tasa por Inspección de Seguridad e Higiene",
    cat: "comercio", mod: "online",
    resumen: "En el Portal del Contribuyente",
    claves: "seguridad higiene comercio tasa pagar portal contribuyente declaracion jurada",
    pasos: ["Entrá al Portal del Contribuyente.", "Ingresá con tus datos de contribuyente.", "Consultá y pagá desde el portal."],
    tenerAMano: ["CUIT del comercio", "Clave del Portal del Contribuyente"],
    costo: { texto: "Depende de tu comercio: lo informa el portal." },
    acciones: [{ label: "Ir al Portal del Contribuyente", url: "https://portalcontribuyente.lamatanza.gov.ar/", destino: "portalcontribuyente.lamatanza.gov.ar", tipo: "web", queHace: "El pago se hace en el portal oficial del Municipio.", pedira: ["CUIT", "Clave del portal"] }],
    fuente: "https://portalcontribuyente.lamatanza.gov.ar/"
  },
  {
    id: "publicidad", nombre: "Pagar Publicidad y Propaganda", oficial: "Derechos de Publicidad y Propaganda",
    cat: "comercio", mod: "online",
    resumen: "Carteles del comercio · Portal del Contribuyente",
    claves: "publicidad propaganda cartel marquesina comercio portal contribuyente",
    pasos: ["Entrá al Portal del Contribuyente.", "Buscá Publicidad y Propaganda.", "Consultá deuda y facturación."],
    tenerAMano: ["CUIT del comercio", "Clave del Portal del Contribuyente"],
    costo: { texto: "Depende de tu comercio: lo informa el portal." },
    acciones: [{ label: "Ir al Portal del Contribuyente", url: "https://portalcontribuyente.lamatanza.gov.ar/", destino: "portalcontribuyente.lamatanza.gov.ar", tipo: "web", queHace: "La consulta se hace en el portal oficial del Municipio.", pedira: ["CUIT", "Clave del portal"] }],
    fuente: "https://portalcontribuyente.lamatanza.gov.ar/"
  },
  {
    id: "modificar-rubro", nombre: "Cambiar o agregar un rubro", oficial: "Comercios · Modificación de Rubros",
    cat: "comercio", mod: "presencial",
    resumen: "Necesitás el certificado de funcionamiento anterior",
    claves: "modificacion cambio rubro agregar actividad comercio",
    preguntas: [{ id: "tam", txt: "¿Qué tipo de contribuyente sos?", ops: [["peq", "Pequeño"], ["med", "Mediano o grande"]] }],
    pasos: ["Consultá la zonificación en Planeamiento.", "Juntá la documentación y los formularios (F03 y Solicitud de Modificación).", "Presentalo en la oficina que te corresponde."],
    checklist: [
      { t: "Certificado de funcionamiento del rubro anterior", n: "sin este no se puede iniciar" },
      { t: "DNI frente y dorso" },
      { t: "Certificado RDAM" },
      { t: "Escritura, comodato o alquiler, con contrato certificado en Catastro" },
      { t: "Libre deuda de ABL", n: "turno por email a otras.tasas@gmail.com" },
      { t: "Plano, croquis o formulario F15 (rubros básicos hasta 70 m²)" },
      { t: "Troquel de matafuegos vigente" },
      { t: "Inscripción en AFIP y ARBA con la nueva actividad" },
      { t: "Análisis de agua, curso de manipulación y desinfección", n: "solo rubro alimenticio" }
    ],
    verCompleto: true,
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sedes: ["pequenos", "medianos"],
    sedesPorRespuesta: { tam: { peq: ["pequenos"], med: ["medianos"] } },
    fuente: F(23)
  },
  {
    id: "traslado-comercio", nombre: "Mudar mi comercio", oficial: "Comercios · Traslado",
    cat: "comercio", mod: "presencial",
    resumen: "A no más de 700 metros del local actual",
    claves: "traslado mudar mudanza comercio local nuevo domicilio",
    pasos: ["Consultá en Planeamiento si la nueva zona es apta.", "Certificá el contrato del nuevo local en Catastro.", "Presentá todo en Habilitaciones."],
    checklist: [
      { t: "DNI frente y dorso" },
      { t: "Certificado RDAM" },
      { t: "Escritura, comodato o alquiler del nuevo local, certificado en Catastro" },
      { t: "Libre deuda de ABL", n: "turno por email a otras.tasas@gmail.com" },
      { t: "Plano, croquis o formulario F15" },
      { t: "Troquel de matafuegos vigente" },
      { t: "Inscripción en AFIP y ARBA con el nuevo domicilio" },
      { t: "Copia del inicio de habilitación o permiso definitivo", n: "certificada por Mesa de Entradas" },
      { t: "Mapa con el local actual y el nuevo", n: "la distancia no puede superar 700 m" },
      { t: "Análisis de agua, curso de manipulación y desinfección", n: "solo rubro alimenticio" }
    ],
    verCompleto: true,
    costo: { texto: null, faltante: "La ficha oficial no informa montos." },
    sedes: ["habilitaciones", "catastro", "planeamiento"],
    fuente: F(20)
  },
  {
    id: "baja-pequenos", nombre: "Cerrar mi comercio (pequeño contribuyente)", oficial: "Comercios · Baja a Pequeños Contribuyentes",
    cat: "comercio", mod: "presencial",
    resumen: "Sellado de baja $7.045",
    claves: "baja cerrar cierre comercio local pequeno contribuyente",
    pasos: ["Pedí el recibo del sellado en el Banco de Cuentas y pagalo en caja.", "Anulá el libro de inspecciones (turno por email a despacho.controlurbano@lamatanza.gov.ar).", "Presentá el formulario 22 con la documentación."],
    checklist: [
      { t: "Sellado de baja pagado", n: "$7.045 · con autorización de gestor $9.365" },
      { t: "Formulario 22 completo", n: "se firma frente al agente" },
      { t: "DNI", n: "original y copia" },
      { t: "Libro de inspecciones, tarjeta de expediente y certificados anulados", n: "Perú 2250, 4º piso" },
      { t: "Libre deuda de Publicidad y Propaganda", n: "Perú 2250, 2º piso" },
      { t: "Copia del recibo de ABL" },
      { t: "Copia del contrato de ubicación" }
    ],
    avisos: [{ tipo: "info", txt: "Si cerraste hace tiempo, existe la baja retroactiva con el formulario 31." }],
    costo: { texto: "$7.045", nota: "Sellado con autorización de gestor: $9.365." },
    sedes: ["pequenos", "control-comunal"],
    fuente: F(18)
  },
  {
    id: "baja-medianos", nombre: "Cerrar mi comercio (mediano o grande)", oficial: "Comercios · Baja a Medianos y Grandes Contribuyentes",
    cat: "comercio", mod: "turno",
    resumen: "Turno y formularios por email",
    claves: "baja cerrar cierre comercio industria mediano grande contribuyente",
    etapas: ["Pedir turno por email", "Preparar documentación", "Presentar"],
    pasos: ["Constituí el domicilio fiscal electrónico.", "Pedí el formulario F-23 o F-31 y el turno por email.", "Presentá la documentación sin deuda en la partida."],
    checklist: [
      { t: "Formulario F-23 (baja común) o F-31 (baja retroactiva)", n: "firma certificada por banco o escribano" },
      { t: "Sellado pagado" },
      { t: "DNI original y copia", n: "sociedades: contrato social y poder" },
      { t: "Copia certificada de la primera hoja del libro municipal" },
      { t: "Constancia de anulación del libro", n: "Control Urbano o Dirección de Industria" },
      { t: "Certificado de funcionamiento" },
      { t: "Declaraciones juradas en el portal tributario hasta la fecha de cese" }
    ],
    avisos: [{ tipo: "aviso", txt: "La partida no puede tener deuda a la fecha." }],
    costo: { texto: null, faltante: "La ficha oficial no informa el monto del sellado." },
    sedes: ["medianos"],
    acciones: [{ label: "Pedir turno por email", mail: "Garrua@lamatanza.gov.ar", asunto: "Baja de comercio - pedido de turno y formulario", tipo: "email", destino: "Garrua@lamatanza.gov.ar", queHace: "Se abre tu email para pedir el formulario de baja y el turno.", pedira: ["Razón social", "CUIT y partida"] }],
    plantilla: ["Asunto: Baja de comercio - pedido de turno", "Razón social: ____", "CUIT: ____", "Partida: ____", "Tipo de baja: común / retroactiva", "Solicito formulario de baja y turno."],
    fuente: F(19)
  },
  {
    id: "bebidas-alcoholicas", nombre: "Renovar el permiso para vender alcohol", oficial: "Ventas de Bebidas Alcohólicas (REBA)",
    cat: "comercio", mod: "presencial",
    resumen: "Licencia provincial anual · renovar 60 días antes",
    claves: "bebidas alcoholicas alcohol reba licencia vender cerveza vino bar",
    preguntas: [{ id: "cat", txt: "¿Qué tipo de comercio es?", ops: [["B1", "Venta general"], ["C1", "Restaurante o parrilla"], ["C2", "Bar o cervecería"]] }],
    pasos: ["Presentá la documentación en Fiscalización.", "Retirá la boleta en Control Comunal (Perú 2250, 4º piso) y pagala en Banco Provincia.", "Volvé con el comprobante y te dan la licencia nueva."],
    checklist: [
      { t: "Licencia REBA original", n: "o denuncia de extravío del Registro Civil" },
      { t: "DNI original y copia" },
      { t: "Permiso de funcionamiento definitivo del comercio" },
      { t: "Libre deuda", n: "se pide en Perú 2250" },
      { t: "Estatuto y acta de autoridades", n: "solo personas jurídicas" },
      { t: "Certificado antisiniestral y troqueles de matafuegos", si: [{ cat: ["C2"] }], n: "bares con espectáculos" }
    ],
    avisos: [{ tipo: "info", txt: "La licencia dura un año. Pedí la renovación al menos 60 días antes del vencimiento. Primera vez: se pide al habilitar el comercio." }],
    costo: { porRespuesta: "cat", valores: { B1: "$750", C1: "$1.000", C2: "$2.250" }, etiquetas: { B1: "canon anual B1", C1: "canon anual C1", C2: "canon anual C2" }, desde: "Desde $750 por año", nota: "Canon anual de la ficha oficial. Distribuidores (A): $3.500 · bailables (C3): $7.500." },
    sedes: ["control-comunal"],
    contacto: "Línea gratuita ReBA: 0-800-222-7322",
    fuente: F(24)
  },
  {
    id: "transferencia-partida", nombre: "Comprar o vender un comercio habilitado", oficial: "Comercios · Transferencia de Partida",
    cat: "comercio", mod: "presencial",
    resumen: "Pasar la habilitación al nuevo dueño",
    claves: "transferencia partida comprar vender fondo de comercio habilitacion nuevo dueno",
    pasos: ["Completá los formularios F29 (por triplicado), F03 y F29/1.", "Juntá la documentación de comprador y vendedor.", "Presentá todo en Habilitaciones."],
    checklist: [
      { t: "Formulario F29 por triplicado, F03 y F29/1" },
      { t: "Planilla de inspección y formulario de contacto" },
      { t: "DNI de comprador y vendedor", n: "original y copia" },
      { t: "Certificado RDAM" },
      { t: "Titularidad del local de comprador y vendedor", n: "escritura, comodato o alquiler" },
      { t: "Plano de obra o croquis" },
      { t: "Inscripción en AFIP y ARBA del comprador" },
      { t: "Permiso de funcionamiento definitivo y primera hoja del libro de inspecciones" },
      { t: "Declaraciones juradas anuales de los últimos 5 años" }
    ],
    verCompleto: true,
    costo: { texto: null, faltante: "La ficha oficial no informa montos." },
    sedes: ["habilitaciones"],
    fuente: F(25)
  },
  {
    id: "descargo-acta", nombre: "Presentar un descargo por un acta de verificación", oficial: "Descargos contra acta de verificación",
    cat: "comercio", mod: "presencial",
    resumen: "Sellado $218 + $74",
    claves: "descargo acta verificacion inspeccion multa comercio reclamo recurso",
    pasos: ["Llevá la nota y la documentación al Sector Recursos para que la visen.", "Pagá los sellados.", "Presentá en Mesa de Entradas: ahí se forma el expediente."],
    checklist: [
      { t: "Nota a la Directora de Fiscalización", n: "nombre, CUIT, partida, Nº de acta y agravios, firmada" },
      { t: "Fotocopia del DNI del titular" },
      { t: "Fotocopia de la cédula de notificación (frente y dorso)" },
      { t: "Documentación pedida en la verificación", n: "original y copia" },
      { t: "Acuse del Domicilio Fiscal Electrónico" },
      { t: "Poder y DNI del apoderado", n: "si corresponde" }
    ],
    avisos: [{ tipo: "aviso", txt: "Tenés que haber declarado y pagado los períodos posteriores al reclamo." }],
    costo: { texto: "$218 + $74", nota: "Sellado en la nota más hoja en blanco. Apoderado: $74 adicionales." },
    sedes: ["recursos"],
    fuente: F(26)
  },

  /* ======================= SALUD Y DISCAPACIDAD ======================= */
  {
    id: "cud", nombre: "Pedir el Certificado Único de Discapacidad", oficial: "CUD · Junta Evaluadora",
    cat: "salud", mod: "distancia", masBuscado: 1,
    resumen: "Se inicia por WhatsApp o email",
    claves: "cud certificado discapacidad unico junta evaluadora renovar",
    preguntas: [{ id: "vez", txt: "¿Es la primera vez?", ops: [["1", "Primera vez"], ["ren", "Renovación o vencido"]] }],
    pasos: ["Completá el mensaje con tus datos.", "Mandalo por un solo canal: WhatsApp o email.", "La Junta Evaluadora responde por orden de llegada y te manda los formularios médicos."],
    plantilla: ["Nombre y apellido: ____", "DNI: ____", "Edad: ____", "Localidad: ____", "Discapacidad a certificar: ____", "Primera vez / Renovación: ____"],
    checklistTitulo: "Qué tener listo",
    checklist: [
      { t: "Los datos del mensaje modelo" },
      { t: "Foto legible del CUD actual", si: [{ vez: ["ren"] }] }
    ],
    avisos: [{ tipo: "aviso", txt: "Por WhatsApp, <b>solo mensajes de texto</b>. No se aceptan llamadas, audios ni PDF." }, { tipo: "info", txt: "El CUD no está vinculado a pensiones: esas se tramitan en ANSES." }],
    pasoPrevio: { txt: "Una vez otorgado, podés tener el CUD digital en Mi Argentina (trámite nacional).", url: "https://www.argentina.gob.ar/miargentina", label: "Mi Argentina" },
    costo: { texto: "Sin costo." },
    acciones: [
      { label: "Abrir WhatsApp oficial", wa: "5491155735327", tipo: "whatsapp", destino: "WhatsApp oficial · 11 5573-5327", queHace: "Se abre WhatsApp con el mensaje modelo. Completá tus datos y envialo vos. También existe el 11 3335-4609.", pedira: ["Tus datos en un solo mensaje de texto"] },
      { label: "Enviar por email", mail: "juntadiscapacidadmatanza@hotmail.com", asunto: "Solicitud de CUD", tipo: "email", destino: "juntadiscapacidadmatanza@hotmail.com", queHace: "Se abre tu email con el mensaje modelo. Completalo y envialo vos.", pedira: ["Tus datos", "Foto del CUD si es renovación"] }
    ],
    fuente: F(16)
  },
  {
    id: "pases-libres", nombre: "Pedir el pase libre de colectivo", oficial: "Pases Libres de Transporte",
    cat: "salud", mod: "presencial",
    resumen: "Requisitos según la línea",
    claves: "pase libre colectivo transporte discapacidad boleto gratis",
    preguntas: [{ id: "linea", txt: "¿Qué línea de colectivo usás?", ops: [["1", "Líneas 1 a 199"], ["200", "Líneas 200 a 499"], ["620", "Línea 620"]] }],
    pasos: ["Respondé qué línea usás.", "Juntá la documentación.", "Presentala en el horario de atención."],
    checklist: [
      { t: "CUD digital de Mi Argentina", si: [{ linea: ["1"] }], n: "captura de las dos fotos de “Ver credencial”" },
      { t: "CUD", si: [{ linea: ["200", "620"] }], n: "original y copia" },
      { t: "DNI del titular", si: [{ linea: ["200"] }], n: "original y copia" },
      { t: "DNI del titular con domicilio en La Matanza", si: [{ linea: ["620"] }], n: "original y copia" },
      { t: "Pase vencido", si: [{ linea: ["200"] }], n: "si lo perdiste: denuncia de extravío en el Registro Civil" },
      { t: "Una foto 4x4", si: [{ linea: ["620"] }] },
      { t: "DNI del acompañante con domicilio en La Matanza", si: [{ linea: ["620"] }], n: "si el CUD dice “Acompañante SI” · mayor de 18 y menor de 80" }
    ],
    avisos: [{ tipo: "aviso", txt: "La ficha oficial menciona tres sedes pero publica una sola, en Capital Federal. Confirmá al 4349-7135 antes de viajar." }],
    costo: { texto: "Sin costo." },
    sedes: ["pases-caba"],
    fuente: F(11)
  },
  {
    id: "pension-discapacidad", nombre: "Pedir la pensión por discapacidad", oficial: "Pensiones Nacionales no Contributivas",
    cat: "salud", mod: "presencial",
    resumen: "El municipio hace el Certificado Médico Oficial",
    claves: "pension discapacidad no contributiva anses cmo certificado medico oficial invalidez",
    pasoPrevio: { txt: "El alta del expediente se hace en ANSES (turno web o Mi ANSES). Es un trámite nacional: el municipio solo hace el Certificado Médico Oficial (CMO).", url: "https://www.anses.gob.ar/", label: "ANSES" },
    pasos: ["Sacá el Certificado Médico Oficial (CMO) en la C.A.P. de tu zona o en un hospital público.", "Con el CMO, iniciá el expediente en ANSES.", "Esperá la respuesta de ANSES."],
    checklist: [
      { t: "DNI", n: "original y copia" },
      { t: "Email y teléfono de contacto" },
      { t: "Negativa de ANSES" },
      { t: "Diagnóstico actualizado con firma y sello legibles" },
      { t: "Estudios que acrediten la discapacidad", n: "de no más de 6 meses" }
    ],
    avisos: [{ tipo: "info", txt: "Requisitos: menos de 64 años, no cobrar jubilación ni pensión, no tener empleo registrado (se admite monotributo social) y no tener ingresos suficientes." }],
    costo: { texto: "La ficha oficial no informa costos." },
    sedes: ["cap-mirador", "cap-laferrere", "cap-catan"],
    fuente: F(12)
  },
  {
    id: "pension-provincial", nombre: "Pensiones sociales provinciales", oficial: "Pensiones Sociales Provinciales",
    cat: "salud", mod: "presencial", incompleto: true,
    resumen: "La web no publica requisitos",
    claves: "pension social provincial",
    pasos: ["Llamá al 4651-0101 para que te indiquen requisitos y oficina."],
    checklist: [{ t: "DNI", n: "original y copia" }],
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sinSede: "La ficha oficial está vacía: no informa oficina ni horario.",
    fuente: F(13)
  },
  {
    id: "curatela", nombre: "Información para tramitar una curatela", oficial: "Información para Tramitar la Curatela",
    cat: "salud", mod: "presencial", incompleto: true,
    resumen: "Lo orienta la Defensoría General",
    claves: "curatela curador insania capacidad juez defensoria",
    pasos: ["Consultá en la Defensoría General del Departamento Judicial de La Matanza.", "Ellos te indican los pasos y la documentación."],
    checklist: [{ t: "DNI de la persona y del familiar", n: "original y copia" }],
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sedes: ["defensoria-sj", "defensoria-laf"],
    fuente: F(14)
  },
  {
    id: "silla-ruedas", nombre: "Pedir una silla de ruedas", oficial: "Silla de Ruedas",
    cat: "salud", mod: "presencial", incompleto: true,
    resumen: "Secretaría de Desarrollo Social",
    claves: "silla de ruedas ortopedia discapacidad prestamo",
    pasos: ["Llamá al 4651-0101 para confirmar requisitos.", "Acercate a la Secretaría de Desarrollo Social."],
    checklist: [{ t: "DNI", n: "original y copia" }, { t: "CUD, si lo tenés" }],
    costo: { texto: null, faltante: "La ficha oficial no informa costos." },
    sedes: ["desarrollo-social"],
    fuente: F(15)
  },
  {
    id: "libreta-sanitaria", nombre: "Sacar la libreta sanitaria", oficial: "Libreta Sanitaria",
    cat: "salud", mod: "presencial", estado: "suspendido",
    resumen: "Suspendido según la web oficial",
    claves: "libreta sanitaria manipulacion alimentos salud carnet sanitario",
    pasos: [], costo: { texto: null }, fuente: F(27)
  },

  /* ======================= RECLAMOS Y DENUNCIAS ======================= */
  {
    id: "reclamo-147", nombre: "Hacer un reclamo (baches, luminarias, basura)", oficial: "147 · Atención Ciudadana",
    cat: "reclamos", mod: "distancia", masBuscado: 1,
    resumen: "Por teléfono al 147",
    claves: "reclamo bache luminaria luz basura arbol 147 atencion ciudadana queja calle",
    pasos: ["Anotá la dirección exacta y qué pasa.", "Llamá al 147.", "Pedí y guardá el número de reclamo."],
    plantilla: ["Dirección: ____ (entre calles ____)", "Localidad: ____", "Qué pasa: ____", "Desde cuándo: ____"],
    avisos: [{ tipo: "info", txt: "La web oficial no tiene sección de reclamos online: el canal es el 147." }],
    costo: { texto: "Llamada gratuita." },
    acciones: [{ label: "Llamar al 147", url: "tel:147", destino: "147 · Atención Ciudadana", tipo: "tel", queHace: "Vas a llamar a la línea oficial de Atención Ciudadana.", pedira: ["Dirección exacta", "Qué pasa"] }],
    fuente: OFICIAL
  },
  {
    id: "defensa-consumidor", nombre: "Reclamar como consumidor", oficial: "Defensa del Consumidor (OMIC)",
    cat: "reclamos", mod: "presencial",
    resumen: "Gratis y sin abogado · Perú 2250 PB",
    claves: "defensa consumidor estafa garantia compra empresa reclamo factura servicio omic",
    pasos: ["Juntá la documentación de la compra o servicio.", "Llevá el formulario impreso (o pedilo en la oficina).", "La oficina puede citar a la empresa a una audiencia para llegar a un acuerdo."],
    checklist: [
      { t: "DNI" }, { t: "Factura o ticket" }, { t: "Certificado de garantía", n: "si hay" },
      { t: "Presupuesto y orden de reparación", n: "si hay" }, { t: "Resumen de cuenta", n: "si es un cobro" },
      { t: "Contrato o solicitud de suscripción" }, { t: "Carta documento", n: "si mandaste" },
      { t: "Número de reclamo ante la empresa y emails" }
    ],
    costo: { texto: "Gratis. No necesitás abogado." },
    sedes: ["consumidor"],
    contacto: "Asesoramiento por email: Consumidores@lamatanza.gov.ar",
    acciones: [{ label: "Consultar por email", mail: "Consumidores@lamatanza.gov.ar", asunto: "Consulta Defensa del Consumidor", tipo: "email", destino: "Consumidores@lamatanza.gov.ar", queHace: "Se abre tu email para hacer una consulta de asesoramiento.", pedira: ["Tu consulta", "Datos de la empresa"] }],
    plantilla: ["Nombre y apellido: ____", "DNI: ____", "Empresa: ____", "Qué pasó: ____", "Qué pedís: ____"],
    fuente: "https://www.lamatanza.gov.ar/defensa-consumidor"
  },
  {
    id: "mtz-denuncias", nombre: "Denunciar un ilícito", oficial: "MTZ Denuncias",
    cat: "reclamos", mod: "distancia",
    resumen: "Canal oficial de denuncias del municipio",
    claves: "denuncia ilicito delito robo mtz denuncias seguridad",
    pasos: ["Abrí el canal oficial de MTZ Denuncias.", "Contá qué pasó, dónde y cuándo."],
    avisos: [{ tipo: "error", txt: "<b>No reemplaza al 911.</b> Ante una emergencia, llamá al 911." }],
    costo: { texto: "Sin costo." },
    acciones: [{ label: "Ir a MTZ Denuncias", url: "https://www.lamatanza.gov.ar/mtz-denuncias", destino: "lamatanza.gov.ar/mtz-denuncias", tipo: "web", queHace: "Ahí está el canal oficial de denuncias del Municipio.", pedira: ["Qué pasó, dónde y cuándo"] }],
    fuente: "https://www.lamatanza.gov.ar/mtz-denuncias"
  },

  /* ============================ CEMENTERIOS ============================ */
  {
    id: "concesion-lote", nombre: "Pedir un lote para sepulcro o bóveda", oficial: "Cementerios · Concesión de lote",
    cat: "cementerios", mod: "presencial",
    resumen: "San Justo o Villegas · por 15 años",
    claves: "cementerio concesion lote sepulcro boveda terreno",
    preguntas: [{ id: "cem", txt: "¿En qué cementerio?", ops: [["sj", "San Justo"], ["vi", "Villegas"]] }, { id: "tipo", txt: "¿Qué querés construir?", ops: [["sep", "Sepulcro"], ["bov", "Bóveda"]] }],
    pasos: ["Escribí una nota al Intendente pidiendo el lote (hoja oficio, sin firmar).", "Presentala en Mesa de Entradas y pagá el sellado de $292.", "Seguí el trámite en la Dirección de Cementerios."],
    checklist: [
      { t: "No tener otro lote en San Justo ni en Villegas" },
      { t: "Nota al Intendente en hoja oficio, sin firmar" },
      { t: "DNI con domicilio en el partido" },
      { t: "CUIL, CUIT o CDI de los cesionarios" },
      { t: "Sellado de $292", n: "se paga al presentar la nota" }
    ],
    costo: { porRespuesta: "cem", valores: { sj: "Desde $6.782 por m²", vi: "Desde $6.335 por m²" }, etiquetas: { sj: "San Justo · 15 años", vi: "Villegas · 15 años" }, desde: "Desde $6.335 por m²", nota: "Bóveda: $7.679/m² (San Justo) o $6.497/m² (Villegas). Sellado del título: $2.437. La ficha no indica el año de los valores: confirmalos." },
    sedes: ["dir-cementerios"],
    fuente: F(9)
  },
  {
    id: "inhumacion", nombre: "Hacer una inhumación", oficial: "Cementerios · Inhumación",
    cat: "cementerios", mod: "presencial",
    resumen: "Días hábiles en la Dirección; fines de semana en el cementerio",
    claves: "inhumacion entierro sepelio fallecido cementerio sepultura",
    preguntas: [{ id: "tit", txt: "¿El titular de la concesión vive?", ops: [["si", "Sí"], ["no", "Falleció"]] }],
    pasos: ["En días hábiles, andá a la Dirección de Cementerios (Palacio Municipal).", "Fines de semana y feriados, se gestiona en el cementerio.", "Verificá que estén pagos los derechos de conservación y limpieza."],
    checklist: [
      { t: "Título de concesión original" },
      { t: "Licencia de inhumación o traslado" },
      { t: "Copia del DNI del fallecido y del arrendatario" },
      { t: "Derechos de conservación, barrido y limpieza pagos (2000 a 2008)", n: "originales y copias" },
      { t: "Certificado de defunción del titular", si: [{ tit: ["no"] }] },
      { t: "Libreta o partida de matrimonio o de nacimiento", si: [{ tit: ["no"] }], n: "para acreditar el vínculo" }
    ],
    avisosPorRespuesta: [{ si: { tit: ["no"] }, tipo: "aviso", txt: "Se firma un compromiso a 180 días para hacer la sucesión. Los traslados no admiten compromisos sucesorios." }],
    costo: { texto: "Inhumación en tierra $14 · nicho $56 · bóveda $60", nota: "Valores de la ficha oficial, sin año de vigencia indicado." },
    sedes: ["dir-cementerios", "cem-sanjusto", "cem-villegas"],
    fuente: F(9)
  },
  {
    id: "nichos", nombre: "Renovar un nicho o una sepultura", oficial: "Cementerios · Arrendamientos",
    cat: "cementerios", mod: "presencial",
    resumen: "Se hace solo en el cementerio",
    claves: "nicho renovar renovacion sepultura arrendamiento cementerio",
    pasos: ["Andá a la administración del cementerio en su horario.", "Llevá el comprobante del arriendo anterior y tu DNI."],
    checklist: [{ t: "DNI" }, { t: "Comprobante del arriendo anterior" }],
    costo: { texto: "Renovación anual: 20% de la tasa de 5 años", nota: "Ejemplo de la ficha: nicho ataúd 1ª y 5ª fila, $234 (San Justo) o $130 (Villegas) por 5 años." },
    sedes: ["cem-sanjusto", "cem-villegas"],
    fuente: F(9)
  },

  /* ======================== MESA DE ENTRADAS Y OTROS ======================== */
  {
    id: "mesa-entradas", nombre: "Presentar una nota o pedido al municipio", oficial: "Mesa de Entradas · Trámites Generales",
    cat: "otros", mod: "presencial",
    resumen: "Pedidos, eximiciones, planes de pago y denuncias",
    claves: "mesa de entradas nota pedido expediente intendente eximicion plan de pagos prescripcion devolucion denuncia",
    pasos: ["Escribí la nota dirigida al Intendente Municipal.", "Presentala personalmente (o autorizá a alguien con DNI y nombre en la nota).", "Pagá el sellado. Con el número de expediente podés consultar cómo sigue."],
    checklist: [
      { t: "Nota dirigida al Intendente Municipal" },
      { t: "DNI", n: "original y copia" },
      { t: "Autorización de la persona que presenta", n: "si no vas vos" },
      { t: "Estatuto o personería", n: "sociedades e instituciones" }
    ],
    avisos: [{ tipo: "info", txt: "Ahí se inician eximiciones de tasas, prescripción de tasas, devoluciones, ampliación de planes de pago, análisis de agua y descargos. Las denuncias no pagan sellado y son personales." }],
    costo: { texto: null, faltante: "Sellado según la ordenanza tarifaria vigente: el municipio no informa el monto." },
    sedes: ["mesa-entradas"],
    fuente: F(10)
  },
  {
    id: "gestion-judicial", nombre: "Sacar turno para gestión judicial", oficial: "Gestión judicial · turnos",
    cat: "otros", mod: "turno",
    resumen: "Turnero oficial del municipio",
    claves: "judicial gestion juzgado turno oficio",
    etapas: ["Preparar lo que llevás", "Sacar turno", "Ir a la sede"],
    checklist: [{ t: "DNI", n: "original y copia" }, { t: "Documentación del expediente o causa" }],
    costo: { texto: null, faltante: "El municipio no informa el monto." },
    avisos: [{ tipo: "info", txt: "La sede y la documentación exacta figuran al sacar el turno." }],
    sinSede: "La sede figura en la confirmación del turno.",
    acciones: [{ label: "Ir al turnero oficial", url: OFICIAL, destino: "turnero de Gestión judicial en lamatanza.gov.ar", tipo: "turnero", queHace: "El turno se saca en el turnero oficial del Municipio.", pedira: ["DNI", "Email"] }],
    fuente: OFICIAL
  }
];

const TELEFONOS = [
  { num: "147", nombre: "Atención Ciudadana", desc: "Consultas, reclamos y confirmación de turnos" },
  { num: "4651-0101", tel: "01146510101", nombre: "Municipio de La Matanza", desc: "Conmutador · Almafuerte 3050, San Justo" },
  { num: "107", nombre: "Emergencias médicas", desc: "SAME" },
  { num: "911", nombre: "Emergencias", desc: "Policía" }
];

const FAQ = [
  { q: "¿TuMuni es la página del municipio?", a: "No. TuMuni ordena y explica la información oficial del Municipio de La Matanza y te lleva al canal oficial. No cambia requisitos, costos, plazos ni canales." },
  { q: "¿Puedo pagar o sacar turno desde TuMuni?", a: "No. TuMuni no cobra, no guarda datos de tarjetas y no da turnos propios. Siempre te avisa antes de llevarte a la web oficial donde se hace." },
  { q: "¿TuMuni manda mis mensajes o documentos?", a: "No. En los trámites a distancia abrimos tu WhatsApp o tu email con un mensaje modelo. Lo completás y lo enviás vos." },
  { q: "¿Tengo que registrarme?", a: "No. Podés usar todo sin cuenta. Guardar checklists y recordatorios es opcional y solo te pedimos email o WhatsApp para avisarte." },
  { q: "¿Me van a pedir DNI, padrón o patente?", a: "TuMuni nunca te los pide. Si la web oficial te los pide, es en el sitio del municipio." },
  { q: "¿Los datos están actualizados?", a: "Cada ficha muestra la fuente oficial y la fecha de la última verificación. Los montos y horarios pueden cambiar: ante la duda, la web oficial manda." },
  { q: "Un gestor me ofrece sacar el registro sin turno, ¿es seguro?", a: "El municipio advierte que solo son válidas sus oficinas. Sacá el turno siempre en el turnero oficial." }
];
