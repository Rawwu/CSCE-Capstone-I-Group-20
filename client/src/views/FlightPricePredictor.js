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

  const [originDropdown, setOriginDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const [carrierDropdown, setCarrierDropdown] = useState(false);
  const [filteredOrigins, setFilteredOrigins] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [filteredCarriers, setFilteredCarriers] = useState([]);


  const carrier = [
    { carrier: "AA/American Airlines" },
    { carrier: "AS/Alaska Airlines" },
    { carrier: "B6/JetBlue Airways" },
    { carrier: "DL/Delta Air Lines" },
    { carrier: "F9/Frontier Airlines" },
    { carrier: "G4/Allegiant Air" },
    { carrier: "HA/Hawaiian Airlines" },
    { carrier: "NK/Spirit Airlines" },
    { carrier: "UA/United Airlines" },
    { carrier: "WN/Southwest Airlines" }
  ];

  const airports = [
    { code: 'ABE', name: 'Lehigh Valley International Airport' },
    { code: 'ABQ', name: 'Albuquerque International Sunport' },
    { code: 'ACK', name: 'Nantucket Memorial Airport' },
    { code: 'ACY', name: 'Atlantic City International Airport' },
    { code: 'ACV', name: 'California Redwood Coast-Humboldt County Airport' },
    { code: 'AGS', name: 'Augusta Regional Airport' },
    { code: 'ALB', name: 'Albany International Airport' },
    { code: 'AMA', name: 'Rick Husband Amarillo International Airport' },
    { code: 'ASE', name: 'Aspen-Pitkin County Airport' },
    { code: 'ATL', name: 'Hartsfield–Jackson Atlanta International Airport' },
    { code: 'ATW', name: 'Appleton International Airport' },
    { code: 'AUS', name: 'Austin-Bergstrom International Airport' },
    { code: 'AVL', name: 'Asheville Regional Airport' },
    { code: 'AZA', name: 'Phoenix-Mesa Gateway Airport' },
    { code: 'BDL', name: 'Bradley International Airport' },
    { code: 'BGR', name: 'Bangor International Airport' },
    { code: 'BHM', name: 'Birmingham-Shuttlesworth International Airport' },
    { code: 'BIL', name: 'Billings Logan International Airport' },
    { code: 'BIS', name: 'Bismarck Municipal Airport' },
    { code: 'BLI', name: 'Bellingham International Airport' },
    { code: 'BLV', name: 'MidAmerica St. Louis Airport' },
    { code: 'BMI', name: 'Central Illinois Regional Airport' },
    { code: 'BNA', name: 'Nashville International Airport' },
    { code: 'BOI', name: 'Boise Airport' },
    { code: 'BOS', name: 'Boston Logan International Airport' },
    { code: 'BTR', name: 'Baton Rouge Metropolitan Airport' },
    { code: 'BTV', name: 'Burlington International Airport' },
    { code: 'BUF', name: 'Buffalo Niagara International Airport' },
    { code: 'BUR', name: 'Hollywood Burbank Airport' },
    { code: 'BWI', name: 'Baltimore/Washington International Thurgood Marshall Airport' },
    { code: 'BZN', name: 'Bozeman Yellowstone International Airport' },
    { code: 'CAE', name: 'Columbia Metropolitan Airport' },
    { code: 'CAK', name: 'Akron-Canton Airport' },
    { code: 'CGX', name: 'Meigs Field' },
    { code: 'CHA', name: 'Chattanooga Metropolitan Airport' },
    { code: 'CHI', name: 'Chicago area airports' },
    { code: 'CHO', name: 'Charlottesville-Albemarle Airport' },
    { code: 'CHS', name: 'Charleston International Airport' },
    { code: 'CID', name: 'The Eastern Iowa Airport' },
    { code: 'CLE', name: 'Cleveland Hopkins International Airport' },
    { code: 'CLT', name: 'Charlotte Douglas International Airport' },
    { code: 'CMH', name: 'John Glenn Columbus International Airport' },
    { code: 'COS', name: 'City of Colorado Springs Municipal Airport' },
    { code: 'CRP', name: 'Corpus Christi International Airport' },
    { code: 'CVG', name: 'Cincinnati/Northern Kentucky International Airport' },
    { code: 'DAB', name: 'Daytona Beach International Airport' },
    { code: 'DAL', name: 'Dallas Love Field' },
    { code: 'DAY', name: 'James M. Cox Dayton International Airport' },
    { code: 'DCA', name: 'Ronald Reagan Washington National Airport' },
    { code: 'DEN', name: 'Denver International Airport' },
    { code: 'DET', name: 'Coleman A. Young International Airport' },
    { code: 'DFW', name: 'Dallas/Fort Worth International Airport' },
    { code: 'DSM', name: 'Des Moines International Airport' },
    { code: 'DTT', name: 'Coleman A. Young International Airport' },
    { code: 'DTW', name: 'Detroit Metropolitan Airport' },
    { code: 'ECP', name: 'Northwest Florida Beaches International Airport' },
    { code: 'EFD', name: 'Ellington Airport' },
    { code: 'EGE', name: 'Eagle County Regional Airport' },
    { code: 'ELP', name: 'El Paso International Airport' },
    { code: 'EUG', name: 'Eugene Airport' },
    { code: 'EVV', name: 'Evansville Regional Airport' },
    { code: 'EWR', name: 'Newark Liberty International Airport' },
    { code: 'EYW', name: 'Key West International Airport' },
    { code: 'FAR', name: 'Hector International Airport' },
    { code: 'FAT', name: 'Fresno Yosemite International Airport' },
    { code: 'FCA', name: 'Glacier Park International Airport' },
    { code: 'FLL', name: 'Fort Lauderdale-Hollywood International Airport' },
    { code: 'FNL', name: 'Northern Colorado Regional Airport' },
    { code: 'FNT', name: 'Bishop International Airport' },
    { code: 'FSD', name: 'Joe Foss Field' },
    { code: 'FTW', name: 'Fort Worth Meacham International Airport' },
    { code: 'FWA', name: 'Fort Wayne International Airport' },
    { code: 'FYV', name: 'Drake Field' },
    { code: 'GEG', name: 'Spokane International Airport' },
    { code: 'GFK', name: 'Grand Forks International Airport' },
    { code: 'GPT', name: 'Gulfport-Biloxi International Airport' },
    { code: 'GRR', name: 'Gerald R. Ford International Airport' },
    { code: 'GSO', name: 'Piedmont Triad International Airport' },
    { code: 'GSP', name: 'Greenville-Spartanburg International Airport' },
    { code: 'HAR', name: 'Capital City Airport' },
    { code: 'HDN', name: 'Yampa Valley Airport' },
    { code: 'HFD', name: 'Hartford Brainard Airport' },
    { code: 'HHH', name: 'Hilton Head Airport' },
    { code: 'HOU', name: 'William P. Hobby Airport' },
    { code: 'HPN', name: 'Westchester County Airport' },
    { code: 'HRL', name: 'Valley International Airport' },
    { code: 'HSV', name: 'Huntsville International Airport' },
    { code: 'HTS', name: 'Tri-State Airport' },
    { code: 'HVN', name: 'Tweed New Haven Airport' },
    { code: 'IAD', name: 'Washington Dulles International Airport' },
    { code: 'IAG', name: 'Niagara Falls International Airport' },
    { code: 'IAH', name: 'George Bush Intercontinental Airport' },
    { code: 'ICT', name: 'Wichita Dwight D. Eisenhower National Airport' },
    { code: 'IDA', name: 'Idaho Falls Regional Airport' },
    { code: 'ILM', name: 'Wilmington International Airport' },
    { code: 'IND', name: 'Indianapolis International Airport' },
    { code: 'ISP', name: 'Long Island MacArthur Airport' },
    { code: 'JAC', name: 'Jackson Hole Airport' },
    { code: 'JAN', name: 'Jackson-Medgar Wiley Evers International Airport' },
    { code: 'JAX', name: 'Jacksonville International Airport' },
    { code: 'JFK', name: 'John F. Kennedy International Airport' },
    { code: 'JRB', name: 'Wall Street Heliport' },
    { code: 'LAN', name: 'Capital Region International Airport' },
    { code: 'LAS', name: 'Harry Reid International Airport' },
    { code: 'LAX', name: 'Los Angeles International Airport' },
    { code: 'LBB', name: 'Lubbock Preston Smith International Airport' },
    { code: 'LBE', name: 'Arnold Palmer Regional Airport' },
    { code: 'LCK', name: 'Rickenbacker International Airport' },
    { code: 'LEX', name: 'Blue Grass Airport' },
    { code: 'LGA', name: 'LaGuardia Airport' },
    { code: 'LGB', name: 'Long Beach Airport' },
    { code: 'LIT', name: 'Bill and Hillary Clinton National Airport' },
    { code: 'LNK', name: 'Lincoln Airport' },
    { code: 'MAF', name: 'Midland International Air and Space Port' },
    { code: 'MBS', name: 'MBS International Airport' },
    { code: 'MCI', name: 'Kansas City International Airport' },
    { code: 'MCO', name: 'Orlando International Airport' },
    { code: 'MDT', name: 'Harrisburg International Airport' },
    { code: 'MDW', name: 'Chicago Midway International Airport' },
    { code: 'MEM', name: 'Memphis International Airport' },
    { code: 'MFE', name: 'McAllen Miller International Airport' },
    { code: 'MFR', name: 'Rogue Valley International-Medford Airport' },
    { code: 'MGM', name: 'Montgomery Regional Airport' },
    { code: 'MHT', name: 'Manchester-Boston Regional Airport' },
    { code: 'MIA', name: 'Miami International Airport' },
    { code: 'MKC', name: 'Charles B. Wheeler Downtown Airport' },
    { code: 'MKE', name: 'Milwaukee Mitchell International Airport' },
    { code: 'MLB', name: 'Melbourne Orlando International Airport' },
    { code: 'MOB', name: 'Mobile Regional Airport' },
    { code: 'MOT', name: 'Minot International Airport' },
    { code: 'MRY', name: 'Monterey Regional Airport' },
    { code: 'MSN', name: 'Dane County Regional Airport' },
    { code: 'MSO', name: 'Missoula Montana Airport' },
    { code: 'MSP', name: 'Minneapolis−Saint Paul International Airport' },
    { code: 'MSY', name: 'Louis Armstrong New Orleans International Airport' },
    { code: 'MTJ', name: 'Montrose Regional Airport' },
    { code: 'MVY', name: 'Martha\'s Vineyard Airport' },
    { code: 'MYR', name: 'Myrtle Beach International Airport' },
    { code: 'NYC', name: 'New York City area airports' },
    { code: 'OAK', name: 'Oakland International Airport' },
    { code: 'OKC', name: 'Will Rogers World Airport' },
    { code: 'OMA', name: 'Eppley Airfield' },
    { code: 'ONT', name: 'Ontario International Airport' },
    { code: 'ORD', name: "Chicago O'Hare International Airport" },
    { code: 'ORF', name: 'Norfolk International Airport' },
    { code: 'ORH', name: 'Worcester Regional Airport' },
    { code: 'PAE', name: 'Snohomish County Airport' },
    { code: 'PBG', name: 'Plattsburgh International Airport' },
    { code: 'PBI', name: 'Palm Beach International Airport' },
    { code: 'PDX', name: 'Portland International Airport' },
    { code: 'PGD', name: 'Punta Gorda Airport' },
    { code: 'PHF', name: 'Newport News/Williamsburg International Airport' },
    { code: 'PHL', name: 'Philadelphia International Airport' },
    { code: 'PHX', name: 'Phoenix Sky Harbor International Airport' },
    { code: 'PIA', name: 'General Wayne A. Downing Peoria International Airport' },
    { code: 'PIE', name: 'St. Pete–Clearwater International Airport' },
    { code: 'PIT', name: 'Pittsburgh International Airport' },
    { code: 'PNS', name: 'Pensacola International Airport' },
    { code: 'PSC', name: 'Tri-Cities Airport' },
    { code: 'PSP', name: 'Palm Springs International Airport' },
    { code: 'PVD', name: 'Theodore Francis Green State Airport' },
    { code: 'PVU', name: 'Provo Municipal Airport' },
    { code: 'PWM', name: 'Portland International Jetport' },
    { code: 'RAP', name: 'Rapid City Regional Airport' },
    { code: 'RDM', name: 'Roberts Field' },
    { code: 'RDU', name: 'Raleigh-Durham International Airport' },
    { code: 'RFD', name: 'Chicago Rockford International Airport' },
    { code: 'RIC', name: 'Richmond International Airport' },
    { code: 'RNO', name: 'Reno/Tahoe International Airport' },
    { code: 'ROA', name: 'Roanoke-Blacksburg Regional Airport' },
    { code: 'ROC', name: 'Frederick Douglass Greater Rochester International Airport' },
    { code: 'RSW', name: 'Southwest Florida International Airport' },
    { code: 'SAC', name: 'Sacramento Executive Airport' },
    { code: 'SAN', name: 'San Diego International Airport' },
    { code: 'SAT', name: 'San Antonio International Airport' },
    { code: 'SAV', name: 'Savannah/Hilton Head International Airport' },
    { code: 'SBA', name: 'Santa Barbara Municipal Airport' },
    { code: 'SBN', name: 'South Bend International Airport' },
    { code: 'SDF', name: 'Louisville International Airport' },
    { code: 'SEA', name: 'Seattle-Tacoma International Airport' },
    { code: 'SFB', name: 'Orlando Sanford International Airport' },
    { code: 'SFO', name: 'San Francisco International Airport' },
    { code: 'SGF', name: 'Springfield-Branson National Airport' },
    { code: 'SHV', name: 'Shreveport Regional Airport' },
    { code: 'SJC', name: 'Norman Y. Mineta San Jose International Airport' },
    { code: 'SLC', name: 'Salt Lake City International Airport' },
    { code: 'SMF', name: 'Sacramento International Airport'}
  ];

  const mileageData = [
    { route: "FT. LAUDERDALE, FL - NEW YORK, NY", miles: 1072 },
    { route: "NEW YORK, NY - ORLANDO, FL", miles: 944 },
    { route: "CHICAGO, IL - NEW YORK, NY", miles: 728 },
    { route: "BOSTON, MA - NEW YORK, NY", miles: 185 },
    { route: "LOS ANGELES, CA - NEW YORK, NY", miles: 2469 },
    { route: "ATLANTA, GA - NEW YORK, NY", miles: 755 },
    { route: "NEW YORK, NY - WASHINGTON, DC", miles: 215 },
    { route: "DALLAS, TX - HOUSTON, TX", miles: 236 },
    { route: "NEW YORK, NY - SAN FRANCISCO, CA", miles: 2578 },
    { route: "LAS VEGAS, NV - LOS ANGELES, CA", miles: 236 },
    { route: "LOS ANGELES, CA - OAKLAND, CA", miles: 337 },
    { route: "NEW YORK, NY - WEST PALM BEACH, FL", miles: 1024 },
    { route: "CHICAGO, IL - LOS ANGELES, CA", miles: 1745 },
    { route: "NEW YORK, NY - TAMPA, FL", miles: 998 },
    { route: "LAS VEGAS, NV - NEW YORK, NY", miles: 2242 },
    { route: "MIAMI, FL - NEW YORK, NY", miles: 1093 },
    { route: "BOSTON, MA - WASHINGTON, DC", miles: 402 },
    { route: "DALLAS, TX - NEW YORK, NY", miles: 1383 },
    { route: "CHICAGO, IL - MINNEAPOLIS, MN", miles: 345 },
    { route: "ATLANTA, GA - CHICAGO, IL", miles: 605 },
    { route: "LOS ANGELES, CA - SAN FRANCISCO, CA", miles: 337 },
    { route: "LOS ANGELES, CA - PHOENIX, AZ", miles: 370 },
    { route: "CHICAGO, IL - DETROIT, MI", miles: 233 },
    { route: "ATLANTA, GA - WASHINGTON, DC", miles: 541 },
    { route: "CHICAGO, IL - LAS VEGAS, NV", miles: 1515 },
    { route: "LOS ANGELES, CA - SAN JOSE, CA", miles: 308 },
    { route: "CHICAGO, IL - ORLANDO, FL", miles: 989 },
    { route: "CHICAGO, IL - PHOENIX, AZ", miles: 1440 },
    { route: "CHICAGO, IL - DALLAS, TX", miles: 800 },
    { route: "LAS VEGAS, NV - PHOENIX, AZ", miles: 256 }
  ];

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filterAirports = (input, type) => {
    const filtered = airports.filter(airport => 
      airport.code.toLowerCase().includes(input.toLowerCase()) || 
      airport.name.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5); 

    if (type === 'origin') {
      setFilteredOrigins(filtered);
    } else {
      setFilteredDestinations(filtered);
    }
  };

  const filterCarriers = (input) => {
    const filtered = carrier.filter(c => 
      c.carrier.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
    setFilteredCarriers(filtered);
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));

    if (name === 'origin') {
      filterAirports(value, 'origin');
      setOriginDropdown(true);
    } else if (name === 'destination') {
      filterAirports(value, 'destination');
      setDestinationDropdown(true);
    } else if (name === 'carrier') {
      filterCarriers(value);
      setCarrierDropdown(true);
    }
  };

  const handleSelect = (type, value, code) => {
    setFormData(prev => ({
      ...prev,
      [type]: code
    }));
    
    if (type === 'origin') {
      setOriginDropdown(false);
    } else if (type === 'destination') {
      setDestinationDropdown(false);
    } else if (type === 'carrier') {
      setCarrierDropdown(false);
    }
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
      
      const processedData = data.map(prediction => {
        const date = new Date(prediction.date);
        const correctDayOfWeek = weekDays[date.getDay()];
        return {
          ...prediction,
          date: date,
          day: correctDayOfWeek 
        };
      });

      setPredictions(processedData);
    } catch (err) {
      setError('Error: ' + (err.message || 'Failed to fetch predictions'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictor-wrapper mt-6">
    <div className="row" style={{ display: 'flex', justifyContent: 'center'}}>
      <div className="col-md-2"></div>
      <div className="col-md-6">
        <div className="my-card">
          <div className="card-header">
            <h2 className="text-center">Flight Price Predictor</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="form-group position-relative">
                    <label>Origin Airport</label>
                    <input
                      type="text"
                      className="form-control"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      onFocus={() => filterAirports(formData.origin, 'origin')}
                      placeholder="Type to search airports..."
                      required
                    />
                    {originDropdown && filteredOrigins.length > 0 && (
                      <div className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                        {filteredOrigins.map((airport, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelect('origin', airport.name, airport.code)}
                            style={{ cursor: 'pointer' }}
                          >
                            <strong>{airport.code}</strong> - {airport.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="form-group position-relative">
                    <label>Destination Airport</label>
                    <input
                      type="text"
                      className="form-control"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      onFocus={() => filterAirports(formData.destination, 'destination')}
                      placeholder="Type to search airports..."
                      required
                    />
                    {destinationDropdown && filteredDestinations.length > 0 && (
                      <div className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                        {filteredDestinations.map((airport, index) => (
                          <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleSelect('destination', airport.name, airport.code)}
                            style={{ cursor: 'pointer' }}
                          >
                            <strong>{airport.code}</strong> - {airport.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-group position-relative">
                    <label>Carrier</label>
                    <input
                      type="text"
                      className="form-control"
                      name="carrier"
                      value={formData.carrier}
                      onChange={handleInputChange}
                      onFocus={() => filterCarriers(formData.carrier)}
                      placeholder="Type to search carriers..."
                      required
                    />
                    {carrierDropdown && filteredCarriers.length > 0 && (
                      <div className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                        {filteredCarriers.map((airline, index) => {
                          const [code, name] = airline.carrier.split('/');
                          return (
                            <div
                              key={index}
                              className="dropdown-item"
                              onClick={() => handleSelect('carrier', name, code)}
                              style={{ cursor: 'pointer' }}
                            >
                              <strong>{code}</strong> - {name}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
                  className="btn pred-button"
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
                          <td>{prediction.date.toLocaleDateString()}</td>
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

      <div className="col-md-4" style={{ paddingLeft: '80px', marginTop: '31px' }}>
          <div className="my-card">
            <div className="card-header">
              <h2 className="text-center">
                <a 
                  href="https://www.publicpurpose.com/ic-air500passr.htm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    position: 'relative'
                  }}
                  className="popular-routes-title"
                >
                  Popular Route Miles
                  <span style={{ 
                    fontSize: '1.0 em', 
                    marginLeft: '5px',
                    verticalAlign: 'top'
                  }}>↗</span>
                </a>
              </h2>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th className="text-right">Miles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mileageData.map((route, index) => (
                      <tr key={index}>
                        <td>{route.route}</td>
                        <td className="text-right">{route.miles.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPricePredictor;