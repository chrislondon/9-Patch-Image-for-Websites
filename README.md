# 9 Patch Images for HTML

Contributors: chrislondon, rpendleton  
Tags: 9patch

A single javascript file to allow 9 Patch images on the web.

## Description

This project allows you to use `.9.png` or `.9.gif` files on web pages. These
files allow for rapid development of webpages with complex styles without having
to use complex CSS3.

## What Are 9 Patch Images

9 Patch images are stretchable, repeatable images reduced to their smallest
size. The simplest example would be if you were to take a rounded div and slice
it up into 9 squares like you would a tic-tac-toe board. The four corners
wouldn't change sizes at all but would be static while the other 5 pieces would
be stretched or repeated to all the whole image to scale appropriately.

With that explanation and the advent of CSS3 you might think that there is no
reason to use 9 patch images but the name '9 patch' is a misnomer. The images
can be sliced up into even smaller pieces.

The wiki page has images that will help understand better. It also contains more
details.

9 Patch images contain an index of which piece is what by adding a 1px border to
the image. The colors in the border determine if a piece is static (doesn't
scale), it stretches, or it repeats.

For more details see the wiki page: [What Are 9 Patch Images][what-are]

## How to Create 9 Patch Images

To create a 9 patch image you need to start with a `.png` or a `.gif` file.
JPEG's don't make good 9 patch images because they blur colors.

* Create the image that you would like to scale.
* Reduce it to the smallest pieces possible.
* Increase the canvas size to add a 1px border around the entire image
* Mark the different pieces with the appropriate colors in the border.
* Save the image as `[image-name].9.png` or `[image-name].9.gif`

For more details see the wiki page: [How to Create 9 Patch Images][create]

## Installation

Fork project on GitHub:

1. Go to the GitHub repository for [9-Patch-Image-for-Websites][repo]
2. Fork the repository ([how-to guide][fork])

For more details see the wiki page: [Installation][installation]

## Usage

* Install the `.js` file
* Include `.js` file in your HTML
	* All `<div>`'s with a background image `.9.(png|gif)` will automatically be
	  converted.

For more details see the wiki page: [Usage][usage]

## Known Issues

* Unfortunately Canvas isn't supported on <IE9 browsers. We have two branches to
  explore using canvas emulators but neither seem to be successful.

[what-are]: https://github.com/chrislondon/9-Patch-Image-for-Websites/wiki/What-Are-9-Patch-Images
[create]: https://github.com/chrislondon/9-Patch-Image-for-Websites/wiki/How-to-Create-9-Patch-Images
[repo]: https://github.com/chrislondon/9-Patch-Image-for-Websites
[fork]: https://help.github.com/articles/fork-a-repo/
[installation]: https://github.com/chrislondon/9-Patch-Image-for-Websites/wiki/Installation
[usage]: https://github.com/chrislondon/9-Patch-Image-for-Websites/wiki/Usage