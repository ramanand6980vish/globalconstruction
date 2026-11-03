package com.globalconstruction.portal.client.mapper;

import org.springframework.stereotype.Component;

import com.globalconstruction.portal.client.dto.ClientRequest;
import com.globalconstruction.portal.client.dto.ClientResponse;
import com.globalconstruction.portal.client.entity.Client;

@Component
public class ClientMapper {

    public Client toEntity(ClientRequest request) {
        Client client = new Client();
        updateEntity(client, request);
        return client;
    }

    public void updateEntity(Client client, ClientRequest request) {
        client.setCompanyId(request.getCompanyId().trim());
        client.setClientCode(request.getClientCode().trim());
        client.setClientName(request.getClientName().trim());
        client.setContactPerson(trimToNull(request.getContactPerson()));
        client.setMobileNo(trimToNull(request.getMobileNo()));
        client.setEmail(trimToNull(request.getEmail()));
        client.setAddress(trimToNull(request.getAddress()));
        client.setGstin(trimToNull(request.getGstin()));

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            client.setStatus(request.getStatus().trim().toUpperCase());
        } else if (client.getStatus() == null || client.getStatus().trim().isEmpty()) {
            client.setStatus("ACTIVE");
        }
    }

    public ClientResponse toResponse(Client client) {
        ClientResponse response = new ClientResponse();

        response.setClientId(client.getClientId());
        response.setCompanyId(client.getCompanyId());
        response.setClientCode(client.getClientCode());
        response.setClientName(client.getClientName());
        response.setContactPerson(client.getContactPerson());
        response.setMobileNo(client.getMobileNo());
        response.setEmail(client.getEmail());
        response.setAddress(client.getAddress());
        response.setGstin(client.getGstin());
        response.setStatus(client.getStatus());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());

        return response;
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}