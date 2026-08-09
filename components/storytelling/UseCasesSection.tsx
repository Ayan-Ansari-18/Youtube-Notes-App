export function UseCasesSection() {
  const cases = [
    {
      role: "Students",
      desc: "Turn hours of lectures into comprehensive study guides.",
      tags: ["Study Guides", "Flashcards", "Exam Prep"]
    },
    {
      role: "Professionals",
      desc: "Extract key takeaways from industry talks and tutorials.",
      tags: ["Meeting Notes", "Skill Building", "Research"]
    },
    {
      role: "Creators",
      desc: "Analyze competitor content and gather inspiration quickly.",
      tags: ["Content Strategy", "Trend Analysis", "Ideation"]
    }
  ]

  return (
    <section id="use-cases" className="py-48 md:py-64 bg-[#030303]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="editorial-heading mb-32 text-center">Built for learning.</h2>
        
        <div className="grid md:grid-cols-3 gap-16">
          {cases.map((item, index) => (
            <div key={index} className="flex flex-col group">
              <div className="h-[2px] w-full bg-white/10 mb-12 group-hover:bg-accent transition-colors duration-500"></div>
              <h3 className="text-3xl font-semibold mb-6">{item.role}</h3>
              <p className="editorial-body mb-12 flex-grow">{item.desc}</p>
              
              <div className="flex flex-wrap gap-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 text-sm text-muted bg-white/5 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
