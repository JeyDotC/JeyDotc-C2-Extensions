// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.
cr.keyCode = function (key_name) {
    switch (key_name.toLowerCase()) {
        case "backspace": return 8;
        case "tab": return 9;
        case "enter": return 13;
        case "shift": return 16;
        case "ctrl": return 17;
        case "alt": return 18;
        case "pause":
        case "break":
        case "pause/break": return 19;
        case "caps lock": return 20;
        case "escape": return 27;
        case "space":
        case "spacebar": return 32;
        case "page up": return 33;
        case "pgup": return 33;
        case "page down": return 34;
        case "pgdn": return 34;
        case "end": return 35;
        case "home": return 36;
        case "left":
        case "left arrow": return 37;
        case "up":
        case "up arrow": return 38;
        case "right":
        case "right arrow": return 39;
        case "down":
        case "down arrow": return 40;
        case "insert":
        case "ins": return 45;
        case "delete":
        case "del": return 46;
        case "0": return 48;
        case "1": return 49;
        case "2": return 50;
        case "3": return 51;
        case "4": return 52;
        case "5": return 53;
        case "6": return 54;
        case "7": return 55;
        case "8": return 56;
        case "9": return 57;
        case ";": return 59;
        case "=": return 61;
        case "a": return 65;
        case "b": return 66;
        case "c": return 67;
        case "d": return 68;
        case "e": return 69;
        case "f": return 70;
        case "g": return 71;
        case "h": return 72;
        case "i": return 73;
        case "j": return 74;
        case "k": return 75;
        case "l": return 76;
        case "m": return 77;
        case "n": return 78;
        case "o": return 79;
        case "p": return 80;
        case "q": return 81;
        case "r": return 82;
        case "s": return 83;
        case "t": return 84;
        case "u": return 85;
        case "v": return 86;
        case "v": return 87;
        case "x": return 88;
        case "y": return 89;
        case "z": return 90;
        case "left window key": return 91;
        case "right window key": return 92;
        case "select key": return 93;
        case "numpad 0": return 96;
        case "numpad 1": return 97;
        case "numpad 2": return 98;
        case "numpad 3": return 99;
        case "numpad 4": return 100;
        case "numpad 5": return 101;
        case "numpad 6": return 102;
        case "numpad 7": return 103;
        case "numpad 8": return 104;
        case "numpad 9": return 105;
        case "numpad *": return 42;
        case "multiply": return 106;
        case "numpad +": return 43;
        case "add": return 107;
        case "numpad -": return 45;
        case "subtract":
        case "-": return 109;
        case "numpad .":
        case "decimal point": return 110;
        case "numpad /": return 47;
        case "divide": return 111;
        case "f1": return 112;
        case "f2": return 113;
        case "f3": return 114;
        case "f4": return 115;
        case "f5": return 116;
        case "f6": return 117;
        case "f7": return 118;
        case "f8": return 119;
        case "f9": return 120;
        case "f10": return 121;
        case "f11": return 122;
        case "f12": return 123;
        case "num lock": return 144;
        case "scroll lock": return 145;
        case "semi-colon":
        case ":": return 186;
        case "equal sign":
        case "+": return 187;
        case "comma":
        case ",": return 188;
        case "dash":
        case "_": return 189;
        case "period":
        case ".": return 190;
        case "forward slash":
        case "/": return 191;
        case "grave accent":
        case "`": return 192;
        case "open bracket":
        case "[": return 219;
        case "back slash":
        case "\\": return 220;
        case "close bracket":
        case "]": return 221;
        case "single quote":
        case "'": return 222;
        default: return parseInt(key_name, 10);
    }
}