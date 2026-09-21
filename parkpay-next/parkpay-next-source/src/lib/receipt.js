export function printReceipt(r) {
  const win = window.open("", "_blank", "width=380,height=600");
  if (!win) return;

  const fmt = (iso) => (iso ? iso.slice(0, 16).replace("T", " ") : "—");

  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt ${r.receipt_no}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; width: 300px; margin: 24px auto; color: #111; font-size: 13px; }
          h1 { font-size: 16px; text-align: center; margin: 0 0 2px; letter-spacing: 0.05em; }
          .sub { text-align: center; font-size: 11px; color: #555; margin-bottom: 14px; }
          hr { border: none; border-top: 1px dashed #999; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          .plate { text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 0.1em; margin: 8px 0; }
          .total { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 10px; }
          .foot { text-align: center; font-size: 11px; color: #555; margin-top: 16px; }
          @media print { body { margin: 0 auto; } }
        </style>
      </head>
      <body>
        <h1>${r.lot_name}</h1>
        <div class="sub">Parking Receipt #${r.receipt_no}</div>
        <hr />
        <div class="plate">${r.plate_number}</div>
        <div class="row"><span>Vehicle type</span><span>${r.vehicle_type}</span></div>
        <div class="row"><span>Owner phone</span><span>${r.owner_phone}</span></div>
        <hr />
        <div class="row"><span>Entry</span><span>${fmt(r.entry_time)}</span></div>
        <div class="row"><span>Exit</span><span>${fmt(r.exit_time)}</span></div>
        <div class="row"><span>Duration</span><span>${r.duration_display}</span></div>
        <div class="row"><span>Hourly rate</span><span>Rs.${r.hourly_rate}</span></div>
        <hr />
        <div class="total"><span>Total</span><span>Rs.${r.fee}</span></div>
        <div class="row" style="margin-top:6px;"><span>Payment</span><span>${r.payment_status}</span></div>
        <div class="foot">Printed ${fmt(r.printed_at)}<br/>Thank you for parking with us</div>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
