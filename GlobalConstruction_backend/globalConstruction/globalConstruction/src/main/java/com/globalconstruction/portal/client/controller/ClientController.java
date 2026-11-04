package com.globalconstruction.portal.client.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.globalconstruction.portal.client.dto.ClientRequest;
import com.globalconstruction.portal.client.dto.ClientResponse;
import com.globalconstruction.portal.client.service.ClientService;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://globalconstruction.onrender.com"
})
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<ClientResponse> createClient(
            @Valid @RequestBody ClientRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createClient(request));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{clientCode}")
    public ResponseEntity<ClientResponse> getClientById(
            @PathVariable String clientCode) {

        return ResponseEntity.ok(clientService.getClientByCode(clientCode));
    }

    @PutMapping("/{clientCode}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable String clientCode,
            @Valid @RequestBody ClientRequest request) {

        return ResponseEntity.ok(
                clientService.updateClient(clientCode, request));
    }

    @DeleteMapping("/{clientCode}")
    public ResponseEntity<Void> deleteClient(
            @PathVariable String clientCode) {

        clientService.deleteClient(clientCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ClientResponse>> getClientsByCompanyId(
            @PathVariable String companyId) {

        return ResponseEntity.ok(
                clientService.getClientsByCompanyId(companyId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClientResponse>> getClientsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                clientService.getClientsByStatus(status));
    }
}
