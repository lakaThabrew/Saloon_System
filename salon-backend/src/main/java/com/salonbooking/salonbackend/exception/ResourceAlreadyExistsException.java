package com.salonbooking.salonbackend.exception;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String message){
        super(message);
    }
}
