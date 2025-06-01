package com.employee.springboot.thymeleafdemo.controller;

import com.employee.springboot.thymeleafdemo.entity.Employee;
import com.employee.springboot.thymeleafdemo.exceptions.NotFoundException;
import com.employee.springboot.thymeleafdemo.service.EmployeeService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.employee.springboot.thymeleafdemo.exceptions.ErrorResponse;

import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

	private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

	private final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	// GET all employees
	@GetMapping
	public ResponseEntity<?> getAllEmployees() {
		logger.info("Request received: GET all employees");
		var employees = employeeService.findAll();
		logger.info("Returning {} employees", employees.size());
		return ResponseEntity.ok(employees);
	}

	// GET employee by ID
	@GetMapping("/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
		logger.info("Request received: GET employee by ID {}", id);
		Employee employee = employeeService.findById(id); // throws NotFoundException if not found
		logger.info("Employee found: {}", employee);
		return ResponseEntity.ok(employee);
	}

	// POST create new employee
	@PostMapping
	public ResponseEntity<?> addEmployee(@Valid @RequestBody Employee employee) {
		logger.info("Request received: POST add new employee with email {}", employee.getEmail());
		Optional<Employee> existing = employeeService.findByEmail(employee.getEmail());
		if (existing.isPresent()) {
			logger.warn("Conflict: Employee with email {} already exists", employee.getEmail());
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(new ErrorResponse(
							HttpStatus.CONFLICT.value(),
							"Employee with this email already exists.",
							java.time.LocalDateTime.now()
					));
		}
		Employee saved = employeeService.save(employee);
		logger.info("Employee created successfully with ID {}", saved.getId());
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	// PUT update existing employee
	@PutMapping("/{id}")
	public ResponseEntity<Employee> updateEmployee(@PathVariable int id, @Valid @RequestBody Employee employee) {
		logger.info("Request received: PUT update employee with ID {}", id);
		if (!employeeService.existsById(id)) {
			logger.error("Employee not found with ID {}", id);
			throw new NotFoundException("Employee not found with id " + id);
		}
		employee.setId(id);
		Employee updated = employeeService.save(employee);
		logger.info("Employee updated successfully with ID {}", updated.getId());
		return ResponseEntity.ok(updated);
	}

	// DELETE employee
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteEmployee(@PathVariable int id) {
		logger.info("Request received: DELETE employee with ID {}", id);
		if (!employeeService.existsById(id)) {
			logger.error("Employee not found with ID {}", id);
			throw new NotFoundException("Employee not found with id " + id);
		}
		employeeService.deleteById(id);
		logger.info("Employee deleted successfully with ID {}", id);
		return ResponseEntity.ok(new ErrorResponse(
				HttpStatus.OK.value(),
				"Employee with id " + id + " deleted.",
				java.time.LocalDateTime.now()
		));
	}
}
