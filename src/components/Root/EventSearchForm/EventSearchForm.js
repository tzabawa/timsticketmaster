import { useContext, useEffect, useState } from 'react';

import classes from './EventSearchForm.module.css';

import ShowDetailsContext from '../../../store/show-details-context.js';

function EventSearchForm(props) {
  const {showDetails, updateShowDetails} = useContext(ShowDetailsContext);
  const [formData, setFormData] = useState({
    venues: null,
    shows: null,
    performances: null
  });

  const fetchVenues = async () => {
    try {
      // Hard coded venueId for time purposes
      const venueResponse = await fetch('http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/venues/1');
      const venue = await venueResponse.json();
      return [venue];
    } catch (error) {}
  };

  const fetchShows = async (venueId) => {
    try {
      const showsResponse = await fetch(`http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/shows?venueId=${venueId}`);
      const shows = await showsResponse.json();
      return shows;
    } catch (error) {}
  };

  const fetchPerformances = async (showId) => {
    try {
      const performancesResponse = await fetch(`http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/performances?showId=${showId}`);
      const performances = await performancesResponse.json();
      return performances;
    } catch (error) {}
  };

  useEffect(() => {
    const fetchSearchShowData = async () => {
      try {
        const venues = await fetchVenues();
        const shows = await fetchShows(venues[0].id);
        const performances = await fetchPerformances(shows[0].id);

        setFormData((prevState) => ({
          ...prevState,
          venues,
          shows,
          performances
        }));

        updateShowDetails({type: 'UPDATE_VENUE', payload: venues[0]});
        updateShowDetails({type: 'UPDATE_SHOW', payload: shows[0]});
        updateShowDetails({type: 'UPDATE_PERFORMANCE', payload: performances[0]});
      } catch (error) {
      }
    };

    fetchSearchShowData();
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    props.onEventSearchFormSubmit();
  }

  const showSelectHandler = async (event) => {
    const show = formData.shows.find(({name}) => name === event.target.value);
    updateShowDetails({type: 'UPDATE_SHOW', payload: show});

    try {
      const performances = await fetchPerformances(show.id);

      setFormData((prevState) => ({
        ...prevState,
        performances
      }));

      updateShowDetails({type: 'UPDATE_PERFORMANCE', payload: performances[0]});
    } catch (error) {}
  };

  const performanceSelectHandler = (event) => {
    const performance = formData.performances.find(({showTime}) => showTime === event.target.value);
    updateShowDetails({type: 'UPDATE_PERFORMANCE', payload: performance});
  };

  const dateFormatter = (dateString) => {
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={classes.event_search_form}>
      {
        (formData.venues && formData.shows && formData.performances) ? (
          <div>
            <h3>Event Search</h3>
            <form className={classes.form} onSubmit={submitHandler}>
              <label>Available Venues:</label>
              <select className={classes.form_select}>
                {
                  formData.venues.map((venue) => (
                    <option key={venue.id} value={venue.name}>{venue.name}</option>
                  ))
                  }
              </select>
              <label>Available Shows:</label>
              <select value={(showDetails.show) ? showDetails.show.name : undefined} onChange={showSelectHandler}>
                {
                  formData.shows.map((show) => (
                    <option key={show.id} value={show.name}>{show.name}</option>
                  ))
                  }
              </select>
              <label>Available Performances:</label>
              <select value={(showDetails.performance) ? showDetails.performance.name : undefined} onChange={performanceSelectHandler}>
                {
                  formData.performances.map((performance) => (
                    <option key={performance.id} value={performance.showTime}>{dateFormatter(performance.showTime)}</option>
                  ))
                  }
              </select>
              <button>Submit</button>
            </form>
          </div>
        ) : (
          <div className="loading-view">Loading Show Search...</div>
        )
      }
    </div>
  );
}

export default EventSearchForm;
