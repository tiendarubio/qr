const db = require("../firebaseConfig");

export default async (req, res) => {
  if (req.method === "POST") {
    const { id, nombre } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const docId = `${id}_${fecha}`;
    const docRef = db.collection("attendance").doc(docId);

    try {
      if (req.url.endsWith("register-entry")) {
        const docSnapshot = await docRef.get();
        if (!docSnapshot.exists) {
          await docRef.set({
            id,
            nombre,
            fecha,
            entrada: new Date(),
            almuerzo_inicio: null,
            almuerzo_fin: null,
            salida: null,
          });
        } else {
          await docRef.update({ entrada: new Date() });
        }
        res.status(200).json({ message: "Entrada registrada correctamente." });
      } else if (req.url.endsWith("start-lunch")) {
        await docRef.update({ almuerzo_inicio: new Date() });
        res.status(200).json({ message: "Inicio de almuerzo registrado." });
      } else if (req.url.endsWith("end-lunch")) {
        await docRef.update({ almuerzo_fin: new Date() });
        res.status(200).json({ message: "Fin de almuerzo registrado." });
      } else if (req.url.endsWith("register-exit")) {
        await docRef.update({ salida: new Date() });
        res.status(200).json({ message: "Salida registrada correctamente." });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en la operación.", error });
    }
  } else if (req.method === "GET") {
    const { id } = req.query;

    try {
      const snapshot = await db
        .collection("attendance")
        .where("id", "==", id)
        .orderBy("fecha", "desc")
        .get();

      const history = snapshot.docs.map((doc) => doc.data());
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial.", error });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
};
