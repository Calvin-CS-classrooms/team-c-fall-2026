import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Calvin Ratings', () => {
  it('shows an introductory screen with a current capacity snapshot', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find your place.' })).toBeInTheDocument()
    expect(screen.getByText('Hekman Library')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /explore campus now/i })).toBeInTheDocument()
  })

  it('opens the nearby places list and returns to the introduction', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /explore campus now/i }))

    expect(screen.getByRole('heading', { name: 'Places' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Map of Calvin University campus' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "View Johnny's" })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: "Johnny's" }))
    expect(screen.getByText('Easy to find a table')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Rate Johnny's" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Morren Fitness Center' }))
    expect(screen.getByRole('button', { name: 'Rate Morren Fitness Center' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back to welcome screen' }))
    expect(screen.getByRole('heading', { name: 'Find your place.' })).toBeInTheDocument()
  })
})