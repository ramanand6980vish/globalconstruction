package com.globalconstruction.portal.contact;

import com.globalconstruction.portal.contact.dto.ContactRequest;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(
	    origins = {
	        "http://localhost:5173"	        
	    },
	    methods = {
	        RequestMethod.POST,
	        RequestMethod.OPTIONS
	    }
	)
public class ContactController {

    private final ContactEmailService contactEmailService;

    public ContactController(ContactEmailService contactEmailService) {
        this.contactEmailService = contactEmailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(
            @Valid @RequestBody ContactRequest request) {

        contactEmailService.sendContactEmail(request);

        return ResponseEntity.ok(
            Map.of("message", "Your message has been sent successfully!")
        );
    }
}