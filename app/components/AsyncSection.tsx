import React from 'react'

export interface AsyncSectionProps {
  loading: boolean
  error?: string | null
  isEmpty: boolean
  loadingLabel?: string
  errorLabel?: string
  emptyLabel: string
  children: React.ReactNode
}

export default function AsyncSection({
  loading,
  error,
  isEmpty,
  loadingLabel = 'Loading…',
  errorLabel = 'Could not load content.',
  emptyLabel,
  children,
}: AsyncSectionProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-10" role="status" aria-live="polite" aria-label={loadingLabel}>
        <div className="spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-white/60" role="alert">
        {errorLabel}
      </p>
    )
  }

  if (isEmpty) {
    return <p className="text-sm text-white/60">{emptyLabel}</p>
  }

  return <>{children}</>
}
