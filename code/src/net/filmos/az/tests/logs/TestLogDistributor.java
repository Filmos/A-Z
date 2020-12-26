package net.filmos.az.tests.logs;

import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogDistributor;
import net.filmos.az.logs.LogMessage;
import org.junit.Test;

import static org.mockito.Mockito.*;

public class TestLogDistributor {

    private LogMessage messageContains(String substring) {
        return argThat((LogMessage m) -> m.getMessage().contains(substring));
    }

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
        verify(channel).log(messageContains("Hello"));

        distributor.log("tHeRe","");
        verify(channel).log(messageContains("tHeRe"));

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
        verify(channel1, never()).log(messageContains("Test1"));
        verify(channel2, never()).log(messageContains("Test1"));

        distributor.addChannel(channel1);
        distributor.log("Test2","");
        verify(channel1, times(1)).log(messageContains("Test2"));
        verify(channel2, never()).log(messageContains("Test2"));

        distributor.addChannel(channel2);
        distributor.log("Test3","");
        verify(channel1, times(1)).log(messageContains("Test3"));
        verify(channel2, times(1)).log(messageContains("Test3"));
    }

    @Test
    public void newBufferIsEmpty() {
        LogChannel channel = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();
        distributor.addChannel(channel);

        verify(channel, never()).log(any());
    }

    @Test
    public void bufferStoresMessages() {
        LogChannel channel1 = mock(LogChannel.class);
        LogChannel channel2 = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();

        distributor.log("Test","");
        distributor.log("is","");
        distributor.log("here","");
        distributor.addChannel(channel1);
        verify(channel1, times(3)).log(any());
        verify(channel2, never()).log(any());

        distributor.log("and","");
        distributor.log("there","");
        distributor.addChannel(channel2);
        verify(channel1, times(5)).log(any());
        verify(channel2, times(5)).log(any());
    }

    @Test
    public void bufferRetainsMessageInformation() {
        LogChannel channel = mock(LogChannel.class);
        LogDistributor distributor = new LogDistributor();

        distributor.log("Test","");
        distributor.log("is","");
        distributor.log("here","");
        distributor.addChannel(channel);

        verify(channel).log(messageContains("Test"));
        verify(channel).log(messageContains("here"));
        verify(channel).log(messageContains("is"));
    }
}
