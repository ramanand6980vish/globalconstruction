package com.globalconstruction.portal.designation.service;

import java.util.List;

import com.globalconstruction.portal.designation.entity.Designation;

public interface DesignationService {

    Designation createDesignation(Designation designation);

    List<Designation> getAllDesignations();

    Designation getDesignationById(String designationId);

    List<Designation> getDesignationsByCompany(String companyId);
}