const router = require("express").Router();
const { checkSchema } = require("express-validator");
const { badRequest } = require("../../helpers/validators");
const { newWarehouse } = require("../../helpers/schemas/warehouse.schema");
const { getLocationByWarehouseId } = require("../../models/location.model");
const {
    getAll,
    getWareHouseById,
    create,
    update,
    deleteById,
    getByUser,
} = require("../../models/warehouse.model");

router.get("/", (req, res) => {
    getAll()
        .then(async (warehouse) => {
            let respuesta = [];
            for (let element of warehouse) {
                const locations = await getLocationByWarehouseId(element.id);
                const item = {
                    id: element.id,
                    description: element.description,
                    address: element.address,
                    locations,
                };
                respuesta.push(item);
            }
            res.json(respuesta);
        })
        .catch((error) => {
            res.json({ fatal: error.message });
        });
});

router.get("/:warehouseId", async (req, res) => {
    const { warehouseId } = req.params;
    const warehouse = await getWareHouseById(warehouseId);
    if (warehouse) {
        const response = {
            description: warehouse.description,
            address: warehouse.address,
        };
        res.json(response);
    } else {
        res.json({ error: "No existe un almacen con ese ID" });
    }
});

router.get("/users/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const warehouses = await getByUser(userId);
        res.json(warehouses);
    } catch (error) {
        serverError(res, error.message);
    }
});

router.post("/", checkSchema(newWarehouse), badRequest, async (req, res) => {
    try {
        const result = await create(req.body);
        const warehouse = await getWareHouseById(result.insertId);
        res.json(warehouse);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

router.put("/", async (req, res) => {
    const warehouse = req.body;
    console.log(req.body);
    const result = await update(warehouse);
    res.json(result);
});

router.delete("/:warehouseId", async (req, res) => {
    const { warehouseId } = req.params;
    const result = await deleteById(warehouseId);
    res.json(result);
});

module.exports = router;
