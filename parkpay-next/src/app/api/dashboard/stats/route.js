import { getDb } from "@/lib/mongodb";
import { requireUser, AuthError } from "@/lib/auth";
import { jsonError } from "@/lib/serialize";

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request) {
  try {
    await requireUser(request);
    const db = await getDb();
    const vehicles = db.collection("vehicles");

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const currentlyParked = await vehicles.countDocuments({ status: "parked" });

    const todayExitRows = await vehicles.find({ status: "exited", exit_time: { $gte: todayStart } }).toArray();
    const todayRevenue = todayExitRows.reduce((s, v) => s + (v.fee || 0), 0);

    const monthExitRows = await vehicles.find({ status: "exited", exit_time: { $gte: monthStart } }).toArray();
    const monthRevenue = monthExitRows.reduce((s, v) => s + (v.fee || 0), 0);

    const weekExitRows = await vehicles.find({ status: "exited", exit_time: { $gte: weekStart } }).toArray();
    const revenueByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      revenueByDay[dayKey(d)] = 0;
    }
    for (const v of weekExitRows) {
      const k = dayKey(v.exit_time);
      if (k in revenueByDay) revenueByDay[k] += v.fee || 0;
    }
    const trend = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date, revenue: Math.round(revenue * 100) / 100,
    }));

    const exitsByHour = Array.from({ length: 24 }, (_, h) => ({ hour: h, exits: 0 }));
    for (const v of todayExitRows) {
      exitsByHour[v.exit_time.getHours()].exits += 1;
    }

    return Response.json({
      currently_parked: currentlyParked,
      today_revenue: Math.round(todayRevenue * 100) / 100,
      today_exits: todayExitRows.length,
      month_revenue: Math.round(monthRevenue * 100) / 100,
      revenue_trend_7d: trend,
      exits_by_hour: exitsByHour,
    });
  } catch (e) {
    if (e instanceof AuthError) return jsonError(e.message, e.status);
    throw e;
  }
}
