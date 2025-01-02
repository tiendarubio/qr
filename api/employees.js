const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("../firebaseConfig"); // Firestore instance
const QRCode = require("qrcode"); // Librería para generar QR

app.use(bodyParser.json());

// Registrar un nuevo empleado
app.post("/api/employees", async (req, res) => {
  const { id, nombre, email } = req.body;

  if (!id || !nombre) {
    return res.status(400).json({ message: "ID y nombre son obligatorios." });
  }

  try {
    // Generar datos del QR
    const qrData = `${id};entry`; // El QR contendrá el ID del empleado
    const qrCode = await QRCode.toDataURL(qrData);

    // Guardar en Firestore
    const ref = db.collection("employees").doc(id);
    await ref.set({
      id,
      nombre,
      email,
      qrCode,
    });

    res.status(200).json({ message: "Empleado registrado y QR generado.", qrCode });
  } catch (error) {
    console.error("Error al registrar empleado:", error); // Log para depuración
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// Obtener la lista de empleados
app.get("/api/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();
    const employees = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados.", error });
  }
});

module.exports = app;
