const db = require("../firebaseConfig");
const QRCode = require("qrcode");

export default async (req, res) => {
  if (req.method === "POST") {
    const { id, nombre, email } = req.body;

    try {
      const qrData = `${id};entry`;
      const qrCode = await QRCode.toDataURL(qrData);

      await db.collection("employees").doc(id).set({
        id,
        nombre,
        email,
        qrCode,
      });

      res.status(200).json({ message: "Empleado registrado correctamente.", qrCode });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar empleado.", error });
    }
  } else if (req.method === "GET") {
    try {
      const snapshot = await db.collection("employees").get();
      const employees = snapshot.docs.map((doc) => doc.data());

      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener empleados.", error });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
};
