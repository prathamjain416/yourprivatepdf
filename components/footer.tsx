export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Your Private PDF</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Private PDF is the world's most secure PDF tool. We believe your data belongs to you, and privacy is
              a human right. Built entirely on client-side technology.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Guarantee</h4>
            <p className="text-xs text-muted-foreground bg-card p-3 rounded-lg border border-dashed">
              Verified: No data is sent over the network during processing. Open your Network tab in DevTools to confirm
              zero outgoing traffic.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Your Private PDF. All rights reserved. Privacy is baked in.
        </div>
      </div>
    </footer>
  )
}
