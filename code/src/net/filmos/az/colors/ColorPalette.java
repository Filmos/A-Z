package net.filmos.az.colors;

public class ColorPalette {
    private ColorPalette() {}

    public static ColorPalette defaultPalette() {
        return new ColorPalette();
    }


    public Color getBackground() {return new Color(44, 41, 48);}
    public Color getBackgroundBorder() {return new Color(96, 73, 115);}
    public ColorGradient getContentGradient() {return new ColorGradient(new Color(249, 220, 144), new Color(255, 255, 209));}

    public Color getContent() {return getContentGradient().getColor(0f);}
    public Color getContentActive() {return getContentGradient().getColor(1f);}
    public Color getContentInactive() {return new Color(255, 247, 209);}
    public Color getContentDisabled() {return new Color(144, 156, 249);}
    public Color getContentDanger() {return new Color(248, 141, 109);}

    public Color getHeader() {return new Color(202, 144, 249);}
}
