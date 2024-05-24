import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-t-black h-20 flex items-center justify-center text-center text-xs">
      <p>
        Designed & Developed by{" "}
        <Link
          href="https://benoit-om.com"
          target="_blank"
          className="whitespace-nowrap underline"
        >
          Benoit Ortalo-Magne
        </Link>
      </p>
    </footer>
  );
}
