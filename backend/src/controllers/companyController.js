const prisma = require('../lib/prisma')
const crypto = require("crypto");

/**
 * =====================================================
 * 🏢 CRIAR EMPRESA (ONBOARDING)
 * =====================================================
 * ✔ Cria a empresa (Company)
 * ✔ Cria automaticamente o perfil (CompanyProfile)
 * ✔ Garante slug único (evita erro P2002)
 * ✔ Mantém compatibilidade com seu sistema atual
 */
exports.create = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("📎 FILE:", req.file);

    /**
     * 🔥 Proteção contra body vazio (FormData)
     */
    const empresa = req.body.empresa || req.body.name;

    if (!empresa) {
      return res.status(400).json({
        error: "Nome da empresa é obrigatório",
      });
    }

    /**
     * 🔴 Validação de arquivo
     */
    if (!req.file) {
      console.error("❌ Arquivo não recebido");
      return res.status(400).json({
        error: "Arquivo não enviado",
      });
    }

    /**
     * =====================================================
     * 🔥 GERAR SLUG BASE
     * =====================================================
     */
    let baseSlug = empresa
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    /**
     * =====================================================
     * 🔁 GARANTIR SLUG ÚNICO (SEM ERRO NO BANCO)
     * =====================================================
     */
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const exists = await prisma.company.findUnique({
        where: { slug },
      });

      if (!exists) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    /**
     * =====================================================
     * 🧠 CRIAÇÃO DA EMPRESA + PROFILE
     * =====================================================
     */
    const company = await prisma.company.create({
      data: {
        name: empresa,
        slug,

        profile: {
          create: {
            document: req.body.documento || null,
            ownerName: req.body.nome || null,
            email: req.body.email || null,
            whatsapp: req.body.whatsapp || null,
            corporateName: req.body.corporateName || null,
            ownerDocument: req.body.ownerDocument || null,
            number: req.body.number || null,
            cep: req.body.cep || null,
            street: req.body.street || null,
            neighborhood: req.body.neighborhood || null,
            city: req.body.city || null,
            state: req.body.state || null,
            image: req.file.filename,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    /**
     * ✅ SUCESSO
     */
    return res.status(201).json({
      message: "Empresa criada com sucesso",
      company,
    });

  } catch (error) {
    console.error("🔥 ERRO REAL COMPLETO:", error);

    return res.status(500).json({
      error: error.message || "Erro ao criar empresa",
    });
  }
};

/**
 * =====================================================
 * 🔍 BUSCAR EMPRESAS (LUPA)
 * =====================================================
 * ✔ Busca por nome (case insensitive)
 * ✔ Limita resultados (performance)
 */
exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
      include: {
        profile: true,
      },
    });

    return res.json(companies);

  } catch (error) {
    console.error("🔥 ERRO NA BUSCA:", error);

    return res.status(500).json({
      error: "Erro ao buscar empresas",
    });
  }
};