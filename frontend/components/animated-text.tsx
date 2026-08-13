interface AnimatedTextProps {
  text: string
  delay?: number
}

export function AnimatedText({ text, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ")
  let charIndex = 0

  return (
    <span
      className="font-bold text-center text-6xl leading-[0.75] tracking-tighter font-serif text-black lg:text-9xl"
      style={{ perspective: 400, display: "inline-block" }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, index) => {
            const currentIndex = charIndex++
            return (
              <span
                key={index}
                className="inline-block animate-letter-reveal opacity-0"
                style={{
                  animationDelay: `${delay + currentIndex * 0.035}s`,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom",
                }}
              >
                {char}
              </span>
            )
          })}
          {wordIndex < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  )
}
