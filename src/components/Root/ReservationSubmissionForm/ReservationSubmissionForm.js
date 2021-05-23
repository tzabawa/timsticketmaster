import { Fragment, useContext, useState } from 'react';

import classes from './ReservationSubmissionForm.module.css';

import TheCard from '../../ui/TheCard/TheCard.js';

import ShowDetailsContext from '../../../store/show-details-context.js';

function ReservationSubmissionForm(props) {
  const {showDetails} = useContext(ShowDetailsContext);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onFirstNameInputChangeHandler = (event) => {
    setCustomerData((prevState) => ({
      ...prevState,
      firstName: event.target.value
    }));
  };

  const onLastNameInputChangeHandler = (event) => {
    setCustomerData((prevState) => ({
      ...prevState,
      lastName: event.target.value
    }));
  };

  const onEmailInputChangeHandler = (event) => {
    setCustomerData((prevState) => ({
      ...prevState,
      email: event.target.value
    }));
  };

  const onAddressInputChangeHandler = (event) => {
    setCustomerData((prevState) => ({
      ...prevState,
      address: event.target.value
    }));
  };

  const onReservationsFormSubmission = async  () => {
    try {
      const customersResponse = await fetch('http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/customers');
      const customers = await customersResponse.json();

      const existingCustomerData = customers.find((customer) => customer.email === customerData.email && customer.address === customerData.address);


      let customerId = undefined;

      if (existingCustomerData) {
        customerId = existingCustomerData.id;
      } else {
        const customerResponse = await fetch(
          'http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/customers',
          {
            method: 'POST',
            body: JSON.stringify({
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              email: customerData.email,
              address: customerData.address
            }),
            headers: {'Content-Type': 'application/json'}
          }
        );
        const newCustomer = await customerResponse.json();
        customerId = newCustomer.id;
      }

      const seatBuckets = showDetails.currentReservation.reduce((agg, reservation) => {
        if (agg[reservation.levelId]) {
          agg[reservation.levelId] += 1;
        } else {
          agg[reservation.levelId] = 1;
        }

        return agg;
      }, {});

      await Promise.all(Object.keys(seatBuckets).map((levelId) => {
        return fetch(
          'http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api/reservations',
          {
            method: 'POST',
            body: JSON.stringify({
              performanceId: showDetails.performance.id,
              customer: {id: customerId},
              seatRequests: [{level: {id: levelId}, numSeats: seatBuckets[levelId]}]
            }),
            headers: {'Content-Type': 'application/json'}
          }
        )
      }));

      setFormSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  }


  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={classes.reservation_submission_form}>
      <div>
        <h3 className={classes.form_title}>Complete Reservation</h3>
        {
          (formSubmitted) ? (
            <div>
              <h4>Your reservations was successfully created!</h4>
            </div>
          ) : (
            <Fragment>
              <div className={classes.customer_data_form}>
                <label>First Name:</label>
                <input type="text" value={customerData.firstName} onChange={onFirstNameInputChangeHandler}/>
                <label>Last Name:</label>
                <input type="text" value={customerData.lastName} onChange={onLastNameInputChangeHandler} />
                <label>Email:</label>
                <input type="email" value={customerData.email} onChange={onEmailInputChangeHandler} />
                <label>Address:</label>
                <input type="text" value={customerData.address} onChange={onAddressInputChangeHandler} />
              </div>
              <div>
                <h4>Summary</h4>
              </div>
              <div className={classes.reservations_summary}>
                <h5>Venue: {showDetails.venue.name}</h5>
                <h5>Show: {showDetails.show.name}</h5>
                <h5>Time: {formatDate(showDetails.performance.showTime)}</h5>
                <div>
                  {
                    showDetails.currentReservation.map((currentReservation) => (
                      <TheCard key={`${currentReservation.row}_${currentReservation.seat}`}>
                        <div className={classes.reservation_details}>
                          <div>
                            <span>${currentReservation.price}</span>
                          </div>
                          <h4>Level: {currentReservation.levelName}</h4>
                          <h5>Row: {currentReservation.row}</h5>
                          <h5>Seat: {currentReservation.seat}</h5>
                        </div>
                      </TheCard>
                    ))
                  }
                </div>
                <button className={classes.form_button} disabled={
                  !customerData.firstName
                  || !customerData.lastName
                  || !customerData.email
                  || !customerData.address
                  || !showDetails.currentReservation.length}
                  onClick={onReservationsFormSubmission}>Submit
                </button>
              </div>
            </Fragment>
          )
        }
      </div>
    </div>
  );
}

export default ReservationSubmissionForm;

