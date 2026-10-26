const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a tu Base de Datos SQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Tu usuario de SQL
  password: '',          // Tu contraseña de SQL
  database: 'barberia'   // Nombre de tu base de datos
});

db.connect(err => {
  if (err) console.error('Error al conectar a SQL:', err);
  else console.log('¡Conectado exitosamente a la base de datos SQL!');
});

// Ruta para obtener los turnos guardados en SQL
app.get('/api/turnos', (req, res) => {
  db.query('SELECT * FROM turnos', (err, results) => {
    if (err) res.status(500).send(err);
    else res.json(results);
  });
});

app.listen(3000, () => console.log('Servidor backend corriendo en puerto 3000'));