package net.filmos.az.tests.colors;

import net.filmos.az.colors.Color;
import org.junit.Assert;
import org.junit.Test;

public class TestColor {

    @Test
    public void colorRetainsInformation() {
        Color color = new Color(34, 123, 245);

        Assert.assertEquals( 34, color.getRed());
        Assert.assertEquals(123, color.getGreen());
        Assert.assertEquals(245, color.getBlue());
    }
    @Test
    public void multipleColorsRetainInformation() {
        Color color1 = new Color(34, 123, 245);
        Color color2 = new Color(213L, 4L, 111L);

        Assert.assertEquals(34, color1.getRed());
        Assert.assertEquals(123, color1.getGreen());
        Assert.assertEquals(245, color1.getBlue());
        Assert.assertEquals(111, color2.getBlue());
        Assert.assertEquals(213, color2.getRed());
        Assert.assertEquals(4, color2.getGreen());
    }

    @Test
    public void convertToPaintColor() {
        Color color = new Color(34, 123, 245);
        javafx.scene.paint.Color paintColor = color.toPaintColor();

        Assert.assertEquals( 34/255d, paintColor.getRed(), 1/255d);
        Assert.assertEquals(123/255d, paintColor.getGreen(), 1/255d);
        Assert.assertEquals(245/255d, paintColor.getBlue(), 1/255d);
    }

    @Test
    public void convertToHexString() {
        Color color = new Color(5, 168, 2);
        Assert.assertEquals("#05a802", color.toHexString());
    }
}
