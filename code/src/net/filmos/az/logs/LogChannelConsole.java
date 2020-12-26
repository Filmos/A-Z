package net.filmos.az.logs;

import net.filmos.az.colors.Color;

import java.io.PrintStream;

public class LogChannelConsole implements LogChannel {
    private final PrintStream outputStream;

    @Override
    public String getName() {return "console";}

    public LogChannelConsole(PrintStream outputStream) {
        this.outputStream = outputStream;
    }

    @Override
    public void log(LogMessage message) {
        String colorPrefix = getColorPrefix(message.getColor());
        String colorSuffix = "\u001B[0m";
        outputStream.println(colorPrefix+message.getMessage()+colorSuffix);
    }
    private String getColorPrefix(Color color) {
        if(color == null) return "";
        return "\u001B[38;2;"+color.getRed()+";"+color.getGreen()+";"+color.getBlue()+"m";
    }
}
