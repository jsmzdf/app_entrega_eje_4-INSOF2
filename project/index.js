// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth' );
const realstatesRoutes = require('./routes/realstates');
// (Si ya tienes las demás rutas: users, contracts, visits, puedes importarlas igualmente)
// const usersRoutes = require('./routes/users');
// const contractsRoutes = require('./routes/contracts');
// const visitsRoutes = require('./routes/visits');

// Definir las rutas base para cada grupo de endpoints
app.use('/api/auth', authRoutes);
app.use('/api/realstates', realstatesRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/contracts', contractsRoutes);
// app.use('/api/visits', visitsRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('API de Inmobiliaria funcionando');
});



// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});