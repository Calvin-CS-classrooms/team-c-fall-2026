import { useState } from 'react'
import './App.css'

// Temporary campus data displayed by the client until it is connected to the server.
const spaces = [
  { name: 'Hekman Library', type: 'Study spaces', status: 'Busy', detail: '82% of seats reported full', description: 'Quiet reading rooms, group tables, research help, and late-night study space.', tone: 'busy', position: 'library' },
  { name: "Johnny's", type: 'Dining', status: 'Easy to find a table', detail: '46% of tables in use', description: 'A campus spot for coffee, meals, and catching up with friends between classes.', tone: 'open', position: 'johnnys' },
  { name: 'Morren Fitness Center', type: 'Recreation', status: 'Moderate activity', detail: '61% of equipment in use', description: 'Fitness equipment, group exercise classes, recreation, and varsity athletics.', tone: 'moderate', position: 'morren' },
]

function App() {
  // Switches between the welcome screen and the interactive campus map.
  const [showDirectory, setShowDirectory] = useState(false)
  if (showDirectory) return <Directory onBack={() => setShowDirectory(false)} />

  return <main className="landing">
    <header className="site-header"><a className="wordmark" href="#top" aria-label="Calvin Ratings home">Calvin <span>Ratings</span></a><span className="member-badge">Calvin community</span></header>
    <section className="welcome" id="top">
      <p className="eyebrow">On campus, in the know</p><h1>Find your place.</h1>
      <p className="intro">Live, anonymous updates from the Calvin community help you decide where to study, gather, or go next.</p>
      <button className="primary-button" type="button" onClick={() => setShowDirectory(true)}>Explore campus now <span aria-hidden="true">→</span></button>
    </section>
    <section className="snapshot" aria-label="Sample campus status"><div><p className="snapshot-label">Live right now</p><p className="snapshot-place">Hekman Library</p></div><div className="occupancy"><span className="status-dot" aria-hidden="true" /><strong>Busy</strong><span>82% full</span></div></section>
  </main>
}

function Directory({ onBack }) {
  // The selected place controls both the active pin and the bottom-sheet details.
  const [selectedPlace, setSelectedPlace] = useState(spaces[0])

  return <main className="directory">
    <section className="map-canvas" aria-label="Map of Calvin University campus">
      <header className="map-header"><button className="map-back" type="button" onClick={onBack} aria-label="Back to welcome screen">←</button><div className="map-search" aria-label="Search campus places"><span aria-hidden="true">⌕</span><span>Search Calvin campus</span></div><button className="profile-button" type="button" aria-label="Calvin community profile">C</button></header>
      <p className="map-area-label">Calvin University campus</p><div className="campus-boundary" aria-hidden="true" /><div className="campus-road road-one" aria-hidden="true" /><div className="campus-road road-two" aria-hidden="true" /><div className="campus-road road-three" aria-hidden="true" /><div className="campus-green green-one" aria-hidden="true" /><div className="campus-green green-two" aria-hidden="true" /><div className="campus-green green-three" aria-hidden="true" /><span className="map-road-label label-one">East Beltline Ave</span><span className="map-road-label label-two">Lake Drive</span>
      {/* Map pins and Place tabs select the same mocked campus location. */}
      {spaces.map((space) => <button className={`map-pin ${space.position} ${selectedPlace.name === space.name ? 'selected-pin' : ''}`} type="button" key={space.name} onClick={() => setSelectedPlace(space)} aria-label={`View ${space.name}`}><span className={`pin-dot status-${space.tone}`} aria-hidden="true" />{space.name}</button>)}
      <button className="location-button" type="button" aria-label="Center on your location">⌁</button>
    </section>
    <section className="places-sheet" aria-label="Places"><div className="sheet-handle" aria-hidden="true" /><div className="sheet-heading"><div><p className="eyebrow">Campus live map</p><h1>Places</h1></div><span>3 nearby</span></div><div className="place-tabs" role="tablist" aria-label="Campus places">{spaces.map((space) => <button role="tab" type="button" aria-selected={selectedPlace.name === space.name} key={space.name} onClick={() => setSelectedPlace(space)}>{space.name}</button>)}</div><article className="selected-place-card"><div><div className="place-topline"><span>{selectedPlace.type}</span><span className={`status status-${selectedPlace.tone}`}><i aria-hidden="true" />{selectedPlace.status}</span></div><h2>{selectedPlace.name}</h2><p>{selectedPlace.description}</p></div><footer><span>{selectedPlace.detail}</span><button type="button" aria-label={`Rate ${selectedPlace.name}`}>Rate this place</button></footer></article></section>
  </main>
}

export default App
