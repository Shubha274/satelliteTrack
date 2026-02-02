Satellite Orbital Data Generator

This Python script reads TLE (Two-Line Element) data for satellites, calculates orbital parameters such as apogee, perigee, inclination, RAAN, eccentricity, period, and current position, and outputs the results in a JSON file.

Features

Reads TLE data from a text file.

Computes:

Apogee and perigee in kilometers.

Inclination and RAAN in degrees.

Eccentricity.

Orbital period in minutes.

Current satellite position in km (x, y, z coordinates).

Saves all satellite information to a JSON file (satellites_full.json).

Requirements

Python 3.8+

Libraries:

skyfield

sgp4

Install dependencies with pip:

pip install skyfield sgp4

File Structure

generate_simplified.py — main script.

TLE_data.txt — text file containing TLEs (every satellite is 3 lines: name, line1, line2).

satellites_full.json — output JSON file generated after running the script.

TLE File Format

Each satellite’s TLE data should be in this format:

ISS (ZARYA)
1 25544U 98067A 25070.54718981 .00001264 00000-0 29690-4 0 9991
2 25544 51.6440 21.0235 0007386 307.6335 132.4628 15.50172291217932

Repeat for each satellite.

How to Run

Place your TLE file in a known directory and update the TLE_FILE variable in the script:

TLE_FILE = r"C:\satelliteTrack\server\data\TLE_data.txt"

Make sure to use a raw string (r"...") for Windows paths to avoid escape character issues.

Run the script:

python generate_simplified.py

After execution, check the output JSON file satellites_full.json in the same directory.

Output JSON Example
[
{
"name": "ISS (ZARYA)",
"tle_line1": "1 25544U 98067A 25070.54718981 .00001264 00000-0 29690-4 0 9991",
"tle_line2": "2 25544 51.6440 21.0235 0007386 307.6335 132.4628 15.50172291217932",
"apogee_km": 423.45,
"perigee_km": 415.23,
"inclination_deg": 51.644,
"raan_deg": 21.0235,
"eccentricity": 0.0007386,
"period_min": 92.84,
"position_km": [1234.56, 5678.90, 2345.67]
}
]
