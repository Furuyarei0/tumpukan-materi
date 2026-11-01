import { useEffect, useState } from "react";
import logo from "../../assets/logo/logo.svg";

const sections = [
  { id: "home", label: "Beranda" },
  { id: "board", label: "Papan kelas" },
  { id: "deck", label: "Materi" },
];

export function Navbar({ onOpenSubmit, isAdmin = false, onOpenAdmin, onLogout }) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.1, 0.3, 0.6] },
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-nav">
      <a className="brand-link" href="#home" aria-label="Tumpukan Materi — beranda">
        <img src={logo} alt="Tumpukan Materi" />
      </a>
      {activeSection !== "home" && (
        <nav className="nav-links" aria-label="Navigasi utama">
          {sections.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? "page" : undefined}>
              {label}
            </a>
          ))}
        </nav>
      )}
      <button className="send-link" type="button" onClick={() => onOpenSubmit("new")}>
        Kirim materi
      </button>
      {isAdmin ? (
        <div className="nav-admin-tools">
          <span>Mode admin</span>
          <button type="button" onClick={onOpenAdmin}>Dashboard</button>
          <button type="button" onClick={onLogout}>Keluar</button>
        </div>
      ) : null}
    </header>
  );
}
