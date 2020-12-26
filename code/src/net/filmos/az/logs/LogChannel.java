package net.filmos.az.logs;

public interface LogChannel {
    String getName();
    void log(LogMessage message);
}
