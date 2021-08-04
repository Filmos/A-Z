// Source: https://gist.github.com/neolitec/1344610/3a3a9dc7d94644ff48f12cc7823b79f2b8ea17ac
class Color {

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    r : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    g : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    b : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    h : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    s : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    l : number;

    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    a : number;

    constructor() {
        this.r = this.g = this.b = 0;
        this.h = this.s = this.l = 0;
        this.a = 1;
    };



    red() : number { return this.r; };
    green() : number { return this.g; };
    blue() : number { return this.b; };

    hue() : number { return this.h; };
    saturation() : number { return this.s; };
    lightness() : number { return this.l; };

    /** Transparency */
    alpha() : number { return this.a; };

    // Source: https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
    luminance() : number {
        // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        let rgba = [this.r, this.g, this.b];

        for(let i=0; i<3; i++)
            rgba[i] = rgba[i] < .03928 ? rgba[i] / 12.92 : Math.pow((rgba[i] + .055) / 1.055, 2.4);

        return .2126 * rgba[0] + .7152 * rgba[1] + 0.0722 * rgba[2];
    }


    /** RGB */
    cssRGB() : string {
        return "rgb("+Math.round(255*this.r)+","+Math.round(255*this.g)+","+Math.round(255*this.b)+")";
    };
    cssRGBA() : string {
        return "rgba("+Math.round(255*this.r)+","+Math.round(255*this.g)+","+Math.round(255*this.b)+","+this.a+")";
    };

    /** HSL */
    cssHSL() : string {
        return "hsl("+Math.round(360*this.h)+","+Math.round(100*this.s)+"%,"+Math.round(100*this.l)+"%)";
    };
    cssHSLA() : string {
        return "hsla("+Math.round(360*this.h)+","+Math.round(100*this.s)+"%,"+Math.round(100*this.l)+"%,"+Math.round(this.a)+")";
    };

    /** HEX */
    cssHEX() : string {
        return "#" +
            (255*this.r < 16 ? "0" : "") + Math.round(255*this.r).toString(16) +
            (255*this.g < 16 ? "0" : "") + Math.round(255*this.g).toString(16) +
            (255*this.b < 16 ? "0" : "") + Math.round(255*this.b).toString(16);
    };




    /** Modifiers */
    saturate(v:string|number) : void {
        if("string" == typeof v && v.indexOf("%") > -1 && !isNaN((v = parseInt(v))))
            this.s += v/100;
        else if("number" == typeof v) // range 255
            this.s += v/255;
        else throw new Error("error: bad modifier format (percent or number)");
        if(this.s > 1) this.s = 1; else if(this.s < 0) this.s = 0;
        Color.Convertor.HSLToRGB.apply(this);
    };
    desaturate(v:string|number) : void {
        this.saturate("-" + v);
    };
    lighten(v:string|number) : void {
        if("string" == typeof v && v.indexOf("%") > -1 && !isNaN((v = parseInt(v))))
            this.l += v/100;
        else if("number" == typeof v) // range 255
            this.l += v/255;
        else throw new Error("error: bad modifier format (percent or number)");
        if(this.l > 1) this.l = 1; else if(this.l < 0) this.l = 0;
        Color.Convertor.HSLToRGB.apply(this);
    };
    darken(v:string|number) : void {
        this.lighten("-" + v);
    };
    fadein(v:string|number) : void {
        if("string" == typeof v && v.indexOf("%") > -1 && !isNaN((v = parseInt(v))))
            this.a += v/100;
        else if("number" == typeof v) // range 255
            this.a += v/255;
        else throw new Error("error: bad modifier format (percent or number)");
        if(this.a > 1) this.a = 1; else if(this.a < 0) this.a = 0;
        Color.Convertor.HSLToRGB.apply(this);
    };
    fadeout(v:string|number) : void {
        this.fadein("-" + v);
    };
    spin(v:string|number) : void {
        if("string" == typeof v && v.indexOf("%") > -1 && !isNaN((v = parseInt(v))))
            this.h += v/100;
        else if("number" == typeof v) // range 360
            this.h += v/360;
        else throw new Error("error: bad modifier format (percent or number)");
        if(this.h > 1) this.h = 1; else if(this.h < 0) this.h = 0;
        Color.Convertor.HSLToRGB.apply(this);
    };

