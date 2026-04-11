interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="py-8 text-center text-sm text-neutral-600">
      {message}
    </div>
  )
}
