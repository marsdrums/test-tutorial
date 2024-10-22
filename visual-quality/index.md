---
title: Drawing contours
kind: Tutorial
category: graphics
license: MIT
tags:
  - jitter
  - geometry
description: How to improve the visual quality of your rendering in Jitter
author:
  name: Cycling '74
contributors:
  - Matteo Marson
---

# How to improve the visual quality of your rendering in Jitter



## Color spaces and gamma correction

In the digital domain, colors are represented using numerical values, typically in three or more dimensions. These numerical values are then interpreted by devices like screens, printers, and cameras to produce visible colors. The most widespread color representation is RGB. As you probably already know, RGB is a color system that combines three color components (Red, Green, Blue) to represent all the colors of the visible spectrum. When all are combined at full intensity, they create white light.

The problem is that the RGB color encoding is somehow abstract, because each device may have a different way of interpreting the numerical values, resulting in unconsistent results across different devices. For this reason, when we talk about colors, we usualy refer to a so called ***color space***. 

Color spaces are systems used to represent and organize colors in a consistent and measurable way. They define how colors can be represented in various contexts, whether on a screen, in print, or during digital processing. Color spaces ensure that colors appear as intended, regardless of the device.

Nowdays, most devices (TV, phones, computer monitors, projectors) use the ***sRGB*** color space (Standard Red Green Blue). It is important to understand how sRGB works to assign colors to our pixels properly.

### Why sRGB?

Human vision is more sensitive to changes in darker tones than in brighter tones. In other words, we can detect more subtle differences in shadowed areas than in highlights. 

Given the limited number of shades that a color may assume in the digital domain (e.g. 256 × 256 × 256 = 16.000.000 possible colors with 8-bit color data), it makes sense to "spend" more precision towards darker tones, than towards brighter ones, so to better match the human color perception. If brightness were linearly represented, most of the color data would be concentrated in the bright parts of the image, and the darker parts would lack detail.

How does sRGB "distribute" precision where it's more needed? It does it by applying a so called ***gamma correction*** curve, which re-maps the RGB values to better match the human eye perception. The gamma curve in sRGB compensates for the ***non-linear*** way in which human eyes perceive brightness, making images appear more natural on screens; it optimizes the use of digital data by spreading information more evenly across the range of brightness levels we perceive.

The ***gamma correction*** curve is defined by a piece-wise function:

![](./images/visual-quality_001.png)

The function above transforms the linear RGB colors into sRGB color. It's also possible to convert colors back from sRGB to linear RGB:

![](./images/visual-quality_002.png)

If you want to check out an implementation of such functions, see the shader 'hdr.gamma.jxs'.

Most of the times, for efficiency and simplicity, an apprixomate gamma correction function is preferred over the ones above:

- $sRGB = linRGB^(1/2.2)$
- $linRGB = sRGB^(2.2)$

These gamma correction curves are very popular and widely used in many computer graphics applications, also because the difference in result with the complete original piece-wise function is quite negligable.

### How and where should i apply gamma correction?

Let's put it this way: computers need to operate on RGB colors. They don't care at all about our funky color perception, but they just need to process color values as they are. Screens, on the contrary, are expecting to receive color values encoded in sRGB color space. So, gamma correction must always be used as the last step of any graphic pipeline. Just before sending a Jitter matrix or a texture to the display, we should convert the linear RGB into sRGB.

In Jitter, this can be done in a variety of ways:

- computing gamma correction with Jitter operators

![](./images/visual-quality_003.png)

- computing gamma correction with jit.gl.pass





## Tonemapping
## Color data depth
## Lighting setup
## Antialiasing
## The sense of scale
## Driving viewr's attention
## Global illumination
## Color harmony
## Image composition


Open the patch *contours.maxpat*.

![](./images/geom-contours_001.png)

Looking at the render, you can see that the mesh outlines have been drawn. But, how can we identify which portions of the mesh should be considered part of the outlines? 

Give a look at the patch:

![](./images/geom-contours_002.png)

The first step consists in grabbing a mesh, turning it into a Jitter geometry, and computing face normals using {jit.geom.normgen}. They will come in handy later on. 

Then, {jit.geom.todict} converts the Jitter geometry into a dictionary accesible by JavaScript.

Now, double-click on {v8 geom.draw.contours.js} to give a look at the custom geometry script.

![](./images/geom-contours_003.png)

The core algorithm is pretty simple: iterate over the edges of the mesh checking the orientation (face normals) of the two faces divided by the edge; if the cosine of the angle formed by the adjacent faces is minor than a user-defined threshold, then draw a line connecting the endpoints of the edge.