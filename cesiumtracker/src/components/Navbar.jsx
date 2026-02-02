import { Link } from "react-router-dom";
import { useState } from "react";

const countries = [
  "United States",
  "India",
  "China",
  "United Kingdom",
  "France",
  "Japan",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    // <nav className="bg-blue-800 text-white px-6 py-3 flex justify-between">
    //   <h1 className=" title font-bold text-xl">SatelliteTracker</h1>

    //   <ul className="flex gap-6 items-center">
    //     <li>
    //       <Link to="/">Home</Link>
    //     </li>

    //     <li
    //       className="relative"
    //       onMouseEnter={() => setOpen(true)}
    //       onMouseLeave={() => setOpen(false)}
    //     >
    //       <span className="cursor-pointer">Satellites on Orbit ▾</span>

    //       {open && (
    //         <div className="absolute top-8 left-0 bg-white text-black w-60 shadow-lg p-3">
    //           <h4 className="font-semibold mb-2">Owners / Countries</h4>

    //           {countries.map((c) => (
    //             <Link
    //               key={c}
    //               to={`/satellites/${c.toLowerCase().replaceAll(" ", "-")}`}
    //               className="block hover:bg-gray-200 px-2 py-1"
    //             >
    //               {c}
    //             </Link>
    //           ))}
    //         </div>
    //       )}
    //     </li>
    //   </ul>
    // </nav>
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/" className="nav-title-link">
          <h1 className="nav-title">SatelliteTracker</h1>
        </Link>
      </div>
      {/* CENTER */}
      <ul className="nav-center">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li
          className="dropdown"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className="nav-link dropdown-trigger">
            Satellites on Orbit ▾
          </span>

          {open && (
            <div className="dropdown-menu">
              <h4 className="dropdown-title">Owners / Countries</h4>

              {countries.map((c) => (
                <Link
                  key={c}
                  to={`/satellites/${c.toLowerCase().replaceAll(" ", "-")}`}
                  className="dropdown-item"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}
        </li>
      </ul>

      {/* RIGHT */}
      <div className="nav-right" />
    </nav>
  );
}
