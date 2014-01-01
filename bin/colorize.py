#!/usr/bin/python

import sys, getopt;

COLORS = {
    'black': 30,
    'red': 31,
    'green': 32,
    'yellow': 33,
    'blue' : 34,
    'magenta': 35,
    'cyan': 36,
    'white': 37,
}

def print_usage():
    print 'colorize.py -b <background> -f <foreground>'
    print_available_colors()

def print_available_colors():
    print 'Available colors:'
    for fg in COLORS:
        options = { 'fg' : fg }
        if (fg == 'black'):
            options['bg'] = 'white'
        print "\t" + colorize(fg, options)

def colorize(text, options):
    colors = []
    if ('fg' in options):
        colors.append(str(COLORS[options['fg']]))
    if ('bg' in options):
        colors.append(str(COLORS[options['bg']] + 10))
    return '\x1b[%sm%s\x1b[0m' % (';'.join(colors), text)

def main(argv):
    # Get options
    options = {};
    try:
        opts, args = getopt.getopt(argv, "hb:f:", ["help", "background=", "foreground="])
    except getopt.GetoptError:
        print_usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print_usage()
            sys.exit();
        elif opt in ('-b', '--background'):
            options['bg'] = arg.lower();
        elif opt in ('-f', '--foreground'):
            options['fg'] = arg.lower();

    # Verify options
    if ('bg' in options and options['bg'] not in COLORS):
        print options['bg'], 'is not a valid color'
        print_available_colors()
        sys.exit(2)
    if ('fg' in options and options['fg'] not in COLORS):
        print options['fg'], 'is not a valid color'
        print_available_colors()
        sys.exit(2)

    # Pipe STDIN through colorize() to STDOUT
    sys.stdout.write(colorize(sys.stdin.read(), options))

if __name__ == "__main__":
    main(sys.argv[1:])
