/* ==========================================================================
   TuMuni La Matanza · Cuentas de prueba (MVP)
   --------------------------------------------------------------------------
   Perfiles ficticios para mostrar el inicio de sesión. No hay servidor:
   todo se guarda en el navegador de quien prueba la app.
   Contraseña de todas las cuentas: demo1234
   Iniciar sesión es OPCIONAL (RN-13): toda la app funciona sin cuenta.
   ========================================================================== */

const DEMO_PASSWORD = "demo1234";

const USUARIOS_DEMO = [
  {
    id: "marta", nombre: "Marta", apellido: "Gómez", edad: 68, nacimiento: "1958-03-14",
    email: "marta.gomez@demo.tumuni", whatsapp: "11 5123-4567", localidad: "gonzalez-catan",
    perfil: "Jubilada", color: "#B4234A", tema: "light",
    resumen: "Quiere el descuento de la tasa y renovar el registro.",
    recomendados: ["eximicion-tsg", "renovar-licencia", "pagar-tasa", "cuotas-vencidas"],
    saved: {
      "renovar-licencia": { checked: ["DNI digitalizado con domicilio en La Matanza", "Licencia actual", "Declaración Jurada de Salud"], answers: { edad: "65", venc: "no" }, ts: 1 },
      "eximicion-tsg": { checked: ["DNI del titular y del cónyuge", "Última boleta de la Tasa por Servicios Generales"], answers: {}, ts: 2 }
    },
    recs: [
      { id: "r-m1", tipo: "licencia", label: "Vence mi licencia de conducir", tramite: "renovar-licencia", fecha: "2026-12-18", canal: "whatsapp", contacto: "1151234567" },
      { id: "r-m2", tipo: "tasa", label: "Tasa municipal", tramite: "pagar-tasa", fecha: "2026-12-10", canal: "whatsapp", contacto: "1151234567" }
    ]
  },
  {
    id: "lucas", nombre: "Lucas", apellido: "Fernández", edad: 19, nacimiento: "2007-06-02",
    email: "lucas.fernandez@demo.tumuni", whatsapp: "11 6234-5678", localidad: "isidro-casanova",
    perfil: "Estudiante", color: "#3B4BB5", tema: "light",
    resumen: "Va a sacar su primera licencia y patentar su moto.",
    recomendados: ["licencia-original", "alta-moto", "multas", "deuda-patente"],
    saved: {
      "licencia-original": { checked: ["Certificado del curso “Mi Primera Licencia”"], answers: { edad: "joven" }, ts: 3 }
    },
    recs: [
      { id: "r-l1", tipo: "turno", label: "Turno licencia · La Tablada", tramite: "licencia-original", fecha: "2026-11-27", canal: "email", contacto: "lucas.fernandez@demo.tumuni" }
    ]
  },
  {
    id: "carla", nombre: "Carla", apellido: "Benítez", edad: 34, nacimiento: "1992-09-21",
    email: "carla.benitez@demo.tumuni", whatsapp: "11 4345-6789", localidad: "ramos-mejia",
    perfil: "Emprendedora (pastelería)", color: "#B45309", tema: "light",
    resumen: "Está habilitando su pastelería en Ramos Mejía.",
    recomendados: ["habilitar-comercio", "rubros", "seguridad-higiene", "libre-deuda"],
    saved: {
      "habilitar-comercio": { checked: ["DNI frente y dorso", "Certificado RDAM (deudores alimentarios)", "Curso de manipulación de alimentos"], answers: { rubro: "si", alc: "no", m2: "si" }, ts: 4 }
    },
    recs: []
  },
  {
    id: "jorge", nombre: "Jorge", apellido: "Ramírez", edad: 47, nacimiento: "1979-01-08",
    email: "jorge.ramirez@demo.tumuni", whatsapp: "11 3456-7890", localidad: "laferrere",
    perfil: "Taxista", color: "#157F3B", tema: "light",
    resumen: "Renueva la licencia profesional y controla sus multas.",
    recomendados: ["licencia-profesional", "multas", "deuda-patente", "denuncia-venta"],
    saved: {
      "licencia-profesional": { checked: ["Licencia original anterior"], answers: { edad: "45" }, ts: 5 }
    },
    recs: [
      { id: "r-j1", tipo: "licencia", label: "Vence mi licencia profesional", tramite: "licencia-profesional", fecha: "2027-01-15", canal: "email", contacto: "jorge.ramirez@demo.tumuni" }
    ]
  },
  {
    id: "ana", nombre: "Ana", apellido: "Sosa", edad: 41, nacimiento: "1985-11-30",
    email: "ana.sosa@demo.tumuni", whatsapp: "11 2567-8901", localidad: "san-justo",
    perfil: "Mamá de un hijo con discapacidad", color: "#6B3FA0", tema: "light",
    resumen: "Tramita el CUD, el pase libre y la exención de patente.",
    recomendados: ["cud", "pases-libres", "exencion-discapacidad", "pension-discapacidad"],
    saved: {
      "pases-libres": { checked: ["CUD digital de Mi Argentina"], answers: { linea: "1" }, ts: 6 }
    },
    recs: []
  }
];
