const express = require("express");
const { Sequelize, where } = require("sequelize");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//configuracion express
const app = express();
const puerto = 3000;
app.use(express.json());

//configuracion de swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Escuela",
      version: "1.0.0",
      description: "API para gestionar alumnos de una escuela",
    },
    servers: [
      {
        url: `http://localhost:${puerto}`,
      },
    ],
  },
  apis: ["./app2.js"], // Ruta a los archivos donde se encuentran las anotaciones de Swagger
};

//configuracion de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "Escuela",
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

/** @swagger
 * /alumnos:
 *   get:
 *     summary: Obtener todos los alumnos
 *     responses:
 *       200:
 *         description: Lista de alumnos obtenida correctamente
 *       500:
 *         description: Error al obtener los alumnos
 */
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

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsDoc(swaggerOptions))
);

//iniciar el servidor
app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto ${puerto}`);
});
