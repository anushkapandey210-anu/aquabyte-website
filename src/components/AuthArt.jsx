import logo from '../assets/aquabyte-logo.png'

export default function AuthArt({ text }) {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-12 md:py-0 bg-gradient-to-br from-aqua-lightblue to-aqua-lightteal">
      {[0, -2, -4].map(delay => (
        <span key={delay}
          className="absolute rounded-full border-2 border-aqua-blue/15 animate-ripple"
          style={{ animationDelay: `${delay}s` }} />
      ))}
      <img src={logo} alt="AquaByte IoT Solutions" className="relative w-48 md:w-72 animate-float" />
      <p className="relative text-aqua-grey max-w-xs mt-6">{text}</p>
    </div>
  )
}