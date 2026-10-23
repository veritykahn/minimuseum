"""What the Harlem Renaissance lessons show and play on the classroom
screen (Lesson mode), from the exhibition's own files in
public/exhibitions/harlem/. The PDFs never print these; export_lessons.py
reads them. Alt text and credits are the site's own: the Great Migration
Map (app/exhibitions/harlem-renaissance/migration-map/page.tsx), the
phonograph (artifacts/hr-artifact-viewer.tsx) and the Jazz Lab
(jazz-lab/data.ts)."""

MIG = "/exhibitions/harlem/images/migration/"

# the six stops on the Great Migration Map, with the map's own photographs
PHOTOS = {
    "delta": {"img": MIG + "delta.jpg",
              "alt": "Workers picking cotton in a wide field in Georgia, 1907",
              "credit": "“A Georgia Cotton Field,” 1907. Photograph by Marcus L. Brown, Decatur, Georgia. Library of Congress Prints and Photographs Division. This field is in Georgia, not the Delta: the same work was done in cotton fields across the South."},
    "new-orleans": {"img": MIG + "new-orleans.jpg",
                    "alt": "Oscar “Papa” Celestin’s Original Tuxedo Band, early 1900s",
                    "credit": "Oscar \"Papa\" Celestin's Original Tuxedo Band, early 1900s. William Russell Jazz Collection, The Historic New Orleans Collection, acquisition made possible by the Clarisse Claiborne Grima Fund."},
    "memphis": {"img": MIG + "memphis.jpg",
                "alt": "W.C. Handy and associates outside the Tri-State Bank of Memphis",
                "credit": "W.C. Handy (far right) with associates outside the Tri-State Bank of Memphis, Tennessee."},
    "st-louis": {"img": MIG + "st-louis.jpg",
                 "alt": "Fate Marable’s Society Syncopators aboard a Mississippi riverboat, about 1919",
                 "credit": "Fate Marable’s Society Syncopators aboard a Mississippi riverboat, c. 1919."},
    "chicago": {"img": MIG + "chicago.jpg",
                "alt": "King Oliver’s Creole Jazz Band posing with their instruments, Chicago, about 1923",
                "credit": "King Oliver’s Creole Jazz Band, Chicago, c. 1923. Photograph by Daguerre Studio."},
    "harlem": {"img": MIG + "harlem.jpg",
               "alt": "A crowd lines a Harlem street as a parade passes; one sign reads “The New Negro has no fear”",
               "credit": "Harlem, New York, 1920s. A parade or rally passes through the neighborhood; a sign reads \"THE NEW NEGRO HAS NO FEAR.\""},
}


# width over height of each photograph
ASPECT = {"delta": 1.27, "new-orleans": 1.46, "memphis": 1.33, "st-louis": 1.62, "chicago": 1.78, "harlem": 1.78}


def photo(key, caption):
    """One of the map's photographs as a gallery item, under the plan's own caption."""
    p = PHOTOS[key]
    return {"img": p["img"], "caption": caption, "sub": p["credit"], "alt": p["alt"], "aspect": ASPECT[key]}


# the exhibition's own Bessie Smith record, on the phonograph
BESSIE = {"src": "/exhibitions/harlem/artifacts/audio/womans-trouble-blues.mp3",
          "label": "“Woman’s Trouble Blues”", "sub": "Bessie Smith · the phonograph",
          "credit": "Columbia Records 78 RPM pressing, c. 1924"}

# single instruments from the Jazz Lab's Name That Instrument
JAZZ_LAB = "/exhibitions/harlem/audio/guess-instrument/"


def instrument(name, file):
    return {"src": JAZZ_LAB + file, "label": name, "sub": "Jazz Lab"}
