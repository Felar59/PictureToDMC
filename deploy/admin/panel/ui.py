"""Curses drawing primitives: widths, frames, scrolling lists.

Nothing domain-specific here — this module has never heard of an account or a
piece. Adapted from emoji-art's `ea-panel`, which runs on the same box; the two
tools deliberately look and behave the same, so there is one set of keys to
remember rather than two.

On-screen text is French throughout the panel: the only two people who will ever
run it are the two admins. Code comments stay in English, like the rest of this
repository.
"""

from __future__ import annotations

import curses
import unicodedata

# Colour pairs, referenced everywhere else through these constants.
C_DIM = 1
C_TITLE = 2
C_FOCUS = 3
C_OK = 4
C_WARN = 5
C_BAD = 6


def init_colors() -> None:
    curses.use_default_colors()
    for pair, fg in (
        (C_DIM, curses.COLOR_BLUE),
        (C_TITLE, curses.COLOR_CYAN),
        (C_FOCUS, curses.COLOR_YELLOW),
        (C_OK, curses.COLOR_GREEN),
        (C_WARN, curses.COLOR_YELLOW),
        (C_BAD, curses.COLOR_RED),
    ):
        curses.init_pair(pair, fg, -1)


def width(text: str) -> int:
    """Display width in columns — an emoji takes two."""
    return sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in text)


def fit(text: str, cols: int) -> str:
    """Truncate to `cols` display columns, counting wide characters properly."""
    if cols <= 0:
        return ""
    text = "".join(c if c.isprintable() else " " for c in text)
    if width(text) <= cols:
        return text
    out, used = [], 0
    for char in text:
        step = width(char)
        if used + step > cols - 1:
            break
        out.append(char)
        used += step
    return "".join(out) + "…"


def put(scr, y: int, x: int, text: str, attr: int = 0) -> None:
    """Forgiving addstr: off-screen, or the very last cell, is simply skipped."""
    rows, cols = scr.getmaxyx()
    if not (0 <= y < rows) or x >= cols:
        return
    try:
        scr.addstr(y, x, fit(text, cols - x - 1), attr)
    except curses.error:
        pass


def box(scr, top: int, left: int, height: int, cols: int, title: str, focused: bool) -> None:
    """Frame and title. The focused pane's frame is coloured, its title bold."""
    edge = curses.color_pair(C_FOCUS) if focused else curses.color_pair(C_DIM)
    put(scr, top, left, "┌" + "─" * (cols - 2) + "┐", edge)
    for row in range(top + 1, top + height - 1):
        put(scr, row, left, "│", edge)
        put(scr, row, left + cols - 1, "│", edge)
    put(scr, top + height - 1, left, "└" + "─" * (cols - 2) + "┘", edge)
    label = curses.color_pair(C_FOCUS) | curses.A_BOLD if focused else curses.color_pair(C_TITLE)
    put(scr, top, left + 2, f" {title} ", label)


def scroll_window(count: int, sel: int, offset: int, height: int) -> int:
    """New offset that keeps `sel` inside a window `height` rows tall."""
    if count <= height:
        return 0
    offset = min(offset, count - height)
    offset = max(0, min(offset, sel))
    if sel >= offset + height:
        offset = sel - height + 1
    return max(0, offset)


def draw_list(scr, top: int, left: int, height: int, cols: int, lines, sel: int, offset: int) -> None:
    """Paint (text, attr) pairs. `sel` < 0 for a list with no selection."""
    inner = cols - 4
    for row in range(height):
        idx = offset + row
        if idx >= len(lines):
            break
        text, attr = lines[idx]
        if idx == sel:
            attr |= curses.A_REVERSE
            text = text.ljust(inner)
        put(scr, top + row, left + 2, fit(text, inner), attr)


def draw_scrollbar(scr, top: int, left: int, height: int, count: int, offset: int) -> None:
    """Position indicator: one block on the frame's right edge."""
    if count <= height or height < 3:
        return
    size = max(1, height * height // count)
    start = offset * (height - size) // max(1, count - height)
    for row in range(height):
        glyph = "█" if start <= row < start + size else "│"
        put(scr, top + row, left, glyph, curses.color_pair(C_DIM))
