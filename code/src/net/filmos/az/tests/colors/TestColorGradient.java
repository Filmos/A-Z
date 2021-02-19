package net.filmos.az.tests.colors;

import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorGradient;
import org.junit.Assert;
import org.junit.Test;

import java.util.Arrays;

public class TestColorGradient {

    @Test
    public void preciseLeftValue() {
        Color color1 = new Color(34, 123, 245);
        Color color2 = new Color(213, 4, 111);
        ColorGradient gradient = new ColorGradient(color1, color2);

        Assert.assertEquals(color1.toHexString(), gradient.getColor(0).toHexString());
        Assert.assertEquals(color1.toHexString(), gradient.getColor(-0.1f).toHexString());
        Assert.assertEquals(color1.toHexString(), gradient.getColor(-4).toHexString());
    }

    @Test
    public void preciseRightValue() {
        Color color1 = new Color(34, 123, 245);
        Color color2 = new Color(213, 4, 111);
        ColorGradient gradient = new ColorGradient(color1, color2);

        Assert.assertEquals(color2.toHexString(), gradient.getColor(1).toHexString());
        Assert.assertEquals(color2.toHexString(), gradient.getColor(1.15f).toHexString());
        Assert.assertEquals(color2.toHexString(), gradient.getColor(5.3f).toHexString());
    }

    @Test
    public void singleColorGradient() {
        Color color = new Color(34, 123, 245);
        ColorGradient gradient = new ColorGradient(color, color);

        Assert.assertEquals(color.toHexString(), gradient.getColor(0).toHexString());
        Assert.assertEquals(color.toHexString(), gradient.getColor(1).toHexString());
        Assert.assertEquals(color.toHexString(), gradient.getColor(0.23f).toHexString());
        Assert.assertEquals(color.toHexString(), gradient.getColor(0.5999f).toHexString());
        Assert.assertEquals(color.toHexString(), gradient.getColor(0.8f).toHexString());
    }

    @Test
    public void channelsDontLeak() {
        Color color1 = new Color(34, 123, 225);
        Color color2 = new Color(201, 123, 225);
        ColorGradient gradient = new ColorGradient(color1, color2);

        for(float ratio : Arrays.asList(0.04f, 0.23f, 0.69f, 0.92f)) {
            Color color = gradient.getColor(ratio);
            Assert.assertEquals(123, color.getGreen());
            Assert.assertEquals(225, color.getBlue());
        }
    }

    @Test
    public void monochromeStaysMonochrome() {
        Color color1 = new Color(12, 12, 12);
        Color color2 = new Color(123, 123, 123);
        ColorGradient gradient = new ColorGradient(color1, color2);

        for(float ratio : Arrays.asList(0.04f, 0.23f, 0.69f, 0.92f)) {
            Color color = gradient.getColor(ratio);
            Assert.assertEquals(color.getRed(), color.getGreen());
            Assert.assertEquals(color.getRed(), color.getBlue());
        }
    }
}
