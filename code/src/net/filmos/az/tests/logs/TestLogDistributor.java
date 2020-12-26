package net.filmos.az.tests.logs;

import net.filmos.az.colors.Color;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogChannelConsole;
import net.filmos.az.logs.LogDistributor;
import net.filmos.az.logs.LogMessage;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

import java.io.PrintStream;

import static org.mockito.Mockito.*;

public class TestLogDistributor {

    @Test
    public void distributorTransfersMessages() {
        LogChannel channel = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();
        distributor.addChannel(channel);

        distributor.log("Hello","");
        verify(channel).log(any());

        distributor.logWarning("Hello","");
        distributor.logImportant("Hello","");
        distributor.logError("Hi","");
        verify(channel, times(4)).log(any());
    }

    @Test
    public void distributorTransfersReadableMessages() {
        LogChannel channel = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();
        distributor.addChannel(channel);

        distributor.log("Hello","");
        verify(channel).log(argThat((LogMessage m) -> m.getMessage().contains("Hello")));

        distributor.log("tHeRe","");
        verify(channel).log(argThat((LogMessage m) -> m.getMessage().contains("tHeRe")));

        distributor.log("traveler","");
        verify(channel).log(
            argThat((LogMessage m) -> m.getMessage().contains("traveler") && !m.getMessage().contains("tHeRe") && !m.getMessage().contains("Hello"))
        );
    }

    @Test
    public void distributorManagesMultipleChannels() {
        LogChannel channel1 = mock(LogChannel.class);
        LogChannel channel2 = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();

        distributor.log("Test","");
        verify(channel1, never()).log(any());
        verify(channel2, never()).log(any());

        distributor.addChannel(channel1);
        distributor.log("Test","");
        verify(channel1, times(1)).log(any());
        verify(channel2, never()).log(any());

        distributor.addChannel(channel2);
        distributor.log("Test","");
        verify(channel1, times(2)).log(any());
        verify(channel2, times(1)).log(any());
    }
}
