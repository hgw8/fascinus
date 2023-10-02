EXTENDEDCOLORS = {
17: "#472100",
18: "#474700",
19: "#324700",
20: "#004700",
21: "#00472c",
22: "#004747",
23: "#002747",
24: "#000047",
25: "#2e0047",
26: "#470047",
27: "#47002a",
29: "#743a00",
30: "#747400",
31: "#517400",
32: "#007400",
33: "#007449",
34: "#007474",
35: "#004074",
36: "#000074",
37: "#4b0074",
38: "#740074",
39: "#740045",
41: "#b56300",
42: "#b5b500",
43: "#7db500",
44: "#00b500",
45: "#00b571",
46: "#00b5b5",
47: "#0063b5",
48: "#0000b5",
49: "#7500b5",
50: "#b500b5",
51: "#b5006b",
53: "#ff8c00",
54: "#ffff00",
55: "#b2ff00",
56: "#00ff00",
57: "#00ffa0",
58: "#00ffff",
59: "#008cff",
60: "#0000ff",
61: "#a500ff",
62: "#ff00ff",
63: "#ff0098",
65: "#ffb459",
66: "#ffff71",
67: "#cfff60",
68: "#6fff6f",
69: "#65ffc9",
70: "#6dffff",
71: "#59b4ff",
72: "#5959ff",
73: "#c459ff",
74: "#ff66ff",
75: "#ff59bc",
77: "#ffd39c",
78: "#ffff9c",
79: "#e2ff9c",
80: "#9cff9c",
81: "#9cffdb",
82: "#9cffff",
83: "#9cd3ff",
84: "#9c9cff",
85: "#dc9cff",
86: "#ff9cff",
87: "#ff94d3",
89: "#131313",
90: "#282828",
91: "#363636",
92: "#4d4d4d",
93: "#656565",
94: "#818181",
95: "#9f9f9f",
96: "#bcbcbc",
97: "#e2e2e2",
98: "#ffffff",
}


MIRCCOLORS = {
        1:  (0,0,0),
        2:  (0,0,127),
        3:  (0,147,0),
        4:  (255,0,0),
        5:  (127,0,0),
        6:  (156,0,156),
        7:  (252,127,0),
        8:  (255,255,0),
        9:  (0,252,0),
        10: (0,147,147),
        11: (0,255,255),
        12: (0,0,252),
        13: (255,0,255),
        14: (127,127,127),
        15: (210,210,210)
}


colors = {}

# copy the dict lol
for i in MIRCCOLORS:
    colors[i]=MIRCCOLORS[i]

for i in EXTENDEDCOLORS:
    hex=EXTENDEDCOLORS[i].lstrip('#')
    
    # https://stackoverflow.com/a/29643643/9406294
    rgb=tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))
    #print(rgb)

    colors[i]=rgb


COLORS = colors


def closestColor(rgb):
    try:
        r, g, b = rgb
    except ValueError:
        r, g, b, a = rgb
    diss = {}
    for cc in COLORS:
        rc, gc, bc = COLORS[cc]
        distance = abs(r-rc) + abs(g-gc) + abs(b-bc)
        diss[cc] = distance
    return min(diss, key=diss.get)
