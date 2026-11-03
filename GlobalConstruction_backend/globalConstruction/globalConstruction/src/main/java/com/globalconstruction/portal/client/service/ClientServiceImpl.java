package com.globalconstruction.portal.client.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.globalconstruction.portal.client.dto.ClientRequest;
import com.globalconstruction.portal.client.dto.ClientResponse;
import com.globalconstruction.portal.client.entity.Client;
import com.globalconstruction.portal.client.mapper.ClientMapper;
import com.globalconstruction.portal.client.repository.ClientRepository;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public ClientServiceImpl(
            ClientRepository clientRepository,
            ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    @Override
    public ClientResponse createClient(ClientRequest request) {

        validateClientCode(request.getClientCode(), null);

        Client client = clientMapper.toEntity(request);

        System.out.println("Before Save ID: " + client.getClientId());

        Client savedClient = clientRepository.save(client);

        System.out.println("After Save ID: " + savedClient.getClientId());

        return clientMapper.toResponse(savedClient);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getClientByCode(String clientCode) {
        return clientMapper.toResponse(findClient(clientCode));
    }

    @Override
    public ClientResponse updateClient(
            String clientId, ClientRequest request) {

        Client existingClient = findClient(clientId);
        validateClientCode(request.getClientCode(), clientId);

        clientMapper.updateEntity(existingClient, request);

        Client updatedClient = clientRepository.save(existingClient);
        return clientMapper.toResponse(updatedClient);
    }

    @Override
    public void deleteClient(String clientId) {
        Client client = findClient(clientId);
        clientRepository.delete(client);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> getClientsByCompanyId(String companyId) {
        return clientRepository.findByCompanyId(companyId)
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> getClientsByStatus(String status) {
        return clientRepository.findByStatusIgnoreCase(status)
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Client findClient(String clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Client not found with ID: " + clientId));
    }

    private void validateClientCode(String clientCode, String currentClientId) {
        if (clientCode == null || clientCode.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Client code is required");
        }

        clientRepository.findByClientCode(clientCode.trim())
                .ifPresent(existingClient -> {
                    if (currentClientId == null
                            || !existingClient.getClientId().equals(currentClientId)) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Client code already exists: " + clientCode);
                    }
                });
    }
}