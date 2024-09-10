const express = require("express");
const couponsRoutes = express();
const CouponController = require("../modules/Coupons/Features");

// Coupons Routes
couponsRoutes.get("/api/v1/coupons", CouponController.list);
couponsRoutes.put("/api/v1/coupons/:id", CouponController.update);
couponsRoutes.post("/api/v1/coupons", CouponController.create);
couponsRoutes.delete("/api/v1/coupons", CouponController.delete);

module.exports = couponsRoutes;
