package net.filmos.az.tests.logs;

import net.filmos.az.colors.Color;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogChannelConsole;
import net.filmos.az.logs.LogDistributor;
import net.filmos.az.logs.LogMessage;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.io.PrintStream;
import java.util.HashMap;
import java.util.List;

import static org.mockito.Mockito.*;

public class TestLogChannel {

    @Test
    public void channelHasValidName() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);

        String name = channel.getName();
        Assert.assertNotNull(name);
        Assert.assertNotEquals("", name);
    }

    @Test
    public void channelTransfersMessages() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);

        channel.log(new LogMessage("Hello",""));
        verify(mockPrintStream).println(anyString());

        channel.log(new LogMessage("Hello",""));
        channel.log(new LogMessage("Hello",""));
        channel.log(new LogMessage("Hi",""));
        verify(mockPrintStream, times(4)).println(anyString());
    }

    @Test
    public void channelTransfersReadableMessages() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);

        channel.log(new LogMessage("Hello",""));
        verify(mockPrintStream).println(contains("Hello"));

        channel.log(new LogMessage("tHeRe",""));
        verify(mockPrintStream).println(contains("tHeRe"));

        channel.log(new LogMessage("traveler",""));
        verify(mockPrintStream).println(
            Mockito.argThat((String s) -> s.contains("traveler") && !s.contains("tHeRe") && !s.contains("Hello"))
        );
    }

    @Test
    public void channelTransfersColoredMessages() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);

        Color[] colors = new Color[]{
                new Color(0, 0, 0),
                new Color(255, 255, 255),
                new Color(97, 97, 97),
                new Color(0, 45, 0),
                new Color(35, 125, 249)
        };

        for(Color color : colors) {
            String messageContent = color.getRed()+"---"+color.getGreen();
            LogMessage messageBlack = new LogMessage(messageContent,"");
            messageBlack.setColor(color);

            channel.log(messageBlack);

            verify(mockPrintStream).println(contains(messageContent));
        }
    }

    @Test
    public void channelDoesNotModifyMessages() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);

        LogMessage message = new LogMessage("Hello there","  small  traveler   ");
        message.setColor(new Color(24, 127, 234));
        channel.log(message);

        Assert.assertEquals("Hello there", message.getMessage());
        Assert.assertEquals("  small  traveler   ", message.getAdditionalInformation());
        Assert.assertEquals(24, message.getColor().getRed());
        Assert.assertEquals(127, message.getColor().getGreen());
        Assert.assertEquals(234, message.getColor().getBlue());


        LogMessage secondMessage = new LogMessage("   Hi!    ","");
        channel.log(secondMessage);

        Assert.assertEquals("   Hi!    ", secondMessage.getMessage());
        Assert.assertEquals("", secondMessage.getAdditionalInformation());
        Assert.assertNull(secondMessage.getColor());


    }

    @Test
    public void logLevelsAreDistinct() {
        PrintStream mockPrintStream = mock(PrintStream.class);
        LogChannel channel = new LogChannelConsole(mockPrintStream);
        LogDistributor distributor = new LogDistributor();
        distributor.addChannel(channel);

        distributor.log("Hi", "");
        distributor.logImportant("Hi", "");
        distributor.logWarning("Hi", "");
        distributor.logError("Hi", "");

        ArgumentCaptor<String> argument = ArgumentCaptor.forClass(String.class);
        verify(mockPrintStream, times(4)).println(argument.capture());
        List<String> results = argument.getAllValues();
        HashMap<String, Boolean> unique = new HashMap<>();
        for(String result : results) {
            Assert.assertNull("Message \""+result+"\" appeared more than once,",unique.get(result));
            unique.put(result, true);
        }
    }
}
