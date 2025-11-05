import Link from "next/link";

function Header() {
  return (
    <nav className="card-surface mb-8 flex w-full px-4 py-4">
      <ul className="mx-auto flex gap-4 font-mono font-bold uppercase">
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
