const express = require('express')
const router = express.Router()
const companyController = require('../controllers/companyController')

// 🔥 Upload de arquivos
const multer = require('multer')

// 📁 Configuração de upload (salva na pasta /uploads)
const upload = multer({ dest: 'uploads/' })

/**
 * =====================================================
 * 🏢 ROTAS DE EMPRESA
 * =====================================================
 */

/**
 * 🔍 BUSCAR EMPRESAS (LUPA)
 * 👉 CORRETO:
 * - Usa controller (boa prática)
 * - Evita duplicação de código
 * - Mantém padrão do projeto
 */
router.get('/search', async (req, res) => {
  try {
    await companyController.search(req, res)
  } catch (error) {
    console.error('ERRO NA ROTA GET /companies/search:', error)
    return res.status(500).json({ error: 'Erro ao buscar empresas' })
  }
})

/**
 * 📥 LISTAR EMPRESAS
 * 👉 Necessário para:
 * - Lupa (fallback)
 * - Testes
 */
router.get('/', async (req, res) => {
  try {
    await companyController.getAll(req, res)
  } catch (error) {
    console.error('ERRO NA ROTA GET /companies:', error)
    return res.status(500).json({ error: 'Erro ao buscar empresas' })
  }
})

/**
 * 🧠 CRIAR EMPRESA
 * 👉 Mantido:
 * - Upload com multer
 * - Sua função original no controller
 */
router.post(
  '/',
  upload.single('file'),
  async (req, res) => {
    try {
      await companyController.create(req, res)
    } catch (error) {
      console.error('ERRO NA ROTA POST /companies:', error)
      return res.status(500).json({ error: 'Erro ao cadastrar empresa' })
    }
  }
)

module.exports = router