from __future__ import annotations
from datetime import datetime

from data import ShowKind, Entry, Entries, VFX, TITLES, INTERVIEWS, DATA

WIDTH = 79
THIN_LINE = "-" * WIDTH + "\n"
THICK_LINE = "=" * WIDTH + "\n"

NUMBERS = {1: "One", 2: "Two", 3: "Three"}


def center(s: str) -> str:
    return s.center(WIDTH).rstrip() + "\n"


def format_date_with_suffix(dt: datetime) -> str:
    day = dt.day
    if 11 <= day <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return dt.strftime(f"%B {day}{suffix}, %Y")


def build_header() -> str:
    s = "\n"
    s += center("LENNART BREEDE")
    s += center("March 12, 1996")
    s += center(f"Updated {format_date_with_suffix(datetime.now())}")
    s += "\n"
    s += THIN_LINE
    return s


def build_contents(contents: tuple[tuple[str, Entries], ...]) -> str:
    s = "\n"
    s += str("CONTENTS:\n")

    for i, (title, _) in enumerate(contents, start=1):
        s += f"Part {NUMBERS[i]}: {title}\n"

    s += "\n"
    s += THICK_LINE
    return s


def build_subheader() -> str:
    s = "\n"
    s += center("LENNART BREEDE")
    s += "\n"
    s += THICK_LINE
    return s


def build_entries(section: int, title: str, entries: Entries) -> str:
    s = "\n"
    s += center(f"PART {NUMBERS[section].upper()}:")
    s += center(title.upper())
    s += "\n"
    s += THICK_LINE

    for i, show in enumerate(entries):
        s += "\n"
        s += show.title + "\n"

        s += f"        {show.date}"
        if show.org is not None:
            s += f"        {show.org}"
        if show.kind != ShowKind.MOVIE:
            s += f"        {show.kind.value}"
        if show.notes is not None:
            s += f"        {show.notes}"
        s += "\n"

        s += "\n"

        t = "       "

        if show.description is not None:
            for word in show.description.split():
                if len(t) + 1 + len(word) <= 79:
                    t += " " + word
                else:
                    s += t + "\n"
                    t = "        " + word
            s += t + "\n"
            s += "\n"

        if i == len(entries) - 1:
            s += THICK_LINE
        else:
            s += THIN_LINE

    return s


def build_txt(write: bool = False) -> None:
    s = THIN_LINE
    s += build_header()
    s += build_contents(DATA)
    s += build_subheader()
    for i, (title, entries) in enumerate(DATA, start=1):
        s += build_entries(i, title, entries)
    if write:
        write_txt(s)
    else:
        print(s)


def write_txt(s: str) -> None:
    with open("readme.txt", "w", encoding="utf-8") as fp:
        fp.write(s)
