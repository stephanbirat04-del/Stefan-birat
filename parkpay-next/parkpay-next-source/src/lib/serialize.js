/** Converts a MongoDB vehicle document to the API's plain JSON shape. */
export function serializeVehicle(v) {
  return {
    id: v._id.toString(),
    plate_number: v.plate_number,
    owner_phone: v.owner_phone,
    vehicle_type: v.vehicle_type,
    entry_time: v.entry_time ? v.entry_time.toISOString() : null,
    exit_time: v.exit_time ? v.exit_time.toISOString() : null,
    duration_min: v.duration_min ?? null,
    fee: v.fee ?? null,
    status: v.status,
    payment_status: v.payment_status,
    logged_by: v.logged_by || "",
  };
}

export function serializeSettings(s) {
  return {
    lot_name: s.lot_name,
    hourly_rate: s.hourly_rate,
    minimum_charge: s.minimum_charge,
    grace_minutes: s.grace_minutes,
  };
}

export function jsonError(message, status) {
  return Response.json({ detail: message }, { status });
}
