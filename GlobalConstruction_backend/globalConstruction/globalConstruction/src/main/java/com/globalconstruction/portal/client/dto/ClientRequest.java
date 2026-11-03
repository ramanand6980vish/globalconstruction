package com.globalconstruction.portal.client.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClientRequest {

    @NotBlank(message = "Company ID is required")
    @Size(max = 36)
    private String companyId;

    @NotBlank(message = "Client code is required")
    @Size(max = 30)
    private String clientCode;

    @NotBlank(message = "Client name is required")
    @Size(max = 200)
    private String clientName;

    @Size(max = 150)
    private String contactPerson;

    @Size(max = 20)
    private String mobileNo;

    @Email(message = "Enter a valid email address")
    @Size(max = 150)
    private String email;

    private String address;

    @Size(max = 20)
    private String gstin;

    @Size(max = 20)
    private String status;

    public String getCompanyId() { return companyId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }

    public String getClientCode() { return clientCode; }
    public void setClientCode(String clientCode) { this.clientCode = clientCode; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}