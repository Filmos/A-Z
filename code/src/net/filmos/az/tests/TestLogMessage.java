package net.filmos.az.tests;

import net.filmos.az.colors.Color;
import net.filmos.az.logs.LogMessage;
import org.junit.Assert;
import org.junit.Test;

public class TestLogMessage {

    @Test
    public void messageRetainsInformation() {
        LogMessage message = new LogMessage("Hello", "there");
        Assert.assertEquals("Hello", message.getMessage());
        Assert.assertEquals("there", message.getAdditionalInformation());
    }
    @Test
    public void multipleMessagesRetainInformation() {
        LogMessage message1 = new LogMessage("This", "is");
        LogMessage message2 = new LogMessage("a", "test");
        Assert.assertEquals("This", message1.getMessage());
        Assert.assertEquals("is", message1.getAdditionalInformation());
        Assert.assertEquals("test", message2.getAdditionalInformation());
        Assert.assertEquals("a", message2.getMessage());
    }

    @Test
    public void defaultMessageHasNoColor() {
        LogMessage message = new LogMessage("Hi", "here");
        Assert.assertNull(message.getColor());
    }

    @Test
    public void messageRetainsColor() {
        LogMessage message1 = new LogMessage("This", "is");
        LogMessage message2 = new LogMessage("a", "test");

        message2.setColor(new Color(24, 127, 234));
        message1.setColor(new Color(21, 117, 214));

        Assert.assertEquals(24, message2.getColor().getRed());
        Assert.assertEquals(127, message2.getColor().getGreen());
        Assert.assertEquals(234, message2.getColor().getBlue());
        Assert.assertEquals(21, message1.getColor().getRed());
        Assert.assertEquals(117, message1.getColor().getGreen());
        Assert.assertEquals(214, message1.getColor().getBlue());
    }

}
