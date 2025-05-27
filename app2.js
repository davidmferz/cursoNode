const express = require("express");
const { Sequelize, where } = require("sequelize");

//configuracion express
const app = express();
const puerto = 3000;
app.use(express.json());

//configuracion de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "escuela",
  dialect: "mysql",
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

//importar la tabla
const Alumno = require("./models/alumnos")(sequelize);

//validar la conexion
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error de conexion: ", error);
  }
}
connectDB();

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de la escuela 2");
});

app.get("/alumnos", async (req, res) => {
  try {
    const alumnos = await Alumno.findAll(); //SELECT * FROM alumnos
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/alumnos/:id", async (req, res) => {
  const idUsuario = req.params.id;
  try {
    const alumnos = await Alumno.findAll({ where: { id: idUsuario } });
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.post("/alumnos", async (req, res) => {
  const { nombre, ap1, ap2, email, esActivo } = req.body;
  const body = {
    nombre: nombre,
    ap1: ap1,
    ap2: ap2,
    email: email,
    esActivo: esActivo,
  };

  const respuesta = await Alumno.create(body);
  res.json(respuesta);
});

app.put("/alumnos/:id", async (req, res) => {
  const id = req.params.id;
  console.log("idUsuario", id);
  const { nombre, ap1, ap2, email, esActivo } = req.body;
  const body = {
    nombre: nombre,
    ap1: ap1,
    ap2: ap2,
    email: email,
    esActivo: esActivo,
  };

  const respuesta = await Alumno.update(body, {
    where: { id },
  });
  res.json(respuesta);
});

//iniciar el servidor
app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto ${puerto}`);
});
