import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from '@/pages/home'

describe('HomePage', () => {
  test('renders', () => {
    render(<HomePage />)
    expect(screen.getByText('Localization JSON uploader')).toBeDefined()
  })
})
