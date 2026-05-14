from data import VFX, TITLES, INTERVIEWS, Entries, DATA


def build_content(
    content: tuple[tuple[str, Entries], ...], offset: int = 6
) -> str:
    indent = "  " * offset
    s = f"{indent}<ol>\n"

    for title, entries in content:
        s += f"{indent}  <li>{title.lower()}</li>\n"
        s += f"{indent}  <ol>\n"
        for entry in entries:
            s += f"{indent}    <li type='a'>{entry.get_short()}</li>\n"
        s += f"{indent}  </ol>\n"

    s += f"{indent}</ol>"
    return s


def build_html(write: bool = False) -> None:
    with open("template.html", "r", encoding="utf-8") as fp:
        s = fp.read()

    title = "lennart breede!"
    content = build_content(DATA)

    s = s.replace("{{ title }}", title)
    s = s.replace("{{ content }}", content)

    if write:
        write_html(s)
    else:
        print(s)


def write_html(s: str) -> None:
    with open("readme.html", "w", encoding="utf-8") as fp:
        fp.write(s)
