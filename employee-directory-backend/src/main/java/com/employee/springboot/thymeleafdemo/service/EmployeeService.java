package com.employee.springboot.thymeleafdemo.service;

import java.util.List;
import java.util.Optional;

import com.employee.springboot.thymeleafdemo.entity.Employee;

public interface EmployeeService {

	List<Employee> findAll();
	
	Employee findById(int theId);

	Employee save(Employee theEmployee);
	void deleteById(int theId);
	Optional<Employee> findByEmail(String email);
	boolean existsById(int id);
}
