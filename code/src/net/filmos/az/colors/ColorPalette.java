package net.filmos.az.colors;

public class ColorPalette {
    private ColorPalette() {}

    public static ColorPalette defaultPalette() {
        return new ColorPalette();
    }


    public Color getBackground() {
        return new Color(76, 68, 82);
    }

    public Color getBackgroundBorder() {
        return new Color(122, 93, 145);
    }

}
