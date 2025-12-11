import ActivityLog from "../models/Activity_logs.js";

export async function logAction({ usuarioId, accion, ip }) {
  await ActivityLog.create({
    usuarioId,
    accion,
    ip: ip || "N/A",
  });
}
