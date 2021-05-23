import React from 'react';

const ShowDetailsContext = React.createContext({
  venue: null,
  show: null,
  performance: null,
  seats: [],
  currentReservation: [],
})

export default ShowDetailsContext;