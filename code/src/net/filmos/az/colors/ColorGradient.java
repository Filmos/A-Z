package net.filmos.az.colors;

import static java.lang.Math.pow;

public class ColorGradient {
    private final Color left;
    private final Color right;

    public ColorGradient(Color left, Color right) {
        this.left = left;
        this.right = right;
    }

    public Color getColor(double ratio) {
        return interpolateColor(left, right, ratio);
    }

    public static Color interpolateColor(Color left, Color right, double ratio) {
        ratio = Math.max(0, Math.min(1, ratio));

        double leftR = convertToLinearChannel(left.getRed()/255f);
        double leftG = convertToLinearChannel(left.getGreen()/255f);
        double leftB = convertToLinearChannel(left.getBlue()/255f);

        double rightR = convertToLinearChannel(right.getRed()/255f);
        double rightG = convertToLinearChannel(right.getGreen()/255f);
        double rightB = convertToLinearChannel(right.getBlue()/255f);

        return new Color(
            Math.round(convertFromLinearChannel(leftR+ratio*(rightR-leftR))*255),
            Math.round(convertFromLinearChannel(leftG+ratio*(rightG-leftG))*255),
            Math.round(convertFromLinearChannel(leftB+ratio*(rightB-leftB))*255)
        );
    }

    static double convertToLinearChannel(double srgb) {
        // IEC 61966-2-1:1999
        return srgb <= 0.04045d ? srgb / 12.92d : pow((srgb + 0.055d) / 1.055d, 2.4d);
    }
    static double convertFromLinearChannel(double linear) {
        // IEC 61966-2-1:1999
        return linear <= 0.0031308d ?
                linear * 12.92d : ((pow(linear, 1.0d / 2.4d) * 1.055d) - 0.055d);
    }
}
