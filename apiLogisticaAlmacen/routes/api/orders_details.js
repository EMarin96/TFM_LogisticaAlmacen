const { existsOrder } = require("../../helpers/middlewares/order.middleware");
const {
  availableLocations,
  existsOrderDetail,
} = require("../../helpers/middlewares/order_detail.middleware");
const { checkRole } = require("../../helpers/middlewares/user.middleware");
const { serverError } = require("../../helpers/validators");
const {
  create,
  getAll,
  deleteById,
  getById,
  update,
} = require("../../models/order_detail.model");

const router = require("express").Router();

router.get(
  "/:orderId",
  checkRole(["Operario", "Encargado"]),
  async (req, res) => {
    const { orderId } = req.params;
    try {
      const details = await getAll(orderId);
      res.json(details);
    } catch (error) {
      serverError(res, error.message);
    }
  }
);

router.get("/", checkRole(["Encargado"]), async (req, res) => {
  try {
    const details = await getany();
    res.json(details);
  } catch (error) {
    serverError(res, error.message);
  }
});

router.post(
  "/:orderId",
  checkRole(["Operario"]),
  existsOrder,
  availableLocations,
  async (req, res) => {
    const { orderId } = req.params;
    try {
      const result = await create(orderId, req.body);
      res.json(result);
    } catch (error) {
      serverError(res, error.message);
    }
  }
);

router.put(
  "/:orderId/details/:orderDetailId",
  checkRole(["Operario"]),
  existsOrder,
  existsOrderDetail,
  async (req, res) => {
    const { orderId, orderDetailId } = req.params;
    try {
      const result = await update(orderId, orderDetailId, req.body);
      res.json(result);
    } catch (error) {
      serverError(res, error.message);
    }
  }
);

router.delete(
  "/:orderId/details/:orderDetailId",
  checkRole(["Operario"]),
  existsOrder,
  existsOrderDetail,
  async (req, res) => {
    const { orderId, orderDetailId } = req.params;
    try {
      const result = await deleteById(orderId, orderDetailId);
      res.json(result);
    } catch (error) {
      serverError(res, error.message);
    }
  }
);

module.exports = router;
