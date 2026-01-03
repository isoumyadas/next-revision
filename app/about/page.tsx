import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      <div>
        <Image src={"/vercel.svg"} height={200} width={200} alt="vercel-icon" />
      </div>
      <div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque
          maiores unde accusamus sapiente asperiores in sint distinctio
          suscipit, nesciunt animi adipisci!
        </p>
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio itaque
          unde quo!
        </p>
      </div>
    </div>
  );
}
