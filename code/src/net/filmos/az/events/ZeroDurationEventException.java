package net.filmos.az.events;

public class ZeroDurationEventException extends Exception {

    public ZeroDurationEventException(String message) {
        super(message);
    }

    public ZeroDurationEventException(String message, Throwable cause) {
        super(message, cause);
    }
}
