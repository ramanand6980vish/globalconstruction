package com.globalconstruction.portal.contact;

import com.globalconstruction.portal.contact.dto.ContactRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.contact.to}")
    private String recipientEmail;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public ContactEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest request) {
    	
    	String[] recipients = recipientEmail.split("\\s*,\\s*");

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setFrom(senderEmail);
        mail.setTo(recipients);
        mail.setReplyTo(request.getEmail());

        mail.setSubject(
            "Website Enquiry: " + request.getQueryType()
        );

        String emailBody =
            "Dear Manoj,\n"
            + "New enquiry received from the website with name "+request.getName()+"\n\n" +
            "Name: " + request.getName() + "\n" +
            "Email: " + request.getEmail() + "\n" +
            "Phone: " +
                (request.getPhone() == null ? "Not provided" : request.getPhone()) + "\n" +
            "Query Type: " + request.getQueryType() + "\n\n" +
            "Message:\n" + request.getMessage();

        mail.setText(emailBody);

        try {
            mailSender.send(mail);
        } catch (MailException ex) {
            throw new IllegalStateException(
                "Unable to send email at this time.", ex
            );
        }
    }
}