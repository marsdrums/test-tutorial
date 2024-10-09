---
title: Drawing contours
kind: example
category: graphics
license: MIT
tags:
  - jitter
  - geometry
description: Example of how to make a Jitter geometry look hand-drawn
author:
  name: Cycling '74
contributors:
  - Matteo Marson
---

# Drawing contours

If you had a pencil and paper, and you had to draw a duck, what would your drawing look like? I had fun putting together a patch that takes a Jitter geomerty and draws some lines along the contours of the mesh.

## Pencil and paper

Open the patch *contours.maxpat*.

![](./images/geom-contours_001.png)

Looking at the render, you can see that the mesh outlines have been drawn. But, how can we identify which portions of the mesh should be considered pare of the outlines? Give a look at the geom operators

![](./images/geom-contours_002.png)

The first step consists in grabbing a mesh, turn it into a Jitter geometry, and compute face normals using {jit.geom.normgen}. These will come in handy later on. Then, {jit.geom.todict} converts the Jitter geometry into a dictionary accesible by JavaScript.
Now, double-click on {v8 geom.draw.contours.js} to give a look at the custom geometry script.

![](./images/geom-twisting_003.png)

The core algorithm is pretty simple: iterate over the edges of the mesh checking the orientation (face normals) of the two faces divided by the edge; if the angle formed by the adjacent faces is minor than a user defined threshold, then draw a line connecting the extremities of the edge

## Pattern Wheel

Open up the patch *pattern-wheel.maxpat*.

![](./images/geom-twisting_004.png)

I made this patch sort of by accident when I was trying to make the other one. It's much simpler, although you could argue it makes more complex shapes.

By default, the torus is twisting around the Y axis. Of course, a torus has radial symmetry about the Y axis (in its default orientation anyway), so this doesn't change the surface of the shape much. But when we apply a checkerboard texture, you can see lots of cool patterns. Maybe those patterns have some connection to prime numbers or something.

If you want, you can twist the torus about a different axis. Since a torus does not have the right symmetry here, you'll get a mess, but it might be a cool mess.

![](./images/geom-twisting_006.png "X axis and Z axis twisting can still look kind of cool.")
