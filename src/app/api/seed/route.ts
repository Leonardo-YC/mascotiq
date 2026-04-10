import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { categories, products, plans, planProducts, subscriptions, orders } from "@/lib/db/schema";

// GET /api/seed          → solo siembra si está vacío
// GET /api/seed?reset=1  → borra catálogo y re-siembra (NO toca users/pets)
// GET /api/seed?clean=1  → borra todo el catálogo y deja vacío
export async function GET(req: Request) {
  const url = new URL(req.url);
  const reset = url.searchParams.get("reset") === "1";
  const clean = url.searchParams.get("clean") === "1";

  try {
    if (reset || clean) {
      await db.delete(orders);
      await db.delete(subscriptions);
      await db.delete(planProducts);
      await db.delete(products);
      await db.delete(categories);
      await db.delete(plans);

      if (clean && !reset) {
        return NextResponse.json({ message: "🗑️ Base de datos vaciada." });
      }
    } else {
      const existing = await db.select().from(plans);
      if (existing.length > 0) {
        return NextResponse.json({ message: "⚠️ Ya hay datos. Usa ?reset=1 para borrar y re-sembrar." });
      }
    }

    // ── CATEGORÍAS (8) ──────────────────────────────────────────────
    const [catArticular, catDigestiva, catPiel, catRenal, catCardiaco, catCognitivo, , catVitaminas] =
      await db.insert(categories).values([
        { name: "Salud Articular",       description: "Suplementos para proteger huesos, cartílagos y articulaciones." },
        { name: "Salud Digestiva",       description: "Probióticos y prebióticos para una flora intestinal saludable." },
        { name: "Piel y Pelaje",         description: "Fórmulas ricas en Omega 3 para piel sana y pelaje brillante." },
        { name: "Soporte Renal",         description: "Apoyo nutricional para la función renal en mascotas senior." },
        { name: "Soporte Cardíaco",      description: "Suplementos para la salud cardiovascular en razas grandes." },
        { name: "Soporte Cognitivo",     description: "Neuroprotectores y antioxidantes para la función cerebral senior." },
        { name: "Sistema Inmune",        description: "Inmunomoduladores y antioxidantes para mayor defensa." },
        { name: "Vitaminas y Minerales", description: "Complejos multivitamínicos adaptados a la etapa senior." },
      ]).returning();

    // ── PRODUCTOS (12) ──────────────────────────────────────────────
    const [
      pArtPro, pOmega, pProbioAdv, pRenalFelino, pProbioFelino,
      pVitFelino, pArtPeq, pVitPeq, pCardCanino, pVitCanino,
      pCardPremium, pCognitivo,
    ] = await db.insert(products).values([
      {
        categoryId: catArticular.id,
        name: "Senior Care Articular Pro",
        description: "Fórmula avanzada con condroitina y glucosamina. Protege cartílagos y articulaciones en perros senior medianos y grandes.",
        ingredients: "Glucosamina HCl 500 mg, Condroitina Sulfato 400 mg, MSM 200 mg, Ácido Hialurónico 50 mg.",
        price: "120.00", subscriptionPrice: "89.00", isActive: true,
      },
      {
        categoryId: catPiel.id,
        name: "Aceite de Salmón Omega 3+",
        description: "Aceite de salmón salvaje de primera extracción. Reduce la inflamación sistémica y mejora el pelaje notablemente.",
        ingredients: "Aceite de Salmón Salvaje del Pacífico 100%, Vitamina E 50 UI/100 ml.",
        price: "110.00", subscriptionPrice: "85.00", isActive: true,
      },
      {
        categoryId: catDigestiva.id,
        name: "Probióticos Digestivos Avanzados",
        description: "Cepas probióticas clínicamente validadas para perros. Equilibra la microbiota y reduce gases intestinales.",
        ingredients: "Lactobacillus acidophilus 2×10⁹ UFC, Bifidobacterium animalis 1×10⁹ UFC, Inulina 500 mg.",
        price: "95.00", subscriptionPrice: "75.00", isActive: true,
      },
      {
        categoryId: catRenal.id,
        name: "Soporte Renal Felino Senior",
        description: "Fórmula especializada para gatos senior. Bajo en fósforo y rico en antioxidantes para la función renal.",
        ingredients: "Extracto de Cranberry 200 mg, Ácido Alfa Lipoico 25 mg, Potasio Citrato 150 mg.",
        price: "130.00", subscriptionPrice: "99.00", isActive: true,
      },
      {
        categoryId: catDigestiva.id,
        name: "Probióticos Digestivos Felinos",
        description: "Mezcla adaptada a la microbiota felina. Reduce vómitos de bolas de pelo y apoya la digestión diaria.",
        ingredients: "Enterococcus faecium 5×10⁸ UFC, Lactobacillus rhamnosus 2×10⁸ UFC, FOS 300 mg.",
        price: "90.00", subscriptionPrice: "70.00", isActive: true,
      },
      {
        categoryId: catVitaminas.id,
        name: "Complejo Vitamínico Felino Senior",
        description: "Multivitamínico completo formulado para gatos de 7 años en adelante. Cubre deficiencias típicas de la edad.",
        ingredients: "Vitamina A, D3, Complejo B (B1-B12), Taurina 250 mg, Zinc 10 mg.",
        price: "85.00", subscriptionPrice: "65.00", isActive: true,
      },
      {
        categoryId: catArticular.id,
        name: "Glucosamina para Razas Pequeñas",
        description: "Fórmula articular de baja concentración dosificada para perros menores de 10 kg.",
        ingredients: "Glucosamina HCl 250 mg, Condroitina 200 mg, Boswellia serrata 100 mg.",
        price: "80.00", subscriptionPrice: "62.00", isActive: true,
      },
      {
        categoryId: catVitaminas.id,
        name: "Vitaminas Senior Razas Pequeñas",
        description: "Complejo vitamínico mineral concentrado para perros pequeños. Suple deficiencias de hierro y zinc.",
        ingredients: "Vitamina E 50 UI, Vitamina B12 25 mcg, Hierro 8 mg, Zinc 7 mg.",
        price: "75.00", subscriptionPrice: "58.00", isActive: true,
      },
      {
        categoryId: catCardiaco.id,
        name: "Soporte Cardíaco Canino",
        description: "Suplemento cardiovascular para perros grandes (25-45 kg). Con CoQ10 para la función miocárdica.",
        ingredients: "Coenzima Q10 30 mg, L-Carnitina 250 mg, Taurina 500 mg, Magnesio 50 mg.",
        price: "140.00", subscriptionPrice: "110.00", isActive: true,
      },
      {
        categoryId: catVitaminas.id,
        name: "Complejo Vitamínico Canino Senior",
        description: "Multivitamínico de amplio espectro para perros senior grandes. Combate el estrés oxidativo celular.",
        ingredients: "Vitamina A 5000 UI, Vitamina E 100 UI, Vitamina C 100 mg, Selenio, Zinc.",
        price: "95.00", subscriptionPrice: "74.00", isActive: true,
      },
      {
        categoryId: catCardiaco.id,
        name: "Soporte Cardíaco Premium",
        description: "Alta concentración para perros gigantes (+45 kg). Protege el corazón bajo estrés mecánico elevado.",
        ingredients: "Coenzima Q10 60 mg, L-Carnitina 500 mg, Taurina 1000 mg, Omega 3 EPA+DHA.",
        price: "165.00", subscriptionPrice: "129.00", isActive: true,
      },
      {
        categoryId: catCognitivo.id,
        name: "Soporte Cognitivo Senior",
        description: "Neuroprotector para perros senior. Mejora la alerta, la orientación y la calidad del sueño profundo.",
        ingredients: "Fosfatidilserina 100 mg, Aceite de Coco MCT 500 mg, Ginkgo biloba 60 mg, Vitamina E.",
        price: "125.00", subscriptionPrice: "98.00", isActive: true,
      },
    ]).returning();

    // ── PLANES (5) con precios reales ────────────────────────────────
    const [planGato, planPeq, planMed, planGrande, planGigante] =
      await db.insert(plans).values([
        {
          name: "Plan Senior Gato",
          description: "Gatos de 7+ años. Soporte renal, digestivo y vitamínico.",
          price: "89.00",          // S/89/mes
          stripePriceId: "temp_cat",
          interval: "monthly",
          isActive: true,
        },
        {
          name: "Plan Senior Perro Pequeño",
          description: "Perros <10 kg desde los 9 años. Soporte articular y digestivo.",
          price: "79.00",          // S/79/mes
          stripePriceId: "temp_small",
          interval: "monthly",
          isActive: true,
        },
        {
          name: "Plan Senior Perro Mediano",
          description: "Perros 10-25 kg desde los 7 años. Articular, digestivo y piel.",
          price: "99.00",          // S/99/mes
          stripePriceId: "temp_med",
          interval: "monthly",
          isActive: true,
        },
        {
          name: "Plan Senior Perro Grande",
          description: "Perros 25-45 kg desde los 6 años. Articular, cardíaco y vitaminas.",
          price: "129.00",         // S/129/mes
          stripePriceId: "temp_large",
          interval: "monthly",
          isActive: true,
        },
        {
          name: "Plan Senior Perro Gigante",
          description: "Perros +45 kg desde los 5 años. Corazón, articulaciones y mente.",
          price: "149.00",         // S/149/mes
          stripePriceId: "temp_giant",
          interval: "monthly",
          isActive: true,
        },
      ] as any).returning();

    // ── RELACIONES PLAN ↔ PRODUCTO ───────────────────────────────────
    await db.insert(planProducts).values([
      // Gato (4 productos)
      { planId: planGato.id, productId: pOmega.id },
      { planId: planGato.id, productId: pRenalFelino.id },
      { planId: planGato.id, productId: pProbioFelino.id },
      { planId: planGato.id, productId: pVitFelino.id },
      // Perro Pequeño (4 productos)
      { planId: planPeq.id, productId: pOmega.id },
      { planId: planPeq.id, productId: pArtPeq.id },
      { planId: planPeq.id, productId: pProbioAdv.id },
      { planId: planPeq.id, productId: pVitPeq.id },
      // Perro Mediano (3 productos)
      { planId: planMed.id, productId: pOmega.id },
      { planId: planMed.id, productId: pArtPro.id },
      { planId: planMed.id, productId: pProbioAdv.id },
      // Perro Grande (4 productos)
      { planId: planGrande.id, productId: pOmega.id },
      { planId: planGrande.id, productId: pArtPro.id },
      { planId: planGrande.id, productId: pCardCanino.id },
      { planId: planGrande.id, productId: pVitCanino.id },
      // Perro Gigante (4 productos)
      { planId: planGigante.id, productId: pOmega.id },
      { planId: planGigante.id, productId: pArtPro.id },
      { planId: planGigante.id, productId: pCardPremium.id },
      { planId: planGigante.id, productId: pCognitivo.id },
    ]);

    return NextResponse.json({
      message: "✅ Catálogo sembrado: 8 categorías, 12 productos, 5 planes con precios reales.",
    });
  } catch (error: any) {
    console.error("Error en seed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}