
import Link from "next/link"

function Header() {
  return (
    <nav className="flex font-bold w-full px-10 py-4">
      <p className="font-bold text-lg">⚽ Quiz Bola de Ouro</p>
      <ul className="flex gap-4 ml-auto">
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
  )
}

export default Header
