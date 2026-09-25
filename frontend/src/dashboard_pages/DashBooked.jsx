import {
  Alert,
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
  Badge,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useState } from "react";
import { FaWindowClose, FaPlus, FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { HiHome, HiInformationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchJson } from "../utils/fetchJson";

export default function DashBooked() {
  const { currentUser } = useSelector((state) => state.user);

  // ── Data ─────────────────────────────────────────────────────────────────
  const [bookedDetails, setBookedDetails] = useState([]);
  const [customers,     setCustomers]     = useState([]);
  const [rooms,         setRooms]         = useState([]);

  // ── Loading / Alerts ─────────────────────────────────────────────────────
  const [fetchLoading,  setFetchLoading]  = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAlert,     setShowAlert]     = useState(false);
  const [alertMessage,  setAlertMessage]  = useState("");
  const [alertColor,    setAlertColor]    = useState("success");

  // ── Modal state ───────────────────────────────────────────────────────────
  // "view"   → row-click detail modal (shows info + Edit / Cancel buttons)
  // "create" → new booking modal
  // "edit"   → edit form modal
  // "cancel" → cancel confirm modal
  const [activeModal, setActiveModal] = useState(null); // null | "view" | "create" | "edit" | "cancel"

  // ── Selected booking ─────────────────────────────────────────────────────
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Create form ───────────────────────────────────────────────────────────
  const [createForm, setCreateForm] = useState({
    customer_id: "",
    room_id: "",
    check_in: "",
    check_out: "",
  });

  // ── Edit form ─────────────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState({
    new_room_id: "",
    date_in: "",
    date_out: "",
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages  = Math.ceil(bookedDetails.length / itemsPerPage);
  const onPageChange = (page) => setCurrentPage(page);
  const currentData = bookedDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showFlash = (msg, color = "success") => {
    setAlertMessage(msg);
    setAlertColor(color);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 6000);
  };

  const closeModal = () => setActiveModal(null);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }).format(utc);
    } catch { return "Invalid Date"; }
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      const utc = new Date(Date.UTC(
        d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
        d.getUTCHours(), d.getUTCMinutes()
      ));
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric", minute: "numeric", hour12: true, timeZone: "UTC",
      }).format(utc);
    } catch { return "Invalid Time"; }
  };

  const toDateTimeLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return [
      d.getUTCFullYear(),
      String(d.getUTCMonth() + 1).padStart(2, "0"),
      String(d.getUTCDate()).padStart(2, "0"),
    ].join("-") + "T" + [
      String(d.getUTCHours()).padStart(2, "0"),
      String(d.getUTCMinutes()).padStart(2, "0"),
    ].join(":");
  };

  const calcDays = (date_in, date_out) => {
    if (!date_in || !date_out) return "N/A";
    return Math.max(1, Math.round((new Date(date_out) - new Date(date_in)) / (1000 * 3600 * 24)));
  };

  const statusBadge = (status) => {
    if (status === "checked_out") return <Badge color="success">Checked Out</Badge>;
    if (status === "checked_in")  return <Badge color="indigo">Checked In</Badge>;
    if (status === "confirmed")   return <Badge color="success">Confirmed</Badge>;
    if (status === "cancelled")   return <Badge color="failure">Cancelled</Badge>;
    return <Badge color="warning">Pending</Badge>;
  };

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const fetchBookedDetails = async () => {
    setFetchLoading(true);
    try {
      const res  = await fetch("/api/booking/get-all-details", { credentials: "include" });
      const data = await fetchJson(res);
      if (res.ok) setBookedDetails(data.data);
      else showFlash(data.message, "failure");
    } catch (e) { console.error(e); }
    finally { setFetchLoading(false); }
  };

  const fetchCustomers = async () => {
    try {
      const res  = await fetch("/api/customer/getcustomers", { credentials: "include" });
      const data = await fetchJson(res);
      if (res.ok) setCustomers(data.customers);
    } catch (e) { console.error(e); }
  };

  const fetchRooms = async () => {
    try {
      const res  = await fetch("/api/room/getroom-all-details", { credentials: "include" });
      const data = await fetchJson(res);
      if (res.ok) setRooms(data.rooms);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchBookedDetails();
    fetchCustomers();
    fetchRooms();
  }, []);

  // Pre-fill edit form when edit modal opens
  useEffect(() => {
    if (activeModal === "edit" && selectedBooking) {
      setEditForm({
        new_room_id: selectedBooking.room_id || "",
        date_in:     toDateTimeLocal(selectedBooking.date_in),
        date_out:    toDateTimeLocal(selectedBooking.date_out),
      });
    }
  }, [activeModal, selectedBooking]);

  // ── Row click → open view modal ───────────────────────────────────────────
  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setActiveModal("view");
  };

  // From view modal: go to edit modal
  const openEditFromView = () => {
    fetchRooms();
    setActiveModal("edit");
  };

  // From view modal: go to cancel modal
  const openCancelFromView = () => {
    setActiveModal("cancel");
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res  = await fetch("/api/booking/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await fetchJson(res);
      if (res.ok) {
        closeModal();
        setCreateForm({ customer_id: "", room_id: "", check_in: "", check_out: "" });
        showFlash(data.message, "success");
        fetchBookedDetails();
        fetchRooms();
      } else {
        showFlash(data.message, "failure");
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res  = await fetch("/api/booking/edit", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          room_id:    editForm.new_room_id,
          check_in:   editForm.date_in,
          check_out:  editForm.date_out,
        }),
      });
      const data = await fetchJson(res);
      if (res.ok) {
        closeModal();
        showFlash(data.message, "success");
        fetchBookedDetails();
        fetchRooms();
      } else {
        showFlash(data.message, "failure");
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res  = await fetch(`/api/booking/cancel/${selectedBooking.booking_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await fetchJson(res);
      if (res.ok) {
        closeModal();
        showFlash(data.message, "success");
        fetchBookedDetails();
        fetchRooms();
      } else {
        showFlash(data.message, "failure");
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const canEditCancel =
    selectedBooking?.booking_status === "pending" ||
    selectedBooking?.booking_status === "confirmed";

  return (
    <div className="p-3 w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <Breadcrumb aria-label="breadcrumb">
            <Link to="/dashboard?tab=dash">
              <Breadcrumb.Item href="" icon={HiHome}>Home</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Booking</Breadcrumb.Item>
          </Breadcrumb>

          {/* Header */}
          <div className="flex items-center justify-between mt-3 mb-3">
            <h1 className="font-semibold text-xl">All Booking Details</h1>
            <Button
              className="bg-customBlue"
              size="sm"
              onClick={() => { fetchCustomers(); fetchRooms(); setActiveModal("create"); }}
            >
              <FaPlus className="mr-2 mt-0.5" />
              New Booking
            </Button>
          </div>

          {/* Alert */}
          {showAlert && (
            <Alert
              className="mb-3"
              color={alertColor}
              icon={HiInformationCircle}
              onDismiss={() => setShowAlert(false)}
            >
              <span className="font-medium">
                {alertColor === "success" ? "Success! " : "Error! "}
              </span>
              {alertMessage}
            </Alert>
          )}

          {/* ════════════════════════════════════════════════════════════
              VIEW MODAL  — opens when user clicks a row
              Shows full booking info + Edit / Cancel action buttons
          ════════════════════════════════════════════════════════════ */}
          <Modal show={activeModal === "view"} onClose={closeModal} size="lg">
            <Modal.Header>
              <span className="font-semibold">Booking Details</span>
              {selectedBooking && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  #{selectedBooking.reference_number}
                </span>
              )}
            </Modal.Header>
            <Modal.Body>
              {selectedBooking && (
                <div className="flex flex-col gap-4">
                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Reference No</p>
                      <p className="font-medium font-mono">{selectedBooking.reference_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Status</p>
                      {statusBadge(selectedBooking.booking_status)}
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Customer</p>
                      <p className="font-medium">{selectedBooking.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Contact</p>
                      <p>{selectedBooking.customer_phone}</p>
                      <p className="text-xs text-gray-500">{selectedBooking.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Room</p>
                      <p className="font-medium">{selectedBooking.room_name}</p>
                      <p className="text-xs text-gray-500">{selectedBooking.room_category_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Total Price</p>
                      <p className="font-bold text-base">Rs. {selectedBooking.total_price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Check-In</p>
                      <p>{formatDate(selectedBooking.date_in)}</p>
                      <p className="text-xs text-gray-500">At: {formatTime(selectedBooking.date_in)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Check-Out</p>
                      <p>{formatDate(selectedBooking.date_out)}</p>
                      <p className="text-xs text-gray-500">At: {formatTime(selectedBooking.date_out)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">Duration</p>
                      <p>{calcDays(selectedBooking.date_in, selectedBooking.date_out)} days</p>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-600" />

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2">
                    <Button color="gray" onClick={closeModal}>Close</Button>
                    {canEditCancel && (
                      <>
                        <Button
                          className="bg-green-600"
                          onClick={openEditFromView}
                        >
                          <MdEditSquare className="mr-2 mt-0.5" />
                          Edit Booking
                        </Button>
                        <Button
                          color="failure"
                          onClick={openCancelFromView}
                        >
                          <FaWindowClose className="mr-2 mt-0.5" />
                          Cancel Booking
                        </Button>
                      </>
                    )}
                    {!canEditCancel && (
                      <p className="text-sm text-gray-400 italic self-center">
                        This booking cannot be edited or cancelled.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal>

          {/* ════════════════════════════════════════════════════════════
              CREATE MODAL
          ════════════════════════════════════════════════════════════ */}
          <Modal show={activeModal === "create"} onClose={closeModal} size="lg">
            <Modal.Header>New Room Booking</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div>
                  <Label value="Select Customer" />
                  <Select
                    required
                    value={createForm.customer_id}
                    onChange={(e) => setCreateForm({ ...createForm, customer_id: e.target.value })}
                  >
                    <option value="">-- Select a customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.email} — {c.contact_no}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label value="Select Room" />
                  <div className="flex gap-4 mb-1 text-sm text-gray-500">
                    <span>✅ Available: {rooms.filter(r => r.status?.toLowerCase() === "available").length}</span>
                    <span>🔴 Occupied: {rooms.filter(r => r.status?.toLowerCase() !== "available").length}</span>
                  </div>
                  <Select
                    required
                    value={createForm.room_id}
                    onChange={(e) => setCreateForm({ ...createForm, room_id: e.target.value })}
                  >
                    <option value="">-- Select a room --</option>
                    {rooms.map((r) => {
                      const avail = r.status?.toLowerCase() === "available";
                      return (
                        <option key={r.id} value={r.id} disabled={!avail}>
                          {r.room_name} — {r.category_name} — Rs. {r.price} —{" "}
                          {avail ? "✅ Available" : "🔴 Occupied"}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <Label value="Check-In Date & Time" />
                  <TextInput
                    type="datetime-local"
                    required
                    value={createForm.check_in}
                    onChange={(e) => setCreateForm({ ...createForm, check_in: e.target.value })}
                  />
                </div>

                <div>
                  <Label value="Check-Out Date & Time" />
                  <TextInput
                    type="datetime-local"
                    required
                    value={createForm.check_out}
                    onChange={(e) => setCreateForm({ ...createForm, check_out: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button color="gray" onClick={closeModal}>Cancel</Button>
                  <Button className="bg-customBlue" type="submit" disabled={actionLoading}>
                    {actionLoading
                      ? <><Spinner size="sm" /><span className="pl-2">Creating…</span></>
                      : <><FaPlus className="mr-2 mt-0.5" />Create Booking</>}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {/* ════════════════════════════════════════════════════════════
              EDIT MODAL
          ════════════════════════════════════════════════════════════ */}
          <Modal show={activeModal === "edit"} onClose={closeModal} size="lg">
            <Modal.Header>Edit Booking — {selectedBooking?.reference_number}</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEdit} className="flex flex-col gap-4">
                {/* Current info read-only strip */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
                  <div><Label value="Customer: " />{selectedBooking?.customer_name}</div>
                  <div><Label value="Current Room: " />{selectedBooking?.room_name}</div>
                </div>

                <div>
                  <Label value="Select New Room" />
                  <Select
                    required
                    value={editForm.new_room_id}
                    onChange={(e) => setEditForm({ ...editForm, new_room_id: e.target.value })}
                  >
                    <option value="">-- Select a room --</option>
                    {rooms.map((r) => {
                      const isCurrent = Number(r.id) === Number(selectedBooking?.room_id);
                      const avail     = r.status?.toLowerCase() === "available" || isCurrent;
                      return (
                        <option key={r.id} value={r.id} disabled={!avail}>
                          {r.room_name} — {r.category_name} — Rs. {r.price} —{" "}
                          {isCurrent ? "(Current)" : avail ? "✅ Available" : "🔴 Occupied"}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <Label value="New Check-In Date & Time" />
                  <TextInput
                    type="datetime-local"
                    required
                    value={editForm.date_in}
                    onChange={(e) => setEditForm({ ...editForm, date_in: e.target.value })}
                  />
                </div>

                <div>
                  <Label value="New Check-Out Date & Time" />
                  <TextInput
                    type="datetime-local"
                    required
                    value={editForm.date_out}
                    onChange={(e) => setEditForm({ ...editForm, date_out: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {/* Back goes to view modal, not full close */}
                  <Button color="gray" onClick={() => setActiveModal("view")}>Back</Button>
                  <Button className="bg-green-700" type="submit" disabled={actionLoading}>
                    {actionLoading
                      ? <><Spinner size="sm" /><span className="pl-2">Saving…</span></>
                      : <><MdEditSquare className="mr-2 mt-0.5" />Save Changes</>}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {/* ════════════════════════════════════════════════════════════
              CANCEL MODAL
          ════════════════════════════════════════════════════════════ */}
          <Modal show={activeModal === "cancel"} onClose={closeModal} size="md">
            <Modal.Header>Cancel Booking</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleCancel} className="flex flex-col gap-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to cancel this booking? This cannot be undone.
                </p>
                <div className="bg-red-50 dark:bg-gray-700 border border-red-200 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-2 text-sm">
                  <div><Label value="Reference: " /><b>{selectedBooking?.reference_number}</b></div>
                  <div><Label value="Customer: " />{selectedBooking?.customer_name}</div>
                  <div><Label value="Room: " />{selectedBooking?.room_name}</div>
                  <div><Label value="Check-In: " />{formatDate(selectedBooking?.date_in)}</div>
                  <div><Label value="Check-Out: " />{formatDate(selectedBooking?.date_out)}</div>
                  <div><Label value="Total: " /><b>Rs. {selectedBooking?.total_price}</b></div>
                </div>
                <div className="flex justify-end gap-2">
                  {/* Back goes to view modal */}
                  <Button color="gray" onClick={() => setActiveModal("view")}>Back</Button>
                  <Button color="failure" type="submit" disabled={actionLoading}>
                    {actionLoading
                      ? <><Spinner size="sm" /><span className="pl-2">Cancelling…</span></>
                      : <><FaWindowClose className="mr-2 mt-0.5" />Confirm Cancel</>}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {/* ════════════════════════════════════════════════════════════
              TABLE  — every row is clickable
          ════════════════════════════════════════════════════════════ */}
          {fetchLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spinner size="xl" />
            </div>
          ) : currentData.length > 0 ? (
            <>
              <p className="text-xs text-gray-400 mb-2">
                Click any row to view details and edit or cancel the booking.
              </p>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Ref No</TableHeadCell>
                  <TableHeadCell>Customer</TableHeadCell>
                  <TableHeadCell>Room</TableHeadCell>
                  <TableHeadCell>Check In</TableHeadCell>
                  <TableHeadCell>Check Out</TableHeadCell>
                  <TableHeadCell>Days</TableHeadCell>
                  <TableHeadCell>Total</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableHead>

                {currentData.map((b) => (
                  <Table.Body className="divide-y" key={b.id}>
                    <TableRow
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => openViewModal(b)}
                    >
                      <TableCell className="font-mono text-xs">{b.reference_number}</TableCell>
                      <TableCell>
                        <div className="font-medium">{b.customer_name}</div>
                        <div className="text-xs text-gray-500">{b.customer_phone}</div>
                      </TableCell>
                      <TableCell>
                        <div>{b.room_name}</div>
                        <div className="text-xs text-gray-500">{b.room_category_name}</div>
                      </TableCell>
                      <TableCell>
                        {formatDate(b.date_in)}<br />
                        <span className="text-xs text-gray-500">At: {formatTime(b.date_in)}</span>
                      </TableCell>
                      <TableCell>
                        {formatDate(b.date_out)}<br />
                        <span className="text-xs text-gray-500">At: {formatTime(b.date_out)}</span>
                      </TableCell>
                      <TableCell>{calcDays(b.date_in, b.date_out)} days</TableCell>
                      <TableCell><b>Rs. {b.total_price}</b></TableCell>
                      <TableCell>{statusBadge(b.booking_status)}</TableCell>
                    </TableRow>
                  </Table.Body>
                ))}
              </Table>

              <div className="flex overflow-x-auto sm:justify-center mt-3">
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
              <h1 className="text-xl font-semibold mt-3 text-gray-400">No bookings found</h1>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
