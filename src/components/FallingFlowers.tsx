import {motion} from "framer-motion";
const assets = [
  "/images/daun-priangan.png",
  "/images/melati.png",
  "/images/mega-mendung.png",
];

export default function FallingFlowers(){

   return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 25 }).map((_, i) => {
        const image = assets[Math.floor(Math.random() * assets.length)];

        return (
          <motion.img
            key={i}
            src={image}
            alt=""
            className="absolute opacity-70"
            style={{
              width: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{
              y: -100,
              rotate: 0,
            }}
            animate={{
              y: "120vh",
              rotate: Math.random() > 0.5 ? 360 : -360,
              x: [
                0,
                20,
                -20,
                15,
                -15,
                0,
              ],
            }}
            transition={{
              duration: 12 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}