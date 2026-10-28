const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta pública del catálogo de cursos (Sin necesidad de Login)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});