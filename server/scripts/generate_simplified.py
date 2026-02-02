# import os
# import json
# from skyfield.api import EarthSatellite, load
# from skyfield.sgp4lib import EarthSatellite as SGP4Satellite

# # Load timescale
# ts = load.timescale()

# # Path to your TLE file
# TLE_FILE = "C:\satelliteTrack\server\data\TLE_data.txt"

# satellites = []

# # Read TLE file
# with open(TLE_FILE, "r") as f:
#     lines = f.readlines()

# # Parse TLEs (every 3 lines: name, line1, line2)
# for i in range(0, len(lines), 3):
#     name = lines[i].strip()
#     line1 = lines[i + 1].strip()
#     line2 = lines[i + 2].strip()

#     # Create EarthSatellite object
#     sat = EarthSatellite(line1, line2, name, ts)

#     # Store original TLE lines
#     sat.tle_line1 = line1
#     sat.tle_line2 = line2

#     # Orbital elements from TLE
#     orbit = sat.model  # sgp4 model
#     mean_motion = orbit.no_kozai  # revs per day
#     eccentricity = orbit.ecco
#     inclination = orbit.inclo * (180 / 3.141592653589793)  # radians to degrees
#     raan = orbit.nodeo * (180 / 3.141592653589793)         # RAAN in degrees

#     # Semi-major axis in km (from mean motion)
#     mu = 398600.4418  # km^3/s^2 Earth gravitational constant
#     n = mean_motion * 2 * 3.141592653589793 / 86400       # rad/sec
#     a = (mu / (n ** 2)) ** (1/3)                           # semi-major axis in km

#     perigee = a * (1 - eccentricity)                       # km
#     apogee = a * (1 + eccentricity)                        # km

#     # Orbital period in minutes
#     period = 1440 / mean_motion

#     # Current position
#     position = sat.at(ts.now()).position.km.tolist()

#     satellites.append({
#         "name": sat.name,
#         "tle_line1": sat.tle_line1,
#         "tle_line2": sat.tle_line2,
#         "apogee_km": round(apogee, 2),
#         "perigee_km": round(perigee, 2),
#         "inclination_deg": round(inclination, 4),
#         "raan_deg": round(raan, 4),
#         "eccentricity": round(eccentricity, 7),
#         "period_min": round(period, 2),
#         "position_km": position
#     })

# # Save to JSON
# output_file = "satellites_full.json"
# with open(output_file, "w") as f:
#     json.dump(satellites, f, indent=4)

# print(f"Saved {len(satellites)} satellites with orbital info to {output_file}")
import os
import json
from skyfield.api import EarthSatellite, load, wgs84

# Load timescale
ts = load.timescale()

# Path to your TLE file
TLE_FILE = r"C:\satelliteTrack\server\data\TLE_data.txt"

satellites = []

# Read TLE file
with open(TLE_FILE, "r") as f:
    lines = f.readlines()

# Parse TLEs (every 3 lines: name, line1, line2)
for i in range(0, len(lines), 3):
    name = lines[i].strip()
    line1 = lines[i + 1].strip()
    line2 = lines[i + 2].strip()

    # Create EarthSatellite object
    sat = EarthSatellite(line1, line2, name, ts)

    # Store original TLE lines
    sat.tle_line1 = line1
    sat.tle_line2 = line2

    # Orbital elements from TLE
    orbit = sat.model
    mean_motion = orbit.no_kozai
    eccentricity = orbit.ecco
    inclination = orbit.inclo * (180 / 3.141592653589793)
    raan = orbit.nodeo * (180 / 3.141592653589793)

    mu = 398600.4418  # km^3/s^2
    n = mean_motion * 2 * 3.141592653589793 / 86400
    a = (mu / (n ** 2)) ** (1/3)
    perigee = a * (1 - eccentricity)
    apogee = a * (1 + eccentricity)
    period = 1440 / mean_motion

    # Current position in km
    geocentric = sat.at(ts.now())
    position = geocentric.position.km.tolist()

    # Latitude, longitude, altitude
    subpoint = wgs84.subpoint(geocentric)
    latitude = subpoint.latitude.degrees
    longitude = subpoint.longitude.degrees
    altitude = subpoint.elevation.km

    satellites.append({
        "name": sat.name,
        "tle_line1": sat.tle_line1,
        "tle_line2": sat.tle_line2,
        "apogee_km": round(apogee, 2),
        "perigee_km": round(perigee, 2),
        "inclination_deg": round(inclination, 4),
        "raan_deg": round(raan, 4),
        "eccentricity": round(eccentricity, 7),
        "period_min": round(period, 2),
        "position_km": position,
        "latitude_deg": round(latitude, 6),
        "longitude_deg": round(longitude, 6),
        "altitude_km": round(altitude, 3)
    })

# Save to JSON
output_file = "satellites_full.json"
with open(output_file, "w") as f:
    json.dump(satellites, f, indent=4)

print(f"Saved {len(satellites)} satellites with orbital info and lat/lon to {output_file}")
