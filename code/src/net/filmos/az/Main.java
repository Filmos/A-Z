package net.filmos.az;

import net.filmos.az.logs.LogChannelConsole;

public class Main {

    public static void main(String [] args) {
        Hub app = new Hub();
        app.addLogChannel(new LogChannelConsole(System.out));
        app.logImportant("Hi");
        app.log("Hello world");
        app.logWarning("Wow!");
        app.logError("No way");
    }
}