    /** Debug */
    /*
       toString() : void {
       return "<span style=\"color: "+this.cssRGB()+"\">"+this.cssRGB()+"</span> / <span style=\"color: "+this.cssHSL()+"\">"+this.cssHSL()+"</span> / <span style=\"color: "+this.cssHEX()+"\">"+this.cssHEX()+"</span> / alpha: "+this.a+"";
       };
    */

    static makeRGB(...args: any[]) : Color {
        const c : Color = new Color();
        let sanitized : Array<number>;
        if(arguments.length < 3 || arguments.length > 4)
            throw new Error("error: 3 or 4 arguments");
        sanitized = Color.Sanitizer.RGB(arguments[0], arguments[1], arguments[2]);
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        if(arguments.length == 4) c.a = arguments[3];
        Color.Convertor.RGBToHSL.apply(c);
        return c;
    };

    static makeHSL(...args: Array<number|string>) : Color {
        const c : Color = new Color();
        let sanitized : Array<number>;
        if(arguments.length < 3 || arguments.length > 4)
            throw new Error("error: 3 or 4 arguments");
        sanitized = Color.Sanitizer.HSL(arguments[0], arguments[1], arguments[2]);
        c.h = sanitized[0];
        c.s = sanitized[1];
        c.l = sanitized[2];
        if(arguments.length == 4) c.a = arguments[3];
        Color.Convertor.HSLToRGB.apply(c);
        return c;
    };

    static makeHEX(value:string) : Color {
        let c = new Color(),
            sanitized;
        // Edit Ika 2018-0308
        // Allow leading '#'
        if( value && value.startsWith('#') )
            value = value.substr(1);
        Color.Validator.checkHEX(value);
        if(value.length == 3) {
            sanitized = Color.Sanitizer.RGB(
                parseInt(value.substr(0, 1) + value.substr(0, 1), 16),
                parseInt(value.substr(1, 1) + value.substr(1, 1), 16),
                parseInt(value.substr(2, 1) + value.substr(2, 1), 16)
            );
        } else if(value.length == 6) {
            sanitized = Color.Sanitizer.RGB(
                parseInt(value.substr(0, 2), 16),
                parseInt(value.substr(2, 2), 16),
                parseInt(value.substr(4, 2), 16)
            );
        } else throw new Error("error: 3 or 6 arguments");
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        Color.Convertor.RGBToHSL.apply(c);
        return c;
    };

