import Link from "next/link";

function Header() {
  return (
    <nav className="flex font-bold w-full px-4 py-4">
      <ul className="flex gap-4 mx-auto font-sans uppercase">
        <li>
          <Link href="/">Início</Link>
        </li>
        <li>
          <Link href="/quiz">Jogar</Link>
        </li>
        <li>
          <Link href="/ranking">Ranking</Link>
        </li>
        <li>
          <Link href="/conquistas">Conquistas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
