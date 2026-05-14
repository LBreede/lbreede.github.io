import argparse

from readme_txt_builder import build_txt
from readme_html_builder import build_html


def main():
    parser = argparse.ArgumentParser(
        description="CLI that accepts either --txt or --html, but not both."
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--txt", action="store_true", help="Use TXT mode")
    group.add_argument("--html", action="store_true", help="Use HTML mode")

    parser.add_argument("-w", action="store_true", help="Optional W flag")

    args = parser.parse_args()

    if args.txt:
        build_txt(args.w)
    elif args.html:
        build_html(args.w)


if __name__ == "__main__":
    main()
