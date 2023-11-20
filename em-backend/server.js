const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
// const corsOptions = {
//     origin: 'https://benston-daniel.github.io/Employee-Management/', 
//     optionsSuccessStatus: 204, 
// };
app.use(express.json());
app.use(cors());

app.get('/employees', async (req, res) => {
    try {
        const data = await fs.readFile('employees.json', 'utf-8');
        const employees = JSON.parse(data);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function readEmployeesFile() {
    const data = await fs.readFile('employees.json', 'utf-8');
    return JSON.parse(data);
}

async function writeEmployeesFile(employees) {
    await fs.writeFile('employees.json', JSON.stringify(employees, null, 2));
}

app.post('/employees', async (req, res) => {
    try {
        console.log("Inside Post");
        const newEmployee = req.body;
        const employees = await readEmployeesFile();

        newEmployee.id = (parseInt(employees[employees.length - 1].id) + 1).toString();

        employees.push(newEmployee);
        await writeEmployeesFile(employees);

        res.json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employees = await readEmployeesFile();

        const index = employees.findIndex((employee) => employee.id === employeeId);

        if (index !== -1) {
            employees.splice(index, 1);
            await writeEmployeesFile(employees);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
