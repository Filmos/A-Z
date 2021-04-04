package net.filmos.az.gui.storage;

public class InvalidStorableDictException extends Exception {
    public InvalidStorableDictException(String message) {
        super(message);
    }

    public InvalidStorableDictException(String message, Throwable cause) {
        super(message, cause);
    }
}
