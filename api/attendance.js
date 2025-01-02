const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("../firebaseConfig"); // Firestore instance

app.use(bodyParser.json());

// Registrar entrada
app.post("/api/register-entry", async (req, res) => {
  const { id, nombre } = req.body;

  try {
    const fecha = new Date().toISOString().split("T")[0];
    const ref = db.collection("attendance").doc(`${id}_${fecha}`);
    await ref.set({
      id,
      nombre,
      fecha,
      entrada: new Date(),
    });
    res.status(200).json({ message: "Entrada registrada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar entrada.", error });
  }
});

// Registrar inicio de almuerzo
app.post("/api/start-lunch", async (req, res) => {
  const { id } = req.body;

  try {
    const fecha = new Date().toISOString().split("T")[0];
    const ref = db.collection("attendance").doc(`${id}_${fecha}`);
    await ref.update({
      almuerzo_inicio: new Date(),
    });
    res.status(200).json({ message: "Inicio de almuerzo registrado." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar inicio de almuerzo.", error });
  }
});

// Registrar fin de almuerzo
app.post("/api/end-lunch", async (req, res) => {
  const { id } = req.body;

  try {
    const fecha = new Date().toISOString().split("T")[0];
    const ref = db.collection("attendance").doc(`${id}_${fecha}`);
    await ref.update({
      almuerzo_fin: new Date(),
    });
    res.status(200).json({ message: "Fin de almuerzo registrado." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar fin de almuerzo.", error });
  }
});

// Registrar salida
app.post("/api/register-exit", async (req, res) => {
  const { id } = req.body;

  try {
    const fecha = new Date().toISOString().split("T")[0];
    const ref = db.collection("attendance").doc(`${id}_${fecha}`);
    await ref.update({
      salida: new Date(),
    });
    res.status(200).json({ message: "Salida registrada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar salida.", error });
  }
});

module.exports = app;
