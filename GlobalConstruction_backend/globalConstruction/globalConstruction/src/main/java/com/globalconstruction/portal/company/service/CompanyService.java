package com.globalconstruction.portal.company.service;

import java.util.List;

import com.globalconstruction.portal.company.entity.Company;

public interface CompanyService {

    Company createCompany(Company company);

    List<Company> getAllCompanies();

    Company getCompanyById(String companyId);
}