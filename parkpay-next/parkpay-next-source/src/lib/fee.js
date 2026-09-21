/**
 * Fee calculation — matches the proposal's documented formula exactly
 * (see PROJECT_PROPOSAL, section 6):
 *   hours_full = duration_min // 60
 *   if remainder > grace_minutes: hours_full += 1
 *   amount = max(hours_full * hourly_rate, minimum_charge)
 *
 * Kept as a pure function (no DB/Firebase imports) so it can be unit tested
 * in isolation without any external services.
 */
export function calcFee(entryDate, exitDate, hourlyRate, minimumCharge, graceMinutes) {
  const durationMin = Math.floor((exitDate.getTime() - entryDate.getTime()) / 60000);
  let hoursFull = Math.floor(durationMin / 60);
  const remainder = durationMin % 60;
  if (remainder > graceMinutes) hoursFull += 1;
  const amount = Math.max(hoursFull * hourlyRate, minimumCharge);
  return { durationMin, fee: Math.round(amount * 100) / 100 };
}

export function normalizePlate(plate) {
  return plate.trim().toUpperCase().replace(/\s+/g, "");
}
