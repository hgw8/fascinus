#!/bin/sh
"""'exec /usr/bin/env python3 -u "$0" "$@" #"""
__doc__ = "little script to make irc color art that will probably get you banned"
# whee, look at this sus shebang workaround to always cause
# unbuffered mode lol

import sys, time, argparse
from PIL import Image, ImageOps
from color import closestColor
import validators
import wget
import subprocess
import glob, os
import requests

def main(imgPath, delay, ASCIIWIDTH, COLORCHAR, FILLER, fileType):
    if os.path.exists("image.png"):
        os.remove("image.png")
    if os.path.exists("image.jpg"):
        os.remove("image.jpg")    
    if os.path.exists("image.webp"):
        os.remove("image.webp")
    if os.path.exists("output.txt"):
        os.remove("output.txt")
    if validators.url(imgPath) == True:
        print('URL')
        print('Downloading image to ' +  "/home/node/app/image." + fileType)
        #wget.download(imgPath, "/home/node/app/image." + fileType)
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0'}
        imagefile = requests.get(imgPath, headers=headers)
        open("/home/node/app/image." + fileType, "wb").write(imagefile.content)
        if fileType == "png":
            print('PNG')
            imgPath = "/home/node/app/image.png"
        if fileType == "jpg":
            print('JPG')
            imgPath = "/home/node/app/image.jpg"
        if fileType == "webp":
            print('WEBP')
            imgPath = "/home/node/app/image.webp"
    
    im = Image.open(imgPath, 'r')
    im = ImageOps.scale(im, ASCIIWIDTH / im.width)
    width, height = im.size
    pixel_values = list(im.getdata())

    currentPixel = 0

    for y in range(0, height, 2):
        line = []
        lastColor=69420

        for x in range(width):
            color = closestColor(pixel_values[width*y+x])
            if color == lastColor:
                colorcode = ''
            else:
                colorcode =COLORCHAR.format(color, color)
            line.append(colorcode+(FILLER[currentPixel % len(FILLER)]))
            lastColor=color
            currentPixel+=1

        print("".join(line))
        with open("output.txt", "a") as f:
            print("".join(line), file=f)
        if delay:
            time.sleep(delay)
        sys.stdout.flush()


if __name__ == "__main__":
    parser = argparse.ArgumentParser("banter")
    parser.add_argument("file")
    parser.add_argument("-d", metavar="delay", default=0)
    parser.add_argument("-w", metavar="width", default=80)
    parser.add_argument("-t", metavar="fileType", default="png")
    parser.add_argument("--colorfmt", metavar="format", default="\\x03{},{}")
    parser.add_argument("--filler", metavar="filler", default=".")
    args = parser.parse_args()

    main(
        args.file,
        float(args.d),
        int(args.w),
        args.colorfmt.encode().decode("unicode_escape"),
        args.filler.encode().decode("unicode_escape"),
        str(args.t)
    )
