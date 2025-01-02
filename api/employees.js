const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("../firebaseConfig"); // Firestore instance

app.use(bodyParser.json());

// Registrar un nuevo empleado
app.post("/api/employees", async (req, res) => {
  const { id, nombre, email } = req.body;

  try {
    if (!id || !nombre) {
      throw new Error("El ID y el nombre son obligatorios");
    }

    const ref = db.collection("employees").doc(id);
    await ref.set({
      id,
      nombre,
      email: email || null,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Empleado registrado correctamente." });
  } catch (error) {
    console.error("Error al registrar empleado:", error.message);
    res.status(500).json({ message: "Error al registrar empleado.", error: error.message });
  }
});

// Obtener la lista de empleados
app.get("/api/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();

    if (snapshot.empty) {
      res.status(200).json([]);
      return;
    }

    const employees = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error al obtener empleados:", error.message);
    res.status(500).json({ message: "Error al obtener empleados.", error: error.message });
  }
});

module.exports = app;
