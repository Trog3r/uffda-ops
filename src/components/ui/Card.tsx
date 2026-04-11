interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#1a1a1a] border border-neutral-800 rounded-lg ${className}`}>
      {children}
    </div>
  )
}
