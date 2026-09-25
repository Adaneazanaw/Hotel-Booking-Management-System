const test = require("node:test");
const assert = require("node:assert/strict");
const models = require("../models");
const bookingController = require("../controllers/booking-mutation.controller");
const bookedController = require("../controllers/booked.controller");

function mockResponse() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

test("booking history is recorded before lifecycle mutations", async () => {
  const originalModels = {
    sequelize: models.sequelize,
    Room: models.Room,
    Customer: models.Customer,
    Booking: models.Booking,
    Checking: models.Checking,
    AuditLog: models.AuditLog,
  };
  const events = [];
  const transaction = {};
  const room = {
    id: 3,
    status: "available",
    room_name: "Room 3",
    update: async () => events.push("room:update"),
  };
  const booking = {
    id: 8,
    room_id: 3,
    reference_number: "BK-TEST",
    status: "confirmed",
    update: async (changes) => {
      events.push("booking:update");
      Object.assign(booking, changes);
    },
  };
  const response = mockResponse();

  models.sequelize = { transaction: async (callback) => callback(transaction) };
  models.Room = {
    findByPk: async () => room,
    update: async () => events.push("room:update"),
  };
  models.Customer = { findByPk: async () => ({ id: 5 }) };
  models.Booking = {
    findByPk: async () => booking,
    create: async () => {
      events.push("booking:create");
      return booking;
    },
  };
  models.Checking = { create: async () => events.push("checking:create") };
  models.AuditLog = { create: async () => events.push("audit:create") };

  try {
    const assertAuditBefore = (mutation) => {
      assert.ok(events.indexOf("audit:create") < events.indexOf(mutation), events.join(", "));
    };

    await bookingController.createBooking(
      { body: { room_id: 3, customer_id: 5, check_in: "2026-10-01", check_out: "2026-10-02" } },
      response
    );
    assert.equal(response.statusCode, 201);
    assertAuditBefore("booking:create");

    events.length = 0;
    await bookingController.editBooking(
      { body: { booking_id: 8, room_id: 3, check_in: "2026-10-01", check_out: "2026-10-02" } },
      response
    );
    assert.equal(response.statusCode, 200);
    assertAuditBefore("booking:update");

    events.length = 0;
    await bookingController.cancelBooking({ params: { booking_id: 8 } }, response);
    assert.equal(response.statusCode, 200);
    assertAuditBefore("booking:update");

    events.length = 0;
    booking.status = "confirmed";
    await bookedController.checkIn({ body: { booking_id: 8 } }, response);
    assert.equal(response.statusCode, 200);
    assertAuditBefore("booking:update");

    events.length = 0;
    await bookedController.checkOut({ body: { booking_id: 8 } }, response);
    assert.equal(response.statusCode, 200);
    assertAuditBefore("booking:update");
  } finally {
    Object.assign(models, originalModels);
  }
});