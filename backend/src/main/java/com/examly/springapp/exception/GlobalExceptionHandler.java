package com.examly.springapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidNameException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidName(InvalidNameException ex) {
        return buildErrorResponse("InvalidNameException", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidPhoneException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidPhone(InvalidPhoneException ex) {
        return buildErrorResponse("InvalidPhoneException", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateFarmException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateFarm(DuplicateFarmException ex) {
        return buildErrorResponse("DuplicateFarmException", ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UnauthorisedAccessException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorisedAccess(UnauthorisedAccessException ex) {
        return buildErrorResponse("UnauthorisedAccessException", ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse("ResourceNotFoundException", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildErrorResponse("InternalServerError", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(String exception, String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("exception", exception);
        body.put("message", message);
        body.put("status", status.value());
        body.put("timestamp", LocalDateTime.now().toString());
        return new ResponseEntity<>(body, status);
    }
}
