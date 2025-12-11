import ActivityLog from "../models/Activity_logs.js";

async function logAction({ usuarioId, accion, ip }) {
  try {
    await ActivityLog.create({
      usuarioId,
      accion,
      ip: ip || "N/A",
      timestamp: new Date()
    });

    console.log("Alerta creada");
  } catch (err) {
    console.error("Error writing log:", err.message);
  }
}

module.exports = { logAction };