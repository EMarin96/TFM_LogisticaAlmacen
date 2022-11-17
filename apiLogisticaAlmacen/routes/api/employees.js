const router = require('express').Router();
const { checkSchema } = require('express-validator');
const { newEmployee } = require('../../helpers/schemas/employee.schema');
const { badRequest } = require('../../helpers/validators');
const { getAll, getById, create, update, deleteById } = require('../../models/employee.model');
const { getRolById } = require('../../models/role.model');
const { getuserByIdEmployee } = require('../../models/user.model');
const { getwerehouseByIdUser } = require('../../models/users_warehouses.model')



router.get('/', (req, res) => {
    getAll()
        .then(employee => {
            res.json(employee);
        })
        .catch((error) => {
            res.json({ fatal: error.message });
        });
});

router.get('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const employee = await getById(employeeId);
    if (employee) {
        const user = await getuserByIdEmployee(employeeId)
        if (user) {    
            const userwerehause = await getwerehouseByIdUser(user.id)
        
        }

        res.json(employee)
    } else {
        res.json({ error: 'No existe un empleado con ese ID' })
    }

   
});

router.post('/',
    checkSchema(newEmployee),
    badRequest
    , async (req, res) => {
        try {
            const result = await create(req.body);
            const employee = await getById(result.insertId);
            res.json(employee);
        } catch (error) {
            res.json({ fatal: error.message });
        }
});

router.put('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const result = await update(employeeId, req.body);
    res.json(result);
});

router.delete('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const result = await deleteById(employeeId);
    res.json(result);
});

module.exports = router;