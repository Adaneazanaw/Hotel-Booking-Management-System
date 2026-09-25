import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  FileInput,
  Badge,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useRef, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import {
  HiHome,
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashBookingCreate() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    customer_id: "",
    room_id: "",
    check_in: "",
    check_out: "",
  });

  const [customer, setCustomer] = useState([]);
  const [room, setRoom] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);

  const [createLoading, setCreateLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("failure");

  const fetchCustomer = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/customer/getcustomers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.customers);
        setFetchLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoading(false);
    }
  };

  const fetchRoom = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/room/getroom-all-details`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRoom(data.rooms);
        setFetchLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoading(false);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/booking/get-all-details`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setBookingDetails(data.data);
        setFetchLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setFetchLoading(false);
    }
  };

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(bookingDetails.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);
  const currentData = bookingDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Pagination

  useEffect(() => {
    fetchCustomer();
    fetchRoom();
    fetchBookingDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch(`/api/booking/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setCreateLoading(false);
        setFormData({
          customer_id: "",
          room_id: "",
          check_in: "",
          check_out: "",
        });
        fetchBookingDetails();
        setShowAlert(true);
        setAlertColor("success");
        setAlertMessage(data.message);
        fetchCustomer();
        fetchRoom();
        setTimeout(() => {
          setShowAlert(false);
          setAlertMessage("");
        }, 6000);
      } else {
        setCreateLoading(false);
        setShowAlert(true);
        setAlertColor("failure");
        setAlertMessage(data.message);
      }
    } catch (error) {
      console.log(error.message);
      setCreateLoading(false);
    }
  };

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
            <Breadcrumb.Item>Room Booking Create</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            New Booking
          </h1>

          <div className="flex p-3 flex-col md:flex-row gap-8 justify-between">
            {/* Left Side */}
            <div className="flex-[2] ">
              <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                Room Booking Form
              </h1>
              {showAlert && (
                <Alert
                  className="mb-3"
                  color={alertColor}
                  icon={HiInformationCircle}
                >
                  <span className="font-medium">
                    {alertColor === "success" ? "Success! " : "Error! "}
                  </span>{" "}
                  {alertMessage}
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <div className="mb-2 block">
                    <Label value="Select a Customer" />
                  </div>
                  <Select
                    value={formData.customer_id}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        customer_id: e.target.value,
                      });
                    }}
                    required
                    shadow
                  >
                    <option value="">Select a customer</option>
                    {customer.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.email} - {c.contact_no}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Select a Room" />
                  </div>
                  <div className="flex gap-4 mb-2 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                      Available: {room.filter((r) => r.status && r.status.toLowerCase() === "available").length}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                      Occupied: {room.filter((r) => !r.status || r.status.toLowerCase() !== "available").length}
                    </span>
                    <span className="text-gray-500">Total: {room.length}</span>
                  </div>
                  <Select
                    value={formData.room_id}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        room_id: e.target.value,
                      });
                    }}
                    required
                    shadow
                  >
                    <option value="">Select a Room</option>
                    {room.map((r) => {
                      const isAvailable = r.status && r.status.toLowerCase() === "available";
                      return (
                        <option key={r.id} value={r.id} disabled={!isAvailable}>
                          {r.room_name} - {r.category_name} - Rs. {r.price} - {isAvailable ? "✅ Available" : "🔴 Occupied"}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <Label value="Check In Date & Time" />
                  <TextInput
                    id="check_in"
                    type="datetime-local"
                    value={formData.check_in}
                    required
                    shadow
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        check_in: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label value="Check Out Date & Time" />
                  <TextInput
                    id="check_out"
                    type="datetime-local"
                    value={formData.check_out}
                    required
                    shadow
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        check_out: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    className="bg-customBlue"
                    type="submit"
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Creating...</span>
                      </>
                    ) : (
                      "Create Booking"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Side */}
            <div className="flex-[6] ">
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
                          <TableHeadCell>Room Details</TableHeadCell>
                          <TableHeadCell>Customer Name</TableHeadCell>
                          <TableHeadCell>Check In Date</TableHeadCell>
                          <TableHeadCell>Check Out Date</TableHeadCell>
                          <TableHeadCell>Price</TableHeadCell>

                          <TableHeadCell>Status</TableHeadCell>
                        </TableHead>
                        {currentData.map((bookingDetails) => (
                          <Table.Body
                            className="divide-y"
                            key={bookingDetails.id}
                          >
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                              <TableCell>
                                {bookingDetails.reference_number}
                              </TableCell>
                              <TableCell>
                                {bookingDetails.room_name}
                                <br />
                                {bookingDetails.room_category_name}
                              </TableCell>
                              <TableCell>
                                {bookingDetails.customer_name}
                              </TableCell>
                              <TableCell>
                                {formatDate(bookingDetails.date_in)}
                                <br />
                                {"At : "}
                                {formatTime(bookingDetails.date_in)}
                              </TableCell>
                              <TableCell>
                                {formatDate(bookingDetails.date_out)}
                                <br />
                                {"At : "}
                                {formatTime(bookingDetails.date_out)}
                              </TableCell>
                              <TableCell>
                                <b>Rs. {bookingDetails.total_price}</b>
                              </TableCell>
                              <TableCell>
                                {bookingDetails.booking_status ===
                                "checked_out" ? (
                                  <Badge color="success" size="lg">
                                    Check Out
                                  </Badge>
                                ) : bookingDetails.booking_status ===
                                  "checked_in" ? (
                                  <Badge color="indigo" size="lg">
                                    Check In
                                  </Badge>
                                ) : bookingDetails.booking_status ===
                                  "confirmed" ? (
                                  <Badge color="success" size="lg">
                                    Confirmed
                                  </Badge>
                                ) : bookingDetails.booking_status ===
                                  "cancelled" ? (
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
                    <div className="flex justify-center items-center h-96">
                      <p className="text-center text-gray-500 dark:text-gray-400">
                        No booking found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