    static parse( str:string ) : Color {
        if( typeof str == 'undefined' )
            return null;
        if( (str = str.trim().toLowerCase()).length == 0 )
            return null;
        if( str.startsWith('#') )
            return Color.makeHEX(str.substring(1,str.length));
        if( str.startsWith('rgb') ) {
            let parts = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*((?:0\.)?\d+))?\)$/.exec(str);
            // [ str, r, g, b, a|undefined ]
            if( typeof parts[4] == 'undefined' )
                return Color.makeRGB(parts[1],parts[2],parts[3]);
            else
                return Color.makeRGB(parts[1],parts[2],parts[3],parts[4]);
        }
        else
            throw "Unrecognized color format: " + str;
    };

    static Sanitizer = {
        RGB: function(...args: any[]) {
            let o = [];
            if(arguments.length == 0) return;
            for(let i = 0 ; i < arguments.length ; i++) {
                let c = arguments[i];
                if("string" == typeof c && c.indexOf("%") > -1) {
                    if(isNaN((c = parseInt(c))))
                        throw new Error("Bad format");
                    if(c < 0 || c > 100)
                        throw new Error("Bad format");
                    o[i] = c/100;
                } else {
                    if("string" == typeof c && isNaN((c = parseInt(c)))) throw new Error("Bad format");
                    if(c < 0) throw new Error("Bad format");
                    else if(c >= 0 && c < 1) o[i] = c;
                    else if(c >= 1 && c < 256) o[i] = c/255;
                    else throw new Error("Bad format ("+c+")");
                }
            }
            return o;
        },

        HSL: function(...args: Array<string|number>) : Array<number> {
            if(arguments.length < 3 || arguments.length > 4) throw new Error("3 or 4 arguments required");
            let h = arguments[0],
                s = arguments[1],
                l = arguments[2];
            if("string" == typeof h && isNaN((h = parseFloat(h)))) throw new Error("Bad format for hue");
            if(h < 0 || h > 360) throw new Error("Hue out of range (0..360)");
            else if(((""+h).indexOf(".") > -1 && h > 1) || (""+h).indexOf(".") == -1) h /= 360;
            if("string" == typeof s && s.indexOf("%") > -1) {
                if(isNaN((s = parseInt(s))))
                    throw new Error("Bad format for saturation");
                if(s < 0 || s > 100)
                    throw new Error("Bad format for saturation");
                s /= 100;
            } else if(s < 0 || s > 1) throw new Error("Bad format for saturation");
            if("string" == typeof l && l.indexOf("%") > -1) {
                if(isNaN((l = parseInt(l))))
                    throw new Error("Bad format for lightness");
                if(l < 0 || l > 100)
                    throw new Error("Bad format for lightness");
                l /= 100;
            } else if(l < 0 || l > 1) throw new Error("Bad format for lightness");
            return [h, s, l];
        }
    }; // ENd sanitizer

    static Validator = {

        /**
         * Check a hexa color (without #)
         */
        checkHEX: function(value: string) {

            if(value.length != 6 && value.length != 3)
                throw new Error("Hexa color: bad length ("+value.length+")," + value);
            value = value.toLowerCase();
            for(let i = 0; i<value.length;i++) {
                let c = value.charCodeAt(i);
                if( !((c>=48 && c<=57) || (c>=97 && c<=102)) )
                    throw new Error("Hexa color: out of range for " + value + " at position " + i);
            }
        }
    };

    static Convertor = {

        /**
         * Calculates HSL Color
         * RGB must be normalized
         * Must be executed in a Color object context
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        RGBToHSL: function() {
            //
            let r = this.r,
                g = this.g,
                b = this.b,
                max = Math.max(r, g, b), min = Math.min(r, g, b);
            this.l = (max + min) / 2;
            if(max == min){
                this.h = this.s = 0; // achromatic
            } else {
                let d = max - min;
                this.s = this.l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: this.h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: this.h = (b - r) / d + 2; break;
                    case b: this.h = (r - g) / d + 4; break;
                }
                this.h /= 6;
            }
        },

        /**
         * Calculates RGB color (nomalized)
         * HSL must be normalized
         * Must be executed in a Color object context
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        HSLToRGB: function() {
            let h = this.h,
                s = this.s,
                l = this.l,
                hue2rgb = function(p: number, q: number, t: number){
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
            if(s == 0) {
                this.r = this.g = this.b = l; // achromatic
            } else {
                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                this.r = hue2rgb(p, q, h + 1/3);
                this.g = hue2rgb(p, q, h);
                this.b = hue2rgb(p, q, h - 1/3);
            }
        }

    };


    // Added by Ika 2017-0-19
    clone() {
        return Color.makeRGB(this.r, this.g, this.b, this.a);
    };

    // Added by Ika 2018-12-30
    interpolate( c:Color, t:number ) {
        this.r += (c.r-this.r)*t;
        this.g += (c.g-this.g)*t;
        this.b += (c.b-this.b)*t;
        this.a += (c.a-this.a)*t;
        return this;
    };

    overlayOn(c:Color ) {
        this.r += (c.r-this.r)*(1-this.a);
        this.g += (c.g-this.g)*(1-this.a);
        this.b += (c.b-this.b)*(1-this.a);
        return this;
    };

    // Source: https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
    contrast(color: Color) {
        // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        if (color.alpha() < 1) {
            color = color.overlayOn(this);
        }

        let l1 = this.luminance() + .05,
            l2 = color.luminance() + .05,
            ratio = l1/l2;

        if (l2 > l1) {
            ratio = 1 / ratio;
        }

        return ratio

    }

} // END class