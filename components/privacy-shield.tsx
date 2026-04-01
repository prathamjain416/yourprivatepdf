import { ShieldCheck, Zap, Lock, EyeOff } from "lucide-react"

const benefits = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "100% Client-Side",
    description: "Processing happens in your browser using Web Workers. No file data is ever sent to a server.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "No Uploads Required",
    description: "Your files stay on your machine. We don't even have a backend to receive them.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Lightning Fast",
    description: "Zero network latency. Files are processed at the speed of your hardware using WebAssembly.",
  },
  {
    icon: <EyeOff className="w-5 h-5" />,
    title: "Privacy by Design",
    description: "No tracking, no cookies, no database. Your business is your business.",
  },
]

export function PrivacyShield() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {benefits.map((benefit, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-card border shadow-sm space-y-3 transition-colors hover:border-primary/50"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {benefit.icon}
          </div>
          <h3 className="font-semibold text-lg">{benefit.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}
