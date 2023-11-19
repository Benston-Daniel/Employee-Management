const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
// const corsOptions = {
//     origin: 'D:\Student_FE\TryHard\index.html', // Replace with your actual frontend domain
//     optionsSuccessStatus: 204, // Some legacy browsers choke on 204
// };
app.use(express.json());
app.use(cors());

// Endpoint to get all employees
app.get('/employees', async (req, res) => {
    try {
        const data = await fs.readFile('employees.json', 'utf-8');
        const employees = JSON.parse(data);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to read and parse employees.json
async function readEmployeesFile() {
    const data = await fs.readFile('employees.json', 'utf-8');
    return JSON.parse(data);
}

// Function to write employees to employees.json
async function writeEmployeesFile(employees) {
    await fs.writeFile('employees.json', JSON.stringify(employees, null, 2));
}

// Endpoint to add a new employee
app.post('/employees', async (req, res) => {
    try {
        console.log("Inside Post");
        const newEmployee = req.body;
        const employees = await readEmployeesFile();

        // Assign a new ID and increment the last used ID
        newEmployee.id = (parseInt(employees[employees.length - 1].id) + 1).toString();

        employees.push(newEmployee);
        await writeEmployeesFile(employees);

        res.json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to delete an existing employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employees = await readEmployeesFile();

        const index = employees.findIndex((employee) => employee.id === employeeId);

        if (index !== -1) {
            // Remove the employee and decrement the last used ID
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

// ... (Other endpoints remain unchanged)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
