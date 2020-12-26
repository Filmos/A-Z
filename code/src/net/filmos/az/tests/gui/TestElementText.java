package net.filmos.az.tests.gui;

import javafx.scene.Node;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.DisplayElementText;
import org.junit.Assert;
import org.junit.Test;
import org.testfx.framework.junit.ApplicationTest;
import org.testfx.matcher.control.TextMatchers;

import java.util.Optional;

public class TestElementText extends ApplicationTest {

    private void assertEmpty(Optional actual) {Assert.assertEquals(Optional.empty(), actual);}

    @Test
    public void textIsAdded() {
        DisplayElementText displayElement = new DisplayElementText(Font.font("consolas", 18), new Color(255, 255, 255));
        Node node = displayElement.getNode();

        assertEmpty(from(node).lookup(TextMatchers.hasText("Hello")).tryQuery());
        displayElement.addText("Hello");
        from(node).lookup(TextMatchers.hasText("Hello")).queryText();
    }

    @Test
    public void textIsPersistent() {
        DisplayElementText displayElement = new DisplayElementText(Font.font("consolas", 18), new Color(255, 255, 255));
        Node node = displayElement.getNode();

        displayElement.addText("This");
        displayElement.addText("is");
        displayElement.addText("a");
        displayElement.addText("test");
        from(node).lookup(TextMatchers.hasText("This")).queryText();
        from(node).lookup(TextMatchers.hasText("is")).queryText();
        from(node).lookup(TextMatchers.hasText("a")).queryText();
        from(node).lookup(TextMatchers.hasText("test")).queryText();
    }

    @Test
    public void textHasColor() {
        Color defaultColor = new Color(55, 3, 168);
        Color color1 = new Color(220, 135, 98);
        Color color2 = new Color(2, 185, 198);

        DisplayElementText displayElement = new DisplayElementText(Font.font("consolas", 18), defaultColor);
        Node node = displayElement.getNode();

        displayElement.addText("Default");
        displayElement.addText("Colored", color1);
        displayElement.addText("default");
        displayElement.addText("colored", color2);

        Text text1 = from(node).lookup(TextMatchers.hasText("Default")).queryText();
        Assert.assertEquals(defaultColor.toPaintColor(), text1.getFill());
        Text text2 = from(node).lookup(TextMatchers.hasText("Colored")).queryText();
        Assert.assertEquals(color1.toPaintColor(), text2.getFill());
        Text text3 = from(node).lookup(TextMatchers.hasText("default")).queryText();
        Assert.assertEquals(defaultColor.toPaintColor(), text3.getFill());
        Text text4 = from(node).lookup(TextMatchers.hasText("colored")).queryText();
        Assert.assertEquals(color2.toPaintColor(), text4.getFill());
    }
}