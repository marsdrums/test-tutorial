---
title: Thickness
kind: example
category: graphics
license: MIT
tags:
  - jitter
  - geometry
description: Example of how to extrude triangles to create volumes
author:
  name: Cycling '74
contributors:
  - Matteo Marson
---

# Thickness

A very common operation on a mesh is diplacing the triangles of which it is composed. Althoug not evident on a closed mesh, when displaced, the triangles look flat and volumeless. This patch uses a custom geometry script to account for that.


## Let's thicken them up

Open the patch *thickness.maxpat*

![](./images/geom-thickness_001.gif)

This patch takes a Jitter geometry and extrudes the triangles along their vertex normals, forming truncated pyramids. It then performs a random displacement of such extruded triangles to show them in all their glorious thickness.

Give a look at the patch:

![](./images/geom-contours_002.png)

The first step consists in grabbing a mesh, turning it into a Jitter geometry, and computing face normals using {jit.geom.normgen}. They will come in handy later on. 

Then, {jit.geom.todict} converts the Jitter geometry into a dictionary accesible by JavaScript.

Now, double-click on {v8 geom.draw.contours.js} to give a look at the custom geometry script.

![](./images/geom-contours_003.png)

The core algorithm is pretty simple: iterate over the edges of the mesh checking the orientation (face normals) of the two faces divided by the edge; if the cosine of the angle formed by the adjacent faces is minor than a user-defined threshold, then draw a line connecting the endpoints of the edge.