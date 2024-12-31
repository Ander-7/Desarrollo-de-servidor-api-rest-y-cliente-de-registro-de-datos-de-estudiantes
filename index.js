const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(express.json());
app.use(cors()); 

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '77777', 
  database: 'escuela'
});


db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});


app.get('/', (req, res) => {
  res.send("API de Estudiantes");
});


app.get('/api/estudiantes', (req, res) => {
  const query = 'SELECT * FROM estudiantes';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener un estudiante por ID
app.get('/api/estudiantes/:id', (req, res) => {
  const query = 'SELECT * FROM estudiantes WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Estudiante no encontrado" });
    } else {
      res.json(results[0]);
    }
  });
});

// Agregar un nuevo estudiante
app.post('/api/estudiantes', (req, res) => {
  const { nombre, edad, grado, promedio } = req.body;

  if (!nombre || !edad || !grado || !promedio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO estudiantes (nombre, edad, grado, promedio) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, edad, grado, promedio], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: result.insertId, nombre, edad, grado, promedio });
    }
  });
});

// Actualizar un estudiante por ID
app.put('/api/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, edad, grado, promedio } = req.body;

  if (!nombre || !edad || !grado || !promedio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'UPDATE estudiantes SET nombre = ?, edad = ?, grado = ?, promedio = ? WHERE id = ?';
  db.query(query, [nombre, edad, grado, promedio, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Estudiante no encontrado" });
    } else {
      res.json({ id, nombre, edad, grado, promedio });
    }
  });
});

// Eliminar un estudiante por ID
app.delete('/api/estudiantes/:id', (req, res) => {
  const query = 'DELETE FROM estudiantes WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Estudiante no encontrado" });
    } else {
      res.json({ message: "Estudiante eliminado" });
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://192.168.18.14:${port}`);
});
