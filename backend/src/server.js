const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Pon aquí tu token real de Mercado Pago (o cámbialo luego en las variables de entorno de Render)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-AQUI-VA-TU-TOKEN-REAL' 
});

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta pública del catálogo de cursos
app.get('/api/catalogo', (req, res) => {
  db.query('SELECT * FROM catalogo_cursos ORDER BY id ASC', (err, results) => {
    if (err) {
      console.error('Error al obtener catálogo:', err);
      return res.status(500).json({ success: false, message: 'Error al consultar cursos' });
    }
    const cursos = results.map(c => ({
      ...c,
      precio: Number(c.precio),
      temario: typeof c.temario === 'string' ? JSON.parse(c.temario) : c.temario
    }));
    res.json(cursos);
  });
});

// NUEVA RUTA: Generar link de pago con Mercado Pago
app.post('/api/pagos/crear-preferencia', async (req, res) => {
  try {
    const { carrito, nombreUsuario } = req.body;

    const items = carrito.map(curso => ({
      id: curso.id.toString(),
      title: curso.titulo,
      unit_price: Number(curso.precio),
      quantity: 1,
      currency_id: 'PEN'
    }));

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        payer: { name: nombreUsuario || 'Alumno San Marcos' },
        back_urls: {
          success: 'https://portico-san-marcos.vercel.app/',
          failure: 'https://portico-san-marcos.vercel.app/',
          pending: 'https://portico-san-marcos.vercel.app/'
        },
        auto_return: 'approved'
      }
    });

    res.json({ urlPago: result.init_point });
  } catch (error) {
    console.error('Error en Mercado Pago:', error);
    res.status(500).json({ error: 'Error al generar la pasarela de pago' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});