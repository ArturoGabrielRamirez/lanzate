export function getCharByKeyCode(keyCode: number, shiftKey: boolean): string {
  const keyMap: Record<number, string> = {
    8: '', // Backspace
    9: '', // Tab
    13: '', // Enter
    16: '', // Shift
    17: '', // Ctrl
    18: '', // Alt
    19: '', // Pause
    20: '', // Caps Lock
    27: '', // Escape
    32: ' ', // Space
    33: '', // Page Up
    34: '', // Page Down
    35: '', // End
    36: '', // Home
    37: '', // Left Arrow
    38: '', // Up Arrow
    39: '', // Right Arrow
    40: '', // Down Arrow
    45: '', // Insert
    46: '', // Delete
    // Numbers
    48: shiftKey ? ')' : '0',
    49: shiftKey ? '!' : '1',
    50: shiftKey ? '@' : '2',
    51: shiftKey ? '#' : '3',
    52: shiftKey ? '$' : '4',
    53: shiftKey ? '%' : '5',
    54: shiftKey ? '^' : '6',
    55: shiftKey ? '&' : '7',
    56: shiftKey ? '*' : '8',
    57: shiftKey ? '(' : '9',
    // Letters
    65: shiftKey ? 'A' : 'a',
    66: shiftKey ? 'B' : 'b',
    67: shiftKey ? 'C' : 'c',
    68: shiftKey ? 'D' : 'd',
    69: shiftKey ? 'E' : 'e',
    70: shiftKey ? 'F' : 'f',
    71: shiftKey ? 'G' : 'g',
    72: shiftKey ? 'H' : 'h',
    73: shiftKey ? 'I' : 'i',
    74: shiftKey ? 'J' : 'j',
    75: shiftKey ? 'K' : 'k',
    76: shiftKey ? 'L' : 'l',
    77: shiftKey ? 'M' : 'm',
    78: shiftKey ? 'N' : 'n',
    79: shiftKey ? 'O' : 'o',
    80: shiftKey ? 'P' : 'p',
    81: shiftKey ? 'Q' : 'q',
    82: shiftKey ? 'R' : 'r',
    83: shiftKey ? 'S' : 's',
    84: shiftKey ? 'T' : 't',
    85: shiftKey ? 'U' : 'u',
    86: shiftKey ? 'V' : 'v',
    87: shiftKey ? 'W' : 'w',
    88: shiftKey ? 'X' : 'x',
    89: shiftKey ? 'Y' : 'y',
    90: shiftKey ? 'Z' : 'z',
    // Numpad
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    // Special characters
    186: shiftKey ? ':' : ';',
    187: shiftKey ? '+' : '=',
    188: shiftKey ? '<' : ',',
    189: shiftKey ? '_' : '-',
    190: shiftKey ? '>' : '.',
    191: shiftKey ? '?' : '/',
    192: shiftKey ? '~' : '`',
    219: shiftKey ? '{' : '[',
    220: shiftKey ? '|' : '\\',
    221: shiftKey ? '}' : ']',
    222: shiftKey ? '"' : "'"
  }

  return keyMap[keyCode] || ''
} 