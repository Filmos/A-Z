package net.filmos.az.colors;

import java.util.Random;

public class Color {
    private int red;
    private int green;
    private int blue;

    public Color(int red, int green, int blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    public int getRed() {return red;}
    public int getGreen() {return green;}
    public int getBlue() {return blue;}
    public javafx.scene.paint.Color toPaintColor() {return new javafx.scene.paint.Color(getRed()/255f, getGreen()/255f, getBlue()/255f, 1);}
    public String toHexString() {return String.format("#%02x%02x%02x", red, green, blue);}

    public static Color random() {
        Random rand = new Random();
        return new Color(rand.nextInt(255), rand.nextInt(255), rand.nextInt(255));
    }
}
