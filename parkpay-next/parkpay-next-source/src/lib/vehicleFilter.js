/** Builds a Mongo filter from the shared plate/status/date_from/date_to query params. */
export function buildFilter(searchParams) {
  const filter = {};
  const plate = searchParams.get("plate");
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  if (plate) filter.plate_number = { $regex: plate.toUpperCase(), $options: "i" };
  if (status) filter.status = status;
  if (dateFrom || dateTo) {
    filter.entry_time = {};
    if (dateFrom) filter.entry_time.$gte = new Date(dateFrom);
    if (dateTo) filter.entry_time.$lte = new Date(dateTo + "T23:59:59");
  }
  return filter;
}
