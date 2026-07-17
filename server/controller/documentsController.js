// controllers/documentos.controller.js
import PDFDocument from "pdfkit";
import PrestaModels from "../models/PrestaModels.js";
import ClientesModel from "../models/ClienteModels.js";
import NotarioModels from "../models/NotarioModels.js";
import CompanyModels from "../models/CompanyModels.js";
import EmpresasModel from "../models/EmpresasModel.js";

//const EMPRESA = process.env.NOMBRE_EMPRESA || "BRAND DOM INMOBILIARIA A&G, S.R.L.";
const MYEMPRESA = await EmpresasModel.findOne({ where: { id: 1 } });

const EMPRESA = MYEMPRESA?.empresa || "BRAND DOM INMOBILIARIA A&G, S.R.L.";
const gerente = MYEMPRESA?.gerente || "MANUEL ALEJANDRO MINAYA ROCA";

const initDoc = (res, filename, size = "LETTER") => {
  const doc = new PDFDocument({ margin: 65, size }); // 👈 tamaño dinámico
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}.pdf"`);
  doc.pipe(res);
  return doc;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const fechaEspanol = () =>
  new Date().toLocaleDateString("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const montoFormato = (n) =>
  `RD$${Number(n).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

const encabezado = (doc, titulo) => {
  doc.fontSize(13).font("Helvetica-Bold").text(titulo, { align: "center" });
  doc.moveDown(4);
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(fechaEspanol())
    .text("Santo Domingo, RD");
  doc.moveDown(3);
  doc.font("Helvetica").text("Señores");
  doc.font("Helvetica-Bold").text(EMPRESA);
  doc.moveDown(3);
  doc.font("Helvetica").text("Distinguidos señores");
  doc.moveDown(3);
};

const firmaCliente = (doc, cliente) => {
  doc.moveDown(3);
  doc.font("Helvetica").text("Att:");
  doc
    .text("NOMBRE: ", { continued: true })
    .font("Helvetica-Bold")
    .text(
      cliente.nombres?.toUpperCase() + " " + cliente.apellidos?.toUpperCase(),
    );
  doc
    .font("Helvetica")
    .text("CEDULA: ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.dni);
};

const firmaClienteLinea = (doc, cliente) => {
  doc.moveDown(7);
  doc.text("____________________________________", { align: "center" });
  doc
    .font("Helvetica-Bold")
    .text(
      cliente.nombres?.toUpperCase() + " " + cliente.apellidos?.toUpperCase(),
      { align: "center" },
    );
  doc
    .font("Helvetica")
    .text("CEDULA: " + cliente.dni, { continued: true, align: "center" });
};

// ── Generadores por documento ─────────────────────────────────────────────────

const cartaBureau = (doc, cliente) => {
  encabezado(
    doc,
    "Autorización a consulta ilimitada de información\ncrediticia y personal en los todos los burós de crédito",
  );

  doc
    .font("Helvetica")
    .text("Por medio de la presente, autorizo formalmente a ", {
      continued: true, align: "justify"
    })
    .font("Helvetica-Bold")
    .text( EMPRESA, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      " para consultar mi historial de crédito en la Base de Datos de los Buro de " +
        "información Crediticia que entienda pertinente, tanto en la República Dominicana " +
        "como en los Estados Unidos de Norteamérica.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .text(
      "Por tanto, el presente consentimiento les libera a ustedes de cualquier " +
        "responsabilidad o implicaciones estipuladas en la Ley 288-05 sobre la Regulación " +
        "de sociedades de información Crediticia y de Protección al Titular de la información; " +
        "así como de cualquier otra persona legislación al respecto.",
      { align: "justify" },
    );

  firmaCliente(doc, cliente);
  firmaClienteLinea(doc, cliente);
};

// --- entrega-prestaciones -------------------
const entregaPrestaciones = (doc, cliente, prestamo, notario, compania) => {
  const nombreCliente =
    cliente.nombres?.toUpperCase() + " " + cliente.apellidos?.toUpperCase();
  const cedulaCliente = cliente?.dni;
  const direccionCliente = cliente?.direccion || "Santo Domingo, RD";
  const empleador = compania?.company || "";
  const nombreNotario =
    notario?.nombrecompleto?.toUpperCase() || "NOTARIO PÚBLICO";
  const cedulaNotario = notario?.idn || "";
  const direcionNotario =
    notario?.direccion || "Santo Domingo, Distrito Nacional";
  const matricula = notario?.ncolegiatura || "";
  const direccionNotario =
    notario?.direccion || "Santo Domingo, Distrito Nacional";
  const dniGerente = MYEMPRESA?.dni_gerente || "402-3009164-3";

  const pageWidth = doc.page.width;
  const lineWidth = 200; // largo de la línea
  const centerX = pageWidth / 2;

  // Fecha en letras
  const ahora = new Date();
  const dia = ahora.getDate();
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const mes = meses[ahora.getMonth()];
  const anio = ahora.getFullYear();
  const anioLetras = "dos mil veinticinco"; // ajusta o usa librería
  const fechaLarga = `${dia} del mes de ${mes} del año ${anioLetras} (${anio})`;
  const fechaCorta = `${dia} de ${mes} de ${anio}`;

  // ── PÁGINA 1: Cuerpo del documento ───────────────────────────────────────
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("AUTORIZACIÓN ENTREGA PRESTACIONES", { align: "center" });
  doc.moveDown(2);

  doc
    .font("Helvetica")
    .text("EL suscrito, señor (a), ", { continued: true, align: "justify" })
    .font("Helvetica-Bold")
    .text(nombreCliente, { continued: true })
    .font("Helvetica")
    .text(
      ", mayor de edad, titular de la cédula de identificación y electoral número, ",
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(cedulaCliente, { continued: true })
    .font("Helvetica")
    .text(
      `, domiciliado en la, ${direccionCliente}, calidad de empleado de la compañía, `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(empleador, { continued: true })
    .font("Helvetica")
    .text(", por medio del presente documento, autorizo a la compañía ", {
      continued: true,
      align: "justify",
    })
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, Sociedad de comercio organizado de acuerdo a las leyes de República Dominicana, con su domicilio y asiento social en la Calle Doctor Delgado Casi Esquina Bolívar. Suite. 2-A. Edificio Anara No. 152, Santo Domingo, Distrito Nacional, República Dominicana, con Registro Mercantil No. 195325SD RNC No. 1-32-93211-2, debidamente representada por su Gerente, el señor `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(gerente, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, dominicano mayor de edad, titular de la cédula de identificación y electoral número ${dniGerente}, domiciliado y residente en esta ciudad, para que, en caso de ser yo despedido o renunciado, o todo aquello que implica rompimiento del vínculo laboral que me une a la precitada empresa, puede retirar los valores correspondientes a todos las prestaciones laborales que me correspondan, incluyendo salario o comisiones, aun los Derechos Adquiridos, a fin de saldar la parte pendiente del prestamos otorgado por dicha entidad.`,
      { align: "justify" },
    );

  doc.moveDown(1.5);

  doc
    .font("Helvetica")
    .text(
      "Así mismo, en caso de maternidad, licencia o enfermedad por cualquier causa autorizo a la compañía ",
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(
      `, a deducir de dichas prestaciones y gratificaciones o salarios del monto adeudado por mi, y que ha sido otorgado en mi provecho por la compañía `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(` y su gerente el señor (a) `, { continued: true, align: "justify" })
    .font("Helvetica-Bold")
    .text(gerente, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, para lo que es imprescindible la presencia de un representante de la citada compañía, cuando se produzca la liquidación en caso de que este se origine durante la vigencia del prestamo, y que a dicho representante se le otorgue el monto adeudado.`,
      { align: "justify" },
    );

  doc.moveDown(1.5);

  doc
    .font("Helvetica")
    .text("Así mismo, otorga ", { continued: true, align: "justify" })
    .font("Helvetica-Bold")
    .text("PODER Y MANDATO", { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      ", tan amplio y suficiente como el derecho fuere requerido, en favor de la compañía ",
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, RNC No. 1-32-93211-2, como si fuere el mismo, para que pueda suscribir válidamente todas las documentaciones que pudiere requerir la empresa, `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(empleador, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, para hacer la entrega de dichos valores, especialmente, que expresamente autorizo a otorgar recibe de pago, descargo y finiquito a favor de, `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      ` y sus funcionarios, en lo relativo a la terminación del contrato de trabajo, entrega de Prestaciones Laborales y Derecho Adquiridos, con la misma validez como si fuera el mismo.`,
      { align: "justify" },
    );

  // ── PÁGINA 2: Firmas ──────────────────────────────────────────────────────
  doc.addPage();

  const fechaLugar = `En Santo Domingo, Distrito Nacional, Republica Dominicana, a los `;
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(fechaLugar, { continued: true })
    .font("Helvetica-Bold")
    .text(fechaLarga, { continued: true })
    .font("Helvetica")
    .text(".", { align: "justify" });

  doc.moveDown(4);

  // Firma cliente
  doc
    .moveTo(centerX - lineWidth / 2, doc.y)
    .lineTo(centerX + lineWidth / 2, doc.y)
    .stroke();

  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(nombreCliente, { align: "center" });
  doc.font("Helvetica").text("POR EL EMPLEADO", { align: "center" });

  doc.moveDown(4);

  // Firma gerente
  doc
    .moveTo(centerX - lineWidth / 2, doc.y)
    .lineTo(centerX + lineWidth / 2, doc.y)
    .stroke();

  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").text(gerente, { align: "center" });
  doc.font("Helvetica").text(EMPRESA, { align: "center" });

  doc.moveDown(4);

  // Certificación notarial (texto inferior página 2)
  doc
    .fontSize(12)
    .font("Helvetica")
    .text("YO, ", { continued: true })
    .font("Helvetica-Bold")
    .text(`${nombreNotario}`, { continued: true, align: "justify" })
    .font("Helvetica")
    .text(
      `, Dominicana, Mayor de edad, Soltero, portador de la cedula de identidad y electoral No. ${cedulaNotario}, con estudio profesional abierto, en el ${direccionNotario}, Notario Público de los del número para Santo Domingo, Distrito Nacional, Republica Dominicana, con matrícula del Colegio de Notarios No. ${matricula}, CERTIFICO : Que las firmas que anteceden fueron puestas libre y voluntariamente por los señores `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(`MANUEL ALEJANDRO MINAYA ROCA Y ${nombreCliente}`, {
      continued: true,
    })
    .font("Helvetica")
    .text(
      `, de generales que constan, personas que me han declarado que esa es la firma que acostumbran a usar en todos sus actos. En Santo Domingo, Distrito Nacional, Republica Dominicana Hoy día, `,
      { continued: true, align: "justify" },
    )
    .font("Helvetica-Bold")
    .text(fechaLarga, { continued: true, justify: "justify" })
    .font("Helvetica")
    .text(".", { align: "justify" });

  doc.moveDown(5);
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`${nombreNotario}`, { align: "center" });
  doc.moveDown(1);
  doc.text("NOTARIO(A)", { align: "center" });
};

const pagareNotarial = (doc, cliente, prestamo) => {
  encabezado(doc, "Pagaré Notarial");

  doc
    .font("Helvetica")
    .text("Yo, ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.nombre?.toUpperCase(), { continued: true })
    .font("Helvetica")
    .text(
      ", mayor de edad, de nacionalidad dominicana, portador(a) de la cédula de " +
        "identidad y electoral número ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(cliente.identificador, { continued: true })
    .font("Helvetica")
    .text(", con domicilio en ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.direccion || "Santo Domingo, RD", { continued: true })
    .font("Helvetica")
    .text(
      ", por medio del presente Pagaré Notarial, me comprometo INCONDICIONALMENTE " +
        "a pagar a la orden de ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(" la suma de:", { align: "justify" });

  doc.moveDown(1);

  // Monto destacado
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(montoFormato(prestamo.montoprestar), { align: "center" });
  doc.fontSize(11).font("Helvetica").moveDown(1);

  doc
    .text(`Dicha suma será pagada en `, { continued: true })
    .font("Helvetica-Bold")
    .text(`${prestamo.tcuota} cuotas`, { continued: true })
    .font("Helvetica")
    .text(` de `, { continued: true })
    .font("Helvetica-Bold")
    .text(montoFormato(prestamo.mcuota), { continued: true })
    .font("Helvetica")
    .text(` cada una, con frecuencia `, { continued: true })
    .font("Helvetica-Bold")
    .text(prestamo.frecuencia, { continued: true })
    .font("Helvetica")
    .text(`, a una tasa de interés del `, { continued: true })
    .font("Helvetica-Bold")
    .text(`${prestamo.interes}% `, { continued: true })
    .font("Helvetica")
    .text("según las condiciones pactadas.", { align: "justify" });

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .text("En caso de incumplimiento, acepto que ", { continued: true })
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(
      " podrá ejercer todas las acciones legales correspondientes para el cobro " +
        "de la deuda, incluyendo intereses moratorios y gastos legales que se generen.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .text(
      "Este pagaré ha sido firmado en la ciudad de Santo Domingo, " +
        "República Dominicana, a los " +
        fechaEspanol() +
        ".",
      { align: "justify" },
    );

  firmaCliente(doc, cliente);
};

const poderEspecial = (doc, cliente, prestamo) => {
  encabezado(doc, "Poder Especial");

  doc
    .font("Helvetica")
    .text("Por el presente instrumento, Yo, ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.nombre?.toUpperCase(), { continued: true })
    .font("Helvetica")
    .text(", mayor de edad, portador(a) de la cédula de identidad número ", {
      continued: true,
    })
    .font("Helvetica-Bold")
    .text(cliente.identificador, { continued: true })
    .font("Helvetica")
    .text(", confiero PODER ESPECIAL Y SUFICIENTE a la empresa ", {
      continued: true,
    })
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(
      ", para que en mi nombre y representación pueda realizar los siguientes actos:",
      { align: "justify" },
    );

  doc.moveDown(1);

  const facultades = [
    "Gestionar y cobrar cualquier suma de dinero que me sea adeudada.",
    "Negociar, acordar y suscribir acuerdos de pago en mi nombre.",
    "Representarme ante cualquier institución financiera o entidad crediticia.",
    `Administrar el préstamo por valor de ${montoFormato(prestamo.montoprestar)} ` +
      `otorgado en fecha ${new Date(prestamo.fecha).toLocaleDateString("es-DO")}.`,
    "Realizar cualquier gestión administrativa relacionada con el presente préstamo.",
  ];

  facultades.forEach((f, i) => {
    doc.font("Helvetica").text(`${i + 1}. ${f}`, { align: "justify" });
    doc.moveDown(0.3);
  });

  doc.moveDown(0.7);
  doc
    .font("Helvetica")
    .text(
      "El presente poder es conferido con todas las facultades necesarias para el " +
        "cumplimiento de las atribuciones indicadas, de conformidad con las leyes de la " +
        "República Dominicana.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .text(
      "Dado en Santo Domingo, República Dominicana, a los " +
        fechaEspanol() +
        ".",
    );

  firmaCliente(doc, cliente);
};

const poderLitis = (doc, cliente, prestamo) => {
  encabezado(doc, "Poder para Litigar (Poder Litis)");

  doc
    .font("Helvetica")
    .text("Por el presente instrumento, Yo, ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.nombre?.toUpperCase(), { continued: true })
    .font("Helvetica")
    .text(
      ", mayor de edad, dominicano(a), portador(a) de la cédula de identidad número ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(cliente.identificador, { continued: true })
    .font("Helvetica")
    .text(
      ", por medio del presente acto confiero PODER ESPECIAL PARA LITIGAR a ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(", para que en mi nombre y representación pueda:", {
      align: "justify",
    });

  doc.moveDown(1);

  const facultades = [
    "Representarme ante cualquier tribunal de la República Dominicana.",
    "Interponer demandas, recursos y acciones legales en mi nombre.",
    "Realizar todos los actos procesales necesarios para la defensa de mis derechos.",
    `Gestionar el cobro judicial del préstamo por valor de ${montoFormato(prestamo.montoprestar)}.`,
    "Acordar transacciones, desistimientos y homologaciones judiciales.",
    "Ejecutar sentencias y resoluciones judiciales a mi favor.",
  ];

  facultades.forEach((f, i) => {
    doc.font("Helvetica").text(`${i + 1}. ${f}`, { align: "justify" });
    doc.moveDown(0.3);
  });

  doc.moveDown(0.7);
  doc
    .font("Helvetica")
    .text(
      "El presente poder es irrevocable mientras subsista la obligación crediticia, " +
        "de conformidad con los artículos pertinentes del Código Civil Dominicano y la " +
        "Ley 834 de 1978.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc.text(
    "Dado en Santo Domingo, República Dominicana, a los " +
      fechaEspanol() +
      ".",
  );

  firmaCliente(doc, cliente);
};

const reconocimientoDeudas = (doc, cliente, prestamo) => {
  encabezado(doc, "Reconocimiento de Deudas");

  doc
    .font("Helvetica")
    .text("Yo, ", { continued: true })
    .font("Helvetica-Bold")
    .text(cliente.nombres?.toUpperCase(), { continued: true })
    .font("Helvetica")
    .text(
      ", mayor de edad, de nacionalidad dominicana, portador(a) de la cédula de " +
        "identidad número ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(cliente.identificador, { continued: true })
    .font("Helvetica")
    .text(
      ", por medio del presente instrumento RECONOZCO EXPRESAMENTE " +
        "que soy deudor(a) de la empresa ",
      { continued: true },
    )
    .font("Helvetica-Bold")
    .text(EMPRESA, { continued: true })
    .font("Helvetica")
    .text(" por los siguientes conceptos:", { align: "justify" });

  doc.moveDown(1);

  // Tabla de deuda
  const filas = [
    ["Capital original:", montoFormato(prestamo.montoprestar)],
    ["Monto de interés:", montoFormato(prestamo.montointeres)],
    ["Capital pendiente:", montoFormato(prestamo.capitalpendiente)],
    ["Balance pendiente:", montoFormato(prestamo.balancependiente)],
    ["Cuotas pagadas:", `${prestamo.cuotaspagas} de ${prestamo.tcuota}`],
    ["Monto pagado a la fecha:", montoFormato(prestamo.montopagado)],
  ];

  filas.forEach(([label, valor]) => {
    doc
      .font("Helvetica")
      .text(label, { continued: true, width: 220 })
      .font("Helvetica-Bold")
      .text(`  ${valor}`);
  });

  doc.moveDown(1);

  // Total destacado
  doc
    .font("Helvetica")
    .text("TOTAL ADEUDADO:", { continued: true })
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`  ${montoFormato(prestamo.balancependiente)}`);
  doc.fontSize(11).moveDown(1);

  doc
    .font("Helvetica")
    .text(
      "Reconozco que esta deuda es legítima, líquida y exigible, comprometiéndome " +
        "a cancelarla en los términos y condiciones pactados originalmente. " +
        "Declaro que no tengo ninguna objeción, compensación ni reclamo que oponer " +
        "contra la misma.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc
    .font("Helvetica")
    .text(
      "El presente reconocimiento de deuda tiene plena validez legal de conformidad " +
        "con las disposiciones del Código Civil Dominicano.",
      { align: "justify" },
    );

  doc.moveDown(1);
  doc.text(
    "Dado en Santo Domingo, República Dominicana, a los " +
      fechaEspanol() +
      ".",
  );

  firmaCliente(doc, cliente);
};

// ── Controller principal ──────────────────────────────────────────────────────

export const generarDocumento = async (req, res) => {
  try {
    const { tipo, idPrestamo } = req.params;

    const prestamo = await PrestaModels.findByPk(idPrestamo, {
      include: [
        { model: ClientesModel },
        { model: NotarioModels },
        { model: CompanyModels },
      ],
    });

     console.log("✅ Préstamo encontrado:", prestamo?.id);       // 👈
    console.log("✅ Cliente:", prestamo?.ClientesModel?.nombres); // 👈
    console.log("✅ Notario:", prestamo?.NotarioModels?.nombres); // 👈

    if (!prestamo)
      return res.status(404).json({ message: "Préstamo no encontrado" });

    const cliente = await ClientesModel.findByPk(prestamo.idclientes);
    const notario = await NotarioModels.findByPk(prestamo.idnotario);
    const compania =
      (await CompanyModels.findByPk(cliente.idinstitucion)) || [];
    console.log(notario);

    // 👇 Define el tamaño según el tipo de documento
    const tamanos = {
      "carta-bureau": "LETTER",
      "entrega-prestaciones": "LETTER",
      "pagare-notarial": "LEGAL",
      "poder-especial": "LEGAL",
      "poder-litis": "LEGAL",
      "reconocimiento-deudas": "LEGAL",
    };

    const size = tamanos[tipo];
    if (!size)
      return res.status(400).json({ message: "Tipo de documento inválido" });

    const doc = initDoc(res, `${tipo}-${idPrestamo}`, size);

    switch (tipo) {
      case "carta-bureau":
        cartaBureau(doc, cliente);
        break;
      case "entrega-prestaciones":
        entregaPrestaciones(doc, cliente, prestamo, notario, compania);
        break;
      case "pagare-notarial":
        pagareNotarial(doc, cliente, prestamo);
        break;
      case "poder-especial":
        poderEspecial(doc, cliente, prestamo);
        break;
      case "poder-litis":
        poderLitis(doc, cliente, prestamo);
        break;
      case "reconocimiento-deudas":
        reconocimientoDeudas(doc, cliente, prestamo);
        break;
    }

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
