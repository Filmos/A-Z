package net.filmos.az.colors;

import static java.lang.Math.pow;

public class ColorGradient {
    private final Color left;
    private final Color right;

    public ColorGradient(Color left, Color right) {
        this.left = left;
        this.right = right;
    }

    public Color getColor(float ratio) {
        return interpolateColor(left, right, ratio);
    }

    public static Color interpolateColor(Color left, Color right, float ratio) {
        ratio = Math.max(0, Math.min(1, ratio));

        float leftR = convertToLinearChannel(left.getRed()/255f);
        float leftG = convertToLinearChannel(left.getGreen()/255f);
        float leftB = convertToLinearChannel(left.getBlue()/255f);

        float rightR = convertToLinearChannel(right.getRed()/255f);
        float rightG = convertToLinearChannel(right.getGreen()/255f);
        float rightB = convertToLinearChannel(right.getBlue()/255f);

        return new Color(
            Math.round(convertFromLinearChannel(leftR+ratio*(rightR-leftR))*255),
            Math.round(convertFromLinearChannel(leftG+ratio*(rightG-leftG))*255),
            Math.round(convertFromLinearChannel(leftB+ratio*(rightB-leftB))*255)
        );
    }

    static float convertToLinearChannel(float srgb) {
        // IEC 61966-2-1:1999
        return srgb <= 0.04045f ? srgb / 12.92f : (float) pow((srgb + 0.055f) / 1.055f, 2.4f);
    }
    static float convertFromLinearChannel(float linear) {
        // IEC 61966-2-1:1999
        return linear <= 0.0031308f ?
                linear * 12.92f : (float) ((pow(linear, 1.0f / 2.4f) * 1.055f) - 0.055f);
    }
}
