import {
  Breadcrumb,
  Pagination,
  Spinner,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useState } from "react";
import { FaBed, FaUsers, FaDollarSign, FaSignInAlt } from "react-icons/fa";
import {
  HiHome,
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashOverView() {
  const [fetchData, setFetchData] = useState(null); // Changed to null initially
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch details
  const fetchOverviewDetails = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/details/details-overview");
      const data = await response.json();

      if (data.success) {
        setFetchData(data.data); // Set the data directly
      } else {
        setAlertMessage(
          data.error || "An error occurred while fetching details."
        );
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage("An error occurred while fetching details.");
      setShowAlert(true);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchOverviewDetails();
  }, []);

  // Ensure that fetchData has a valid structure before rendering
  const overviewData = fetchData && fetchData.length > 0 ? fetchData[0] : null;

  const { currentUser } = useSelector((state) => state.user);
  const [bookedDetails, setBookedDetails] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(bookedDetails.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);
  const currentData = bookedDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Pagination

  const formatDate = (date) => {
    if (!date) return "N/A"; // Return "N/A" or another placeholder if the date is invalid
    try {
      // Parse the date as UTC to avoid timezone issues
      const utcDate = new Date(
        Date.UTC(
          new Date(date).getUTCFullYear(),
          new Date(date).getUTCMonth(),
          new Date(date).getUTCDate()
        )
      );

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(utcDate);
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (date) => {
    if (!date) return "N/A"; // Return "N/A" if the date is invalid
    try {
      const utcDate = new Date(
        Date.UTC(
          new Date(date).getUTCFullYear(),
          new Date(date).getUTCMonth(),
          new Date(date).getUTCDate(),
          new Date(date).getUTCHours(),
          new Date(date).getUTCMinutes()
        )
      );

      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC", // Ensure the time is consistent with UTC
      }).format(utcDate);
    } catch {
      return "Invalid Time";
    }
  };

  const calculateDaysBetween = (date_in, date_out) => {
    const startDate = new Date(date_in);
    const endDate = new Date(date_out);

    const differenceInTime = endDate - startDate;
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Ensure days are at least 1
    if (differenceInDays <= 0) {
      differenceInDays = 1;
    }

    return differenceInDays.toFixed(0);
  };

  const fetchBookedDetails = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/booking/get-all-details`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setBookedDetails(data.data);
        setFetchLoading(false);
      } else {
        setFetchLoading(false);
        setShowAlert(true);
        setAlertMessage(data.message);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMessage("");
        }, 10000);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedDetails();
  }, []);

  return (
    <div className="p-3 w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb aria-label="Default breadcrumb example">
            <Link to="/dashboard?tab=dash">
              <Breadcrumb.Item href="" icon={HiHome}>
                Home
              </Breadcrumb.Item>
            </Link>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl ">
            Hotel Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full rounded-lg shadow-lg border border-gray-200">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-lg font-semibold ">
                    Check In
                  </h3>
                  <p className="text-2xl font-semibold">
                    Current Check In : {" "}
                    {overviewData ? overviewData.Total_Check_In : "Loading..."}
                  </p>
                </div>
                <FaSignInAlt className="bg-yellow-400 mt-4 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-yellow-400 font-semibold flex items-center ">
                  Available Rooms : {" "}
                  {overviewData ? overviewData.Available_Rooms : "Loading..."}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4  w-full rounded-md shadow-lg border border-gray-200">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-lg font-semibold ">
                    Rooms
                  </h3>
                  <p className="text-2xl font-semibold">
                    Total Rooms :{" "}
                    {overviewData ? overviewData.Total_Rooms : "Loading..."}
                  </p>
                </div>
                <FaBed className="bg-blue-600 mt-4 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-blue-500 font-semibold flex items-center ">
                  Available Rooms : {" "}
                  {overviewData ? overviewData.Available_Rooms : "Loading..."}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4  w-full rounded-md shadow-lg border border-gray-200">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-lg font-semibold ">
                    Customers
                  </h3>
                  <p className="text-2xl font-semibold">
                    Total Customers :{" "}
                    {overviewData ? overviewData.Total_Customers : "Loading..."}
                  </p>
                </div>
                <FaUsers className="bg-green-500 mt-4 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-500 font-semibold flex items-center ">
                  Active Customers :{" "}
                  {overviewData ? overviewData.Active_Customers : "Loading..."}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4  w-full rounded-md shadow-lg border border-gray-200">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-lg font-semibold ">
                    Revenue
                  </h3>
                  <p className="text-2xl font-semibold">
                    Rs.{" "}
                    {overviewData ? overviewData.Total_Revenue : "Loading..."}
                  </p>
                </div>
                <FaDollarSign className="bg-purple-600 mt-4 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-purple-500 font-semibold flex items-center ">
                  Monthly Revenue : Rs.{" "}
                  {overviewData ? overviewData.Monthly_Revenue : "Loading..."}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Status Chart */}
          {bookedDetails.length > 0 && (
            <div className="mt-6 mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Booking Status Distribution</h2>
              {(() => {
                const statusCounts = bookedDetails.reduce((acc, booking) => {
                  const status = booking.booking_status || "pending";
                  acc[status] = (acc[status] || 0) + 1;
                  return acc;
                }, {});
                const total = bookedDetails.length;
                const statuses = [
                  { key: "confirmed", label: "Confirmed", color: "bg-green-500" },
                  { key: "checked_in", label: "Checked In", color: "bg-indigo-500" },
                  { key: "checked_out", label: "Checked Out", color: "bg-blue-500" },
                  { key: "cancelled", label: "Cancelled", color: "bg-red-500" },
                  { key: "pending", label: "Pending", color: "bg-yellow-400" },
                ];
                return (
                  <div className="space-y-3">
                    {statuses.map(({ key, label, color }) => {
                      const count = statusCounts[key] || 0;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      if (count === 0) return null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-28 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                            <div
                              className={`${color} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                              style={{ width: `${Math.max(percentage, 8)}%` }}
                            >
                              <span className="text-xs font-bold text-white">{count}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          <h1 className="mt-4 mb-3 text-left font-semibold text-xl">
            All Booking Details
          </h1>

          {fetchLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner size="xl" />
            </div>
          ) : (
            <>
              { currentData.length > 0 ? (
                <>
                  <Table hoverable className="shadow-md w-full">
                    <TableHead>
                      <TableHeadCell>Ref No</TableHeadCell>
                      <TableHeadCell>Name</TableHeadCell>
                      <TableHeadCell>Email & Phone</TableHeadCell>
                      <TableHeadCell>Room Name</TableHeadCell>
                      <TableHeadCell>Check In Date</TableHeadCell>
                      <TableHeadCell>Check Out Date</TableHeadCell>
                      <TableHeadCell>No of Days</TableHeadCell>
                      <TableHeadCell>Total Price</TableHeadCell>
                      <TableHeadCell>Status</TableHeadCell>
                    </TableHead>
                    {currentData.map((bookedDetails) => (
                      <Table.Body className="divide-y" key={bookedDetails.id}>
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell>
                            {bookedDetails.reference_number}
                          </TableCell>
                          <TableCell>{bookedDetails.customer_name}</TableCell>
                          <TableCell>
                            {bookedDetails.customer_email}
                            <br />
                            {bookedDetails.customer_phone}
                          </TableCell>
                          <TableCell>
                            {bookedDetails.room_name}
                            <br />
                            {bookedDetails.room_category_name}
                          </TableCell>
                          <TableCell>
                            {formatDate(bookedDetails.date_in)}
                            {<br />}
                            {"At : "}
                            {formatTime(bookedDetails.date_in)}
                          </TableCell>
                          <TableCell>
                            {formatDate(bookedDetails.date_out)}
                            {<br />}
                            {"At : "}
                            {formatTime(bookedDetails.date_out)}
                          </TableCell>
                          <TableCell>
                            {calculateDaysBetween(
                              bookedDetails.date_in,
                              bookedDetails.date_out
                            ) == 0
                              ? 1
                              : calculateDaysBetween(
                                  bookedDetails.date_in,
                                  bookedDetails.date_out
                                )}{" "}
                            days
                          </TableCell>
                          <TableCell>
                            <b>Rs. {bookedDetails.total_price}</b>
                          </TableCell>

                          <TableCell>
                            {bookedDetails.booking_status === "checked_out" ? (
                              <Badge color="success" size="lg">
                                Check Out
                              </Badge>
                            ) : bookedDetails.booking_status ===
                              "checked_in" ? (
                              <Badge color="indigo" size="lg">
                                Check In
                              </Badge>
                            ) : bookedDetails.booking_status === "confirmed" ? (
                              <Badge color="success" size="lg">
                                Confirmed
                              </Badge>
                            ) : bookedDetails.booking_status === "cancelled" ? (
                              <Badge color="failure" size="lg">
                                Cancelled
                              </Badge>
                            ) : (
                              <Badge color="warning" size="lg">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      </Table.Body>
                    ))}
                  </Table>
                  {/* Pagination */}
                  <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                      showIcons
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-96">
                  <HiInformationCircle className="text-4xl text-gray-400" />
                  <h1 className="text-xl font-semibold mt-3 text-gray-400">
                    No data found
                  </h1>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
