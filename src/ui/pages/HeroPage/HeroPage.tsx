import Image from "next/image";
import hero from "../../../../public/images/hero.png";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-5 py-12 text-center sm:gap-7 sm:py-16">
        <Image
          src={hero}
          alt="Illustration of Febrian Thomas"
          priority
          className="h-auto w-full max-w-56 sm:max-w-72"
          sizes="(min-width: 640px) 288px, 224px"
        />
        <h1 className="font-bagel-fat-one text-[clamp(2rem,8vw,5rem)] leading-[0.95]">
          febrianthomas
        </h1>
      </section>
    </main>
  );
}
