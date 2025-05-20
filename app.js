//importar modulos
const express = require("express");
const mysql = require("mysql2");

//configuracion express

const app = express();
const puerto = 3000;
app.use(express.json());

//configuyracion de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "escuela",
};

const connection = mysql.createConnection(dbConfig);

//validar la conexion
connection.connect((error) => {
  if (error) {
    console.error("Error de conexion: ", error);
    return;
  } else {
    console.log("Conectado a la base de datos");
  }
});

//rutas
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de la escuela");
});

app.get("/alumnos", (req, res) => {
  connection.query("SELECT * FROM alumnos", (error, results) => {
    if (error) {
      console.error("Error al obtener los alumnos: ", error);
      res.status(500).send("Error al obtener los alumnos");
      return;
    }
    res.json(results);
  });
});

app.get("/alumnos/:id", (req, res) => {
  const idUsuario = req.params.id;
  const sql = "SELECT * FROM alumnos WHERE id = ?";

  connection.query(sql, [idUsuario], (error, results) => {
    if (error) {
      console.error("Error al obtener el alumno: ", error);
      res.status(500).send("Error al obtener el alumno");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Alumno no encontrado");
      return;
    }
    res.json(results[0]);
  });
});

//insertar usuarios
app.post("/alumnos", (req, res) => {
  const { nombre, ap1, ap2, email, esActivo } = req.body;
  const sql =
    "INSERT INTO alumnos (nombre, ap1, ap2, email, esActivo) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [nombre, ap1, ap2, email, esActivo],
    (error, results) => {
      if (error) {
        console.error("Error al insertar el alumno: ", error);
        res.status(500).send("Error al insertar el alumno");
        return;
      }
      res.status(200).json({ id: results.insertId });
    }
  );
});

//actualizar usuario
app.put("/alumnos/:id", (req, res) => {
  const id = req.params;
  const { nombre, ap1, ap2, email, esActivo } = req.body;
  const sql =
    "UPDATE alumnos SET nombre = ? , ap1 = ?, ap2 = ?, email = ?, esActivo = ? WHERE id = ?";

  connection.query(
    sql,
    [nombre, ap1, ap2, email, esActivo, id],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar alumno", error);
        res.status(500).send("error al actualizar");
        return;
      }
      console.log(sql);
      res.status(200).json({ id: id });
    }
  );
});

//iniciar el servidor
app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto ${puerto}`);
});
