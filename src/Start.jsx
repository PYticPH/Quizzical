//

export default function Start({ setStatus }) {

  return (
    <>
      <h1>Quizzical</h1>
      <p className="small-text">Test your knowledge of everything</p>
      <button
        className="start"
        onClick={() => setStatus(prev => (
          {
            ...prev,
            start: !prev.start
          }
        ))}>Start</button>
    </>
  )
}
