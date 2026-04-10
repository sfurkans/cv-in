export default function Footer() {
  return (
    <footer className="border-t bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        CV Builder &copy; {new Date().getFullYear()}
      </div>
    </footer>
  )
}
