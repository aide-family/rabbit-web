import React from 'react'

export default React.memo(function TestPage() {
  console.log('TestPage', import.meta.env.VITE_V1_API_URL)
  return <div>TestPage</div>
})
