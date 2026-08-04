"""A share card for one published piece, drawn on the server.

Why the server has to draw it at all: an Open Graph image is fetched by a scraper —
Facebook, WhatsApp, Discord, Slack, iMessage — and not one of them runs the page's
JavaScript. So the browser engine that draws every other picture on this site cannot
help here, and the card has to exist as bytes at a URL.

Why there is a PNG encoder in this file rather than a dependency: the box has no image
library, and adding one to render a grid of solid rectangles would be a strange trade.
A PNG of flat colour is four chunks and a zlib stream, which is about sixty lines —
and the alternative was decoding the stored thumbnail, which needs a *decoder*,
inflate plus five row filters, for a worse picture than drawing it fresh.

The card is deliberately just the piece, large, on the site's linen. Text would need a
font renderer; the title and the description already travel in the Open Graph tags
beside the image, so the picture only has to do the thing a picture does.
"""

from __future__ import annotations

import base64
import binascii
import json
import struct
import zlib
from typing import Iterable, Sequence

from .dmc_colors import DMC_RGB

#: Facebook, Twitter/X, LinkedIn and Discord all want 1.91:1, and all of them crop
#: anything else. 1200x630 is the size every one of them documents.
CARD_W = 1200
CARD_H = 630

#: --color-linen, so a card sits on the same ground as the site.
GROUND = (0xF6, 0xF0, 0xE4)
#: --color-edge-4, for the hairline that stops a pale motif dissolving into it.
EDGE = (0xE0, 0xD4, 0xBC)

#: The motif's box. Short of the full card on every side: a scraper's own crop varies
#: by a few percent, and a piece touching the edge is the one that gets clipped.
INNER_W = 1000
INNER_H = 520


def _chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", binascii.crc32(tag + data) & 0xFFFFFFFF)
    )


def encode_png(width: int, height: int, rows: Iterable[bytes]) -> bytes:
    """8-bit RGB, no interlace, filter 0 on every row.

    Filter 0 — "None" — rather than the usual Paeth. For flat blocks of colour a filter
    that predicts from neighbours produces long runs of zero bytes, which is exactly
    what deflate already handles; measured on these cards the fancier filters saved
    under a percent and cost the arithmetic on 2.3 million sub-pixels.
    """
    raw = bytearray()
    for row in rows:
        raw.append(0)
        raw += row
    return (
        b"\x89PNG\r\n\x1a\n"
        + _chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + _chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + _chunk(b"IEND", b"")
    )


def _palette(codes: Sequence[str]) -> list[tuple[int, int, int] | None]:
    """Thread codes to colours, positions kept.

    A code the chart no longer carries becomes None and is drawn as bare ground rather
    than shifting every thread after it along by one — the same reasoning the piece page
    uses when it rebuilds a stored grid.
    """
    return [DMC_RGB.get(code.strip().lower()) for code in codes]


def render_card(cells_b64: str, thread_codes_json: str, width: int, height: int) -> bytes:
    """One piece, centred on linen, at 1200x630."""
    codes = json.loads(thread_codes_json)
    colours = _palette(codes)
    cells = base64.b64decode(cells_b64)

    # Whole pixels per stitch, so every block is the same size and the edges stay hard.
    # A fractional scale would put a half-pixel seam through some rows and not others,
    # which on a pattern of solid squares is the one artefact people notice.
    scale = max(1, min(INNER_W // max(1, width), INNER_H // max(1, height)))
    art_w = width * scale
    art_h = height * scale
    left = (CARD_W - art_w) // 2
    top = (CARD_H - art_h) // 2

    ground_row = bytes(GROUND) * CARD_W
    rows: list[bytes] = []

    # A one-pixel frame around the motif. Without it a piece made of pale threads has no
    # edge against the linen at all.
    def framed(row: bytearray) -> bytes:
        if left >= 1:
            row[(left - 1) * 3 : left * 3] = bytes(EDGE)
        if left + art_w < CARD_W:
            row[(left + art_w) * 3 : (left + art_w + 1) * 3] = bytes(EDGE)
        return bytes(row)

    for y in range(CARD_H):
        if y < top or y >= top + art_h:
            if y == top - 1 or y == top + art_h:
                edge = bytearray(ground_row)
                edge[max(0, left - 1) * 3 : min(CARD_W, left + art_w + 1) * 3] = bytes(EDGE) * (
                    min(CARD_W, left + art_w + 1) - max(0, left - 1)
                )
                rows.append(bytes(edge))
            else:
                rows.append(ground_row)
            continue

        # Every pixel row inside one stitch row is identical, so it is built once and
        # repeated. That turns the inner loop from art_h passes into `height` of them.
        if (y - top) % scale == 0:
            gy = (y - top) // scale
            row = bytearray(ground_row)
            base = gy * width
            for gx in range(width):
                value = cells[base + gx] if base + gx < len(cells) else 0
                if value == 0:
                    continue
                colour = colours[value - 1] if value - 1 < len(colours) else None
                if colour is None:
                    continue
                start = (left + gx * scale) * 3
                row[start : start + scale * 3] = bytes(colour) * scale
            current = framed(row)
        rows.append(current)

    return encode_png(CARD_W, CARD_H, rows)
