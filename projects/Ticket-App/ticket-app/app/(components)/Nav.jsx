import { faHome, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex justify-between bg-gray-800 dark:bg-gray-900 p-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <FontAwesomeIcon icon={faHome} className="text-white hover:text-gray-300 text-xl cursor-pointer transition-colors" />
        </Link>
        <Link href="/TicketPage/new">
          <FontAwesomeIcon icon={faTicket} className="text-white hover:text-gray-300 text-xl cursor-pointer transition-colors" />
        </Link>
      </div>
      <div>
        <p className="text-white dark:text-gray-300">palmer.pa123@gmail.com</p>
      </div>
    </nav>
  );
};

export default Nav;