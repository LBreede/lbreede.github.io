import enum
from dataclasses import dataclass


class ShowKind(enum.StrEnum):
    MOVIE = "Movie"
    TV_SERIES = "TV Series"
    TV_MINI_SERIES = "TV Mini Series"


@dataclass
class Entry:
    title: str
    # TODO: Move to a full date for proper sorting
    date: int
    org: str | None = None
    description: str | None = None
    kind: ShowKind = ShowKind.MOVIE
    notes: str | None = None
    short: str | None = None

    def get_short(self) -> str:
        if self.short is not None:
            return self.short
        return self.title.lower()


Entries = list[Entry]

VFX: Entries = [
    Entry(
        "Steps",
        2026,
        "Netflix Animation Studios",
        "Blamed for magical mischief at the Royal Ball, stepsister Lilith turns her sister into a frog. She must work with Cinderella and a troll to save the kingdom and prove villains deserve happy endings too.",
    ),
    Entry(
        "Leo",
        2023,
        "Animal Logic",
        "A 74-year-old lizard named Leo and his turtle friend decide to escape from the terrarium of a Florida school classroom where they have been living for decades.",
    ),
    Entry(
        "DC League of Super-Pets",
        2022,
        "Animal Logic",
        "Krypto the Super-Dog and Superman are inseparable best friends, sharing the same superpowers and fighting crime side by side in Metropolis. However, Krypto must master his own powers for a rescue mission when Superman is kidnapped.",
        short="super-pets",
    ),
    Entry(
        "Ms. Marvel",
        2022,
        "Method Studios",
        "Kamala, a superhero fan with an imagination--particularly when it comes to Captain Marvel--feels like she doesn't fit in at school and sometimes even at home, that is until she gets superpowers like the heroes she admires.",
        kind=ShowKind.TV_MINI_SERIES,
    ),
    Entry(
        "The Babysitter's Guide to Monster Hunting",
        2020,
        "Method Studios",
        "A babysitter embarks on a mission to save a child who's been abducted by monsters.",
        short="bgtmh",
    ),
    Entry(
        "The New Mutants",
        2020,
        "Method Studios",
        "Five young mutants, just discovering their abilities while held in a secret facility against their will, fight to escape their past sins and save themselves.",
    ),
    Entry(
        "The Hunt",
        2020,
        "Pixomondo",
        "Twelve strangers wake up in a clearing. They don't know where they are, or how they got there. They don't know they've been chosen - for a very specific purpose - The Hunt.",
    ),
    Entry(
        "Locke & Key (Season 1)",
        2020,
        "Pixomondo",
        "After their father is murdered under mysterious circumstances, the three Locke siblings and their mother move into their ancestral home, Keyhouse, which they discover is full of magical keys that may be connected to their father's death.",
        kind=ShowKind.TV_SERIES,
    ),
    Entry(
        "For All Mankind (Season 1)",
        2019,
        "Pixomondo",
        "In an alternative version of 1969, the Soviet Union beats the United States to the Moon, and the space race continues on for decades with still grander challenges and goals.",
        kind=ShowKind.TV_SERIES,
    ),
    Entry(
        "Midway",
        2019,
        "Pixomondo",
        "The story of the Battle of Midway, told by the leaders and the sailors who fought in it.",
    ),
    Entry(
        "Men in Black: International",
        2019,
        "Method Studios",
        "The MIB tackle a mole in their organization.",
    ),
]

TITLES: Entries = [
    Entry("Firewatch", 2020, "Freelance", notes="Fan-made/unofficial"),
    Entry("Fallout: The Wanderer", 2017, "Wayside Digital"),
]

INTERVIEWS: Entries = [
    Entry(
        "$143 Lennart Breede | Läuft Doom in Houdini?",
        2025,
        "Life After SAE",
        notes="Podcast Episode",
        description="In dieser Episode begrüßen wir erneut Lennart Breede, der über seine aktuellen Projekte und die spannende Übergangsphase von Animal Logic zu Netflix spricht. Erfahrt, wie sich diese Veränderungen auf seine Arbeit ausgewirkt haben und welche neuen Herausforderungen und Möglichkeiten sich daraus ergeben. Lennart teilt seine Erfahrungen und Einblicke in die Welt der visuellen Effekte und die Balance zwischen Kunst und Technik. Freut euch auf ein inspirierendes Gespräch über die Zukunft der Animation und die Rolle von Technologie in kreativen Prozessen.",
    ),
    Entry(
        "#49 Lennart Breede | Grünzeug und falsche Funken",
        2022,
        "Life After SAE",
        notes="Podcast Episode",
        description="Heute sprechen wir mit Lennart Breede (SAE Hamburg Abschluss 2016). Lennart ist VFX Artist und Tausendsassa, lebt aktuell in Vancouver und arbeitet als Effects Pipeline TD bei Animal Logic. Wir sprechen mit ihm über seine Karriere, welche von einen Job beim Spiegel über die Arbeit bei Pixmondo bis zu seiner jetzigen Position bei Animal Logic geführt hat. Es geht um Jobwechsel, Native People und den VFX Standort Vancouver. Wir lernen viel über die Branche, wie lang man für einen animierten Film brauchen kann und wie aufwändig einzelne Shots sein können. Zu Lennart's Portfolio gehören Filme oder Serien wir „Man In Black“, „International“, „Midway“ oder „Ms. Marvel“ - hört also rein, es wird spannend!",
    ),
    Entry("Peter Pan's Finest!", 2021, "Digital Production"),
]

DATA = (
    ("Vfx/Animation", VFX),
    ("Title Design", TITLES),
    ("Interviews", INTERVIEWS),
)
