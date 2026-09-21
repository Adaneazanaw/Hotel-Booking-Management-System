import { useEffect, useState } from "react";

export default function DashReports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/details/reports")
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.message || "Unable to load reports");
        setReport(data.data);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  if (error) return <div className="w-full p-6 text-red-600">{error}</div>;
  if (!report) return <div className="w-full p-6">Loading reports...</div>;

  return (
    <main className="w-full p-6">
      <h1 className="mb-6 text-2xl font-semibold">Reports</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4 shadow-sm"><p className="text-sm text-gray-500">Total rooms</p><strong className="text-2xl">{report.total_rooms}</strong></div>
        <div className="rounded-lg border p-4 shadow-sm"><p className="text-sm text-gray-500">Occupancy rate</p><strong className="text-2xl">{report.occupancy_rate}%</strong></div>
        <div className="rounded-lg border p-4 shadow-sm"><p className="text-sm text-gray-500">Customers</p><strong className="text-2xl">{report.total_customers}</strong></div>
        <div className="rounded-lg border p-4 shadow-sm"><p className="text-sm text-gray-500">Paid revenue</p><strong className="text-2xl">Rs. {report.total_revenue.toFixed(2)}</strong></div>
      </div>
      <section className="mt-6 rounded-lg border p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Bookings by status</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.entries(report.bookings_by_status).map(([status, count]) => (
            <div className="rounded border p-3" key={status}><p className="capitalize text-gray-500">{status.replace("_", " ")}</p><strong>{count}</strong></div>
          ))}
        </div>
      </section>
    </main>
  );
}
