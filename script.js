document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://employee-management-benston2.onrender.com/employees";

    function calculateAverageSalary(department) {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((employees) => {
                const departmentEmployees = employees.filter(employee => employee.department === department);
                const totalSalary = departmentEmployees.reduce((sum, employee) => sum + parseInt(employee.salary), 0);
                const averageSalary = totalSalary / departmentEmployees.length;

                const averageSalaryResult = document.getElementById("averageSalaryResult");
                if (averageSalaryResult) {
                    averageSalaryResult.textContent = `Average Salary for ${department}: Rs.${averageSalary.toFixed(2)}`;
                }
            })
            .catch((error) => {
                console.error("Error calculating average salary:", error);
            });
    }

    const calculateAverageButton = document.getElementById("calculateAverage");
    if (calculateAverageButton) {
        calculateAverageButton.addEventListener("click", function () {
            const selectedDepartment = document.getElementById("averageSalary").value;
            calculateAverageSalary(selectedDepartment);
        });
    }

    function showAllEmployees() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((employees) => {
                const formContainer = document.getElementById("formContainer");
                const tableContainer = document.getElementById("tableContainer");

                if (formContainer) {
                    formContainer.classList.add("hidden");
                }

                if (tableContainer) {
                    tableContainer.classList.remove("hidden");

                    const tableBody = document.querySelector("#employeeTable tbody");
                    tableBody.innerHTML = "";

                    employees.forEach((employee) => {
                        const row = tableBody.insertRow();
                        row.insertCell(0).textContent = employee.id;
                        row.insertCell(1).textContent = employee.name;
                        row.insertCell(2).textContent = employee.age;
                        row.insertCell(3).textContent = employee.dob;
                        row.insertCell(4).textContent = employee.salary;
                        row.insertCell(5).textContent = employee.department;
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
            });
    }

    function filterByDepartment(department) {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((employees) => {
                const filteredEmployees = employees.filter((employee) => employee.department === department);
                displayFilteredEmployees(filteredEmployees);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
            });
    }

    function filterBySalary(salary) {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((employees) => {
                const filteredEmployees = employees.filter((employee) => employee.salary > salary);
                displayFilteredEmployees(filteredEmployees);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
            });
    }

    function displayFilteredEmployees(filteredEmployees) {
        const formContainer = document.getElementById("formContainer");
        const tableContainer = document.getElementById("tableContainer");

        if (formContainer) {
            formContainer.classList.add("hidden");
        }

        if (tableContainer) {
            tableContainer.classList.remove("hidden");

            const tableBody = document.querySelector("#employeeTable tbody");
            tableBody.innerHTML = "";

            if (filteredEmployees.length > 0) {
                filteredEmployees.forEach((employee) => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = employee.id;
                    row.insertCell(1).textContent = employee.name;
                    row.insertCell(3).textContent = employee.age;
                    row.insertCell(4).textContent = employee.dob;
                    row.insertCell(5).textContent = employee.salary;
                    row.insertCell(6).textContent = employee.department;
                });
            } else {
                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 5;
                cell.textContent = "No employees match the filter criteria.";
            }
        }
    }

    const showAllEmployeesLink = document.querySelector("a[href='#']");
    if (showAllEmployeesLink) {
        showAllEmployeesLink.addEventListener("click", function (event) {
            event.preventDefault();
            showAllEmployees();
        });
    }

    const filterEmployeesLink = document.getElementById("filterEmployeesLink");
    const filterDropdown = document.getElementById("filterDropdown");
    if (filterEmployeesLink && filterDropdown) {
        filterEmployeesLink.addEventListener("click", function (event) {
            event.preventDefault();
            filterDropdown.classList.toggle("hidden");
        });
    }

    const departmentFilter = document.getElementById("departmentFilter");
    const departmentOptions = document.getElementById("departmentOptions");
    if (departmentFilter && departmentOptions) {
        departmentFilter.addEventListener("click", function (event) {
            event.preventDefault();
            departmentOptions.classList.toggle("hidden");
        });

        departmentOptions.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedDepartment = event.target.dataset.filter;
            if (selectedDepartment) {
                filterByDepartment(selectedDepartment);
            }
        });
    }

    const salaryFilter = document.getElementById("salaryFilter");
    const salaryOptions = document.getElementById("salaryOptions");
    if (salaryFilter && salaryOptions) {
        salaryFilter.addEventListener("click", function (event) {
            event.preventDefault();
            salaryOptions.classList.toggle("hidden");
        });

        salaryOptions.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedSalary = parseInt(event.target.dataset.filter);
            if (!isNaN(selectedSalary)) {
                filterBySalary(selectedSalary);
            }
        });
    }

    const searchEmployeeLink = document.querySelector("a[href='#s']");
    if (searchEmployeeLink) {
        searchEmployeeLink.addEventListener("click", function (event) {
            event.preventDefault();
            searchEmployee();
        });
    }

    function searchEmployee() {
        const searchName = prompt("Enter the name of the employee:");
        if (searchName) {
            fetch(apiUrl)
                .then((response) => response.json())
                .then((employees) => {
                    const filteredEmployees = employees.filter((employee) =>
                        employee.name.toLowerCase().includes(searchName.toLowerCase())
                    );

                    const formContainer = document.getElementById("formContainer");
                    const tableContainer = document.getElementById("tableContainer");

                    if (formContainer) {
                        formContainer.classList.add("hidden");
                    }

                    if (tableContainer) {
                        tableContainer.classList.remove("hidden");

                        const tableBody = document.querySelector("#employeeTable tbody");
                        tableBody.innerHTML = "";

                        filteredEmployees.forEach((employee) => {
                            const row = tableBody.insertRow();
                            row.insertCell(0).textContent = employee.id;
                            row.insertCell(1).textContent = employee.name;
                            row.insertCell(2).textContent = employee.age;
                            row.insertCell(3).textContent = employee.dob;
                            row.insertCell(4).textContent = employee.salary;
                            row.insertCell(5).textContent = employee.department;
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                });
        }
    }

    const employeeForm = document.getElementById("employeeForm");
    if (employeeForm) {
        employeeForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const age = document.getElementById("age").value;
            const dob = document.getElementById("dob").value;
            const salary = document.getElementById("salary").value;
            const department = document.getElementById("department").value;

            const newEmployee = {
                name: name,
                age: age,
                dob: dob,
                salary: salary,
                department: department
            };

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEmployee)
            })
                .then((response) => response.json())
                .then((addedEmployee) => {
                    console.log("Employee added successfully:", addedEmployee);
                    employeeForm.reset();
                })
                .catch((error) => {
                    console.error("Error adding employee:", error);
                });
        });
    }

    const deleteEmployeeLink = document.querySelector("a[href='#d']");
    if (deleteEmployeeLink) {
        deleteEmployeeLink.addEventListener("click", function (event) {
            event.preventDefault();

            const employeeIdToDelete = prompt("Enter the ID of the employee to delete:");
            if (employeeIdToDelete !== null) {
                fetch(`${apiUrl}/${employeeIdToDelete}`, {
                    method: "DELETE"
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log(`Employee with ID ${employeeIdToDelete} deleted successfully.`);
                            showAllEmployees();
                        } else {
                            console.error(`Error deleting employee with ID ${employeeIdToDelete}`);
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting employee:", error);
                    });
            }
        });
    }
});
