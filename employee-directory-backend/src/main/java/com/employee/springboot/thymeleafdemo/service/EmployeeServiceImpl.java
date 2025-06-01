package com.employee.springboot.thymeleafdemo.service;

import java.util.List;
import java.util.Optional;

import com.employee.springboot.thymeleafdemo.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.employee.springboot.thymeleafdemo.dao.EmployeeRepository;
import com.employee.springboot.thymeleafdemo.entity.Employee;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	private final EmployeeRepository employeeRepository;

	@Autowired
	public EmployeeServiceImpl(EmployeeRepository theEmployeeRepository) {
		this.employeeRepository = theEmployeeRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Employee> findAll() {
		logger.info("Fetching all employees ordered by last name");
		List<Employee> employees = employeeRepository.findAllByOrderByLastNameAsc();
		logger.info("Found {} employees", employees.size());
		return employees;
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Employee> findByEmail(String email) {
		logger.info("Searching for employee with email: {}", email);
		return employeeRepository.findByEmail(email);
	}

	@Override
	@Transactional(readOnly = true)
	public Employee findById(int theId) {
		logger.info("Fetching employee by ID: {}", theId);
		return employeeRepository.findById(theId)
				.orElseThrow(() -> {
					logger.error("Employee not found with id - {}", theId);
					return new NotFoundException("Employee not found with id - " + theId);
				});
	}

	@Override
	@Transactional
	public Employee save(Employee theEmployee) {
		Integer id = theEmployee.getId(); // Integer, can be null

		if (id != null && id != 0 && !employeeRepository.existsById(id)) {
			throw new NotFoundException("Employee with id " + id + " does not exist for update");
		}
		Employee savedEmployee = employeeRepository.save(theEmployee);
		return savedEmployee;
	}

	@Override
	@Transactional
	public void deleteById(int theId) {
		logger.info("Deleting employee with ID: {}", theId);
		if (!employeeRepository.existsById(theId)) {
			logger.error("Employee not found with id - {}", theId);
			throw new NotFoundException("Employee not found with id - " + theId);
		}
		employeeRepository.deleteById(theId);
		logger.info("Deleted employee with ID: {}", theId);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsById(int id) {
		logger.info("Checking existence of employee with ID: {}", id);
		return employeeRepository.existsById(id);
	}
}
