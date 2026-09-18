import { fireEvent, render } from '@testing-library/react-native'
import App from '../App'

describe('Calvin Ratings app', () => {
  // The initial screen should greet the user and offer a location-based rating.
  it('starts on Home with the current-location rating prompt', () => {
    const { getByText } = render(<App />)

    expect(getByText('Welcome, John')).toBeTruthy()
    expect(getByText('Hekman Library - Floor 2')).toBeTruthy()
    expect(getByText('RATE YOUR CURRENT LOCATION')).toBeTruthy()
  })

  // Explore should filter the directory and reveal details for a selected place.
  it('navigates to Explore, filters places, and expands a floor guide', () => {
    const { getAllByText, getByText, queryByText } = render(<App />)

    fireEvent.press(getAllByText('Explore').at(-1)!)
    expect(getByText('Explore campus')).toBeTruthy()

    fireEvent.press(getByText('Dining & Cafes'))
    expect(getByText("Johnny's")).toBeTruthy()
    expect(getByText('Commons Dining Hall')).toBeTruthy()
    expect(queryByText('Hekman Library')).toBeNull()

    fireEvent.press(getAllByText('Floor guide')[0])
    expect(getByText('Main level: Low Buzz atmosphere')).toBeTruthy()
    expect(getByText('Best time: before 10 AM or after 8 PM')).toBeTruthy()
  })

  // Saved places and privacy preferences should update through their controls.
  it('toggles saved places and privacy settings', () => {
    const { getAllByText, getByText, getAllByRole } = render(<App />)

    fireEvent.press(getAllByText('Explore').at(-1)!)
    fireEvent.press(getAllByText('Save')[0])
    expect(getAllByText('Saved').length).toBeGreaterThan(2)

    fireEvent.press(getAllByText('Profile').at(-1)!)
    const switches = getAllByRole('switch')
    expect(switches).toHaveLength(3)
    fireEvent(switches[0], 'valueChange', false)
    expect(switches[0].props.value).toBe(false)
  })

  // A user should be able to mark another student's rating as helpful.
  it('increments helpful votes from Ratings', () => {
    const { getAllByText, getByText } = render(<App />)

    fireEvent.press(getAllByText('Ratings').at(-1)!)
    expect(getByText('14')).toBeTruthy()
    expect(getByText('89 helpful votes')).toBeTruthy()

    fireEvent.press(getAllByText('Helpful +1')[0])
    expect(getByText('90 helpful votes')).toBeTruthy()
  })

  // Publishing a live update should change the place status and rating total.
  it('publishes a capacity update and increments the rating count', () => {
    const { getAllByText, getByText } = render(<App />)

    fireEvent.press(getByText('Rate now  >'))
    expect(getByText('Rate Hekman Library')).toBeTruthy()

    fireEvent.press(getByText('Maxed'))
    fireEvent.press(getByText('Publish live rating'))
    expect(getByText('Busy 100%')).toBeTruthy()

    fireEvent.press(getAllByText('Ratings').at(-1)!)
    expect(getByText('15')).toBeTruthy()
  })
})