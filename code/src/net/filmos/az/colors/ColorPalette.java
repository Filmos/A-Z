package net.filmos.az.colors;

public class ColorPalette {
    private ColorPalette() {}

    public static ColorPalette defaultPalette() {
        return new ColorPalette();
    }


    public Color getBackground() {return new Color(44, 41, 48);}
    public Color getBackgroundBorder() {return new Color(96, 73, 115);}
    public ColorGradient getContentGradient() {return new ColorGradient(new Color(230, 222, 185), new Color(249, 220, 144));}

}
