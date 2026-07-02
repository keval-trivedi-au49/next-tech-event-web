import Image from "next/image";
import Link from "next/link";

export const NavBar = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="logo" width={24} height={24}></Image>
                <p>Tech Event Hub</p>
                </Link>
                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                    <Link href="/">Add Event</Link>
                </ul>
            </nav>
        </header>
    );
};