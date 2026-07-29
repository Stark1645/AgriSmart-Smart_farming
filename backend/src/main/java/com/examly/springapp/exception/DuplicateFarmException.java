package com.examly.springapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateFarmException extends RuntimeException {
    public DuplicateFarmException(String message) {
        super(message);
    }
}
