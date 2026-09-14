import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Removes the previous rendered UI so every test starts with a clean document.
afterEach(cleanup)