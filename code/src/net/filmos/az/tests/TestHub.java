package net.filmos.az.tests;

import net.filmos.az.Hub;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogChannelConsole;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import java.io.PrintStream;
import java.util.HashMap;
import java.util.List;

import static org.mockito.Mockito.*;

public class TestHub {

    @Test
    public void forwardsLogMessages() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);
        Hub hub = new Hub();
        hub.addLogChannel(channel);

        hub.log("Hi", "");
        hub.log("Hi");
        hub.logImportant("Hi", "");
        hub.logImportant("Hi");
        hub.logWarning("Hi", "");
        hub.logWarning("Hi");
        hub.logError("Hi", "");
        hub.logError("Hi");

        verify(mockPrintStream, times(8)).println(contains("Hi"));
    }

    @Test
    public void logLevelsAreDistinct() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);
        Hub hub = new Hub();
        hub.addLogChannel(channel);

        hub.log("Hi");
        hub.logImportant("Hi");
        hub.logWarning("Hi");
        hub.logError("Hi");

        ArgumentCaptor<String> argument = ArgumentCaptor.forClass(String.class);
        verify(mockPrintStream, atLeast(4)).println(argument.capture());
        List<String> results = argument.getAllValues();
        HashMap<String, Boolean> unique = new HashMap<>();
        int count = 0;
        for(String result : results) {
            if(!result.contains("Hi")) continue;
            count++;
            Assert.assertNull("Message \""+result+"\" appeared more than once,",unique.get(result));
            unique.put(result, true);
        }
        Assert.assertEquals(4, count);
    }
}
