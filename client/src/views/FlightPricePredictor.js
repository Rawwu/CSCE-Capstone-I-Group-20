import React, { useState } from 'react';
import "../styles/FlightPricePredictor.css"

const FlightPricePredictor = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    carrier: '',
    nsmiles: '',
    days_to_predict: 30
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nsmiles' || name === 'days_to_predict' ? parseInt(value) || '' : value.toUpperCase()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://pm-api-f2bd9d17908f.herokuapp.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: formData.origin,
          destination: formData.destination,
          carrier: formData.carrier,
          nsmiles: parseInt(formData.nsmiles),
          days_to_predict: parseInt(formData.days_to_predict)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError('Error: ' + (err.message || 'Failed to fetch predictions'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictor-wrapper mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="my-card">
            <div className="card-header">
              <h2 className="text-center">Flight Price Predictor</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Origin Airport Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="e.g., ORD"
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Destination Airport Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g., DEN"
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Carrier Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleInputChange}
                        placeholder="e.g., UA"
                        required
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Distance (miles)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="nsmiles"
                        value={formData.nsmiles}
                        onChange={handleInputChange}
                        placeholder="e.g., 888"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Days to Predict</label>
                      <input
                        type="number"
                        className="form-control"
                        name="days_to_predict"
                        value={formData.days_to_predict}
                        onChange={handleInputChange}
                        placeholder="e.g., 30"
                        required
                        min="1"
                        max="90"
                      />
                      <small className="text-muted">Enter number of days (1-90)</small>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn  pred-button"
                    disabled={loading}
                  >
                    {loading ? 'Predicting...' : 'Predict Prices'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}

              {predictions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-center mb-3">Price Predictions</h3>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Day</th>
                          <th className="text-right">Predicted Fare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.map((prediction, index) => (
                          <tr key={index}>
                            <td>{new Date(prediction.date).toLocaleDateString()}</td>
                            <td>{prediction.day}</td>
                            <td className="text-right">
                              ${prediction.predicted_fare.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPricePredictor;