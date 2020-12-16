package net.filmos.az.logs;

import net.filmos.az.colors.Color;

import java.io.PrintStream;

public class LogChannelConsole implements LogChannel {
    private final PrintStream outputStream;

    public LogChannelConsole(PrintStream outputStream) {
        this.outputStream = outputStream;
    }

    @Override
    public void log(LogMessage message) {
        Color color = message.getColor();
        String colorPrefix = "\u001B[38;2;"+color.getRed()+";"+color.getGreen()+";"+color.getBlue()+"m";
        outputStream.println(colorPrefix+message.getMessage());
    }
}
