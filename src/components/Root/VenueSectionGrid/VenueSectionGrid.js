import { useContext, useEffect, useState } from 'react';

import classes from './VenueSectionGrid.module.css';
import VenueBackground from '../../../assets/images/VenueBackground.png';

import ShowDetailsContext from '../../../store/show-details-context.js';

function VenueSectionGrid() {
  const [levels, setLevels] = useState([]);
  const {showDetails, updateShowDetails} = useContext(ShowDetailsContext);
  useEffect(() => {
    const fetchLevels = async () => {
      if (showDetails.venue) {
        try {
          const levelsResponse = await fetch('http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/levels?include=seats');
          const levels = await levelsResponse.json();

          const filteredLevels = levels.filter((level) => level.venueId === showDetails.venue.id);

          setLevels(filteredLevels);
        } catch (error) {}
      }
    };

    fetchLevels();
  }, [showDetails.venue]);


  const constructSeats = (params) => {
    const seats = [];
    const {levelId, levelName, price, reservedSeats, rows, seatsPerRow} = params;

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        seats.push({levelId, levelName, price, row, seat,
          reserved: (reservedSeats.find((reservedSeat) => reservedSeat.row === row && reservedSeat.seatNumber === seat)) ? true : false
        })
      }
    }

    return seats;
  };

  const clickHandler = (level) => {
    const reservedSeats = level.seats.filter((seat) => seat.performanceId === showDetails.performance.id);
    const seats = constructSeats({levelId: level.id, levelName: level.name, rows: level.numRows, seatsPerRow: level.seatsPerRow, price: level.price, reservedSeats});
    updateShowDetails({type: 'UPDATE_SEATS', payload: seats});
  };

  return (
    <div className={classes.venue_section_grid}>
      {
        levels.map((level) =>  <button className={classes.level_button} key={level.id} onClick={clickHandler.bind(this, level)}>{level.name}</button>)
      }
      <img alt="Venue Background" src={VenueBackground}/>
    </div>
  );
}

export default VenueSectionGrid;
