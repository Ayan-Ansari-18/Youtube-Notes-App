export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-48 md:py-64 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="mb-48 text-center md:text-left">
          <h2 className="editorial-heading mb-8">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-24 relative">
          {[
            {
              step: "01",
              title: "Paste",
              desc: "Drop in any supported YouTube URL.",
            },
            {
              step: "02",
              title: "Understand",
              desc: "AI analyzes the available video content and identifies the important ideas.",
            },
            {
              step: "03",
              title: "Learn",
              desc: "Get structured notes that are easy to read, search and revisit.",
            }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-start text-left">
              <div className="text-6xl md:text-8xl font-light text-white/5 mb-12 tracking-tighter">
                {item.step}
              </div>
              <h3 className="text-4xl md:text-5xl font-semibold mb-8 text-foreground tracking-tight">{item.title}</h3>
              <p className="editorial-body leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
