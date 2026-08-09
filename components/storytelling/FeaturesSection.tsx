import { Brain, FileText, Search, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Smart Summaries",
      description: "Get straight to the point with AI-generated overviews that capture the core message.",
      icon: <Brain className="w-8 h-8 text-accent" />
    },
    {
      title: "Structured Notes",
      description: "Key concepts are automatically broken down into readable, structured formats.",
      icon: <FileText className="w-8 h-8 text-accent" />
    },
    {
      title: "Semantic Search",
      description: "Find exactly what you're looking for across all your saved notes instantly.",
      icon: <Search className="w-8 h-8 text-accent" />
    },
    {
      title: "Time-Synced",
      description: "Every important insight is linked directly to the exact moment in the video.",
      icon: <Clock className="w-8 h-8 text-accent" />
    }
  ]

  return (
    <section id="features" className="py-48 md:py-64 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="editorial-heading mb-32">Features</h2>
        
        <div className="grid md:grid-cols-2 gap-y-32 gap-x-24">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col border-t border-white/5 pt-12">
              <div className="mb-12 p-6 inline-flex bg-white/5 rounded-2xl w-fit">
                {feature.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">{feature.title}</h3>
              <p className="editorial-body">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
