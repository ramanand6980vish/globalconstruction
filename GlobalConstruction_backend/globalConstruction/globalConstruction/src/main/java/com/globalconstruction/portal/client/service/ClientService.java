package com.globalconstruction.portal.client.service;

import java.util.List;

import com.globalconstruction.portal.client.dto.ClientRequest;
import com.globalconstruction.portal.client.dto.ClientResponse;

public interface ClientService {

    ClientResponse createClient(ClientRequest request);

    List<ClientResponse> getAllClients();

    ClientResponse getClientByCode(String clientCode);

    ClientResponse updateClient(String clientId, ClientRequest request);

    void deleteClient(String clientCode);

    List<ClientResponse> getClientsByCompanyId(String companyId);

    List<ClientResponse> getClientsByStatus(String status);
}