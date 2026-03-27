import type { Airport } from '../lib/types';

export const airports: Airport[] = [
  { id: 'atl', code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', state: 'GA', lat: 33.6407, lng: -84.4277, checkpoints: [
    { id: 'atl-n', airportCode: 'ATL', name: 'North Security', terminal: 'Domestic', isPrecheck: false },
    { id: 'atl-s', airportCode: 'ATL', name: 'South Security', terminal: 'Domestic', isPrecheck: false },
    { id: 'atl-pc', airportCode: 'ATL', name: 'PreCheck — North', terminal: 'Domestic', isPrecheck: true },
  ]},
  { id: 'dfw', code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', state: 'TX', lat: 32.8998, lng: -97.0403, checkpoints: [
    { id: 'dfw-a', airportCode: 'DFW', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'dfw-b', airportCode: 'DFW', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'dfw-c', airportCode: 'DFW', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'dfw-d', airportCode: 'DFW', name: 'Terminal D', terminal: 'D', isPrecheck: false },
    { id: 'dfw-e', airportCode: 'DFW', name: 'Terminal E', terminal: 'E', isPrecheck: false },
    { id: 'dfw-pc', airportCode: 'DFW', name: 'PreCheck — Terminal D', terminal: 'D', isPrecheck: true },
  ]},
  { id: 'den', code: 'DEN', name: 'Denver International', city: 'Denver', state: 'CO', lat: 39.8561, lng: -104.6737, checkpoints: [
    { id: 'den-n', airportCode: 'DEN', name: 'North Security', terminal: 'Main', isPrecheck: false },
    { id: 'den-s', airportCode: 'DEN', name: 'South Security', terminal: 'Main', isPrecheck: false },
    { id: 'den-b', airportCode: 'DEN', name: 'Bridge Security', terminal: 'Bridge', isPrecheck: false },
    { id: 'den-pc', airportCode: 'DEN', name: 'PreCheck — North', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'ord', code: 'ORD', name: "O'Hare International", city: 'Chicago', state: 'IL', lat: 41.9742, lng: -87.9073, checkpoints: [
    { id: 'ord-1', airportCode: 'ORD', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'ord-2', airportCode: 'ORD', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'ord-3', airportCode: 'ORD', name: 'Terminal 3', terminal: '3', isPrecheck: false },
    { id: 'ord-5', airportCode: 'ORD', name: 'Terminal 5 (Intl)', terminal: '5', isPrecheck: false },
    { id: 'ord-pc', airportCode: 'ORD', name: 'PreCheck — Terminal 1', terminal: '1', isPrecheck: true },
  ]},
  { id: 'lax', code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', state: 'CA', lat: 33.9425, lng: -118.4081, checkpoints: [
    { id: 'lax-1', airportCode: 'LAX', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'lax-4', airportCode: 'LAX', name: 'Terminal 4', terminal: '4', isPrecheck: false },
    { id: 'lax-7', airportCode: 'LAX', name: 'Terminal 7', terminal: '7', isPrecheck: false },
    { id: 'lax-tb', airportCode: 'LAX', name: 'Tom Bradley Intl', terminal: 'TBIT', isPrecheck: false },
    { id: 'lax-pc', airportCode: 'LAX', name: 'PreCheck — Terminal 4', terminal: '4', isPrecheck: true },
  ]},
  { id: 'jfk', code: 'JFK', name: 'John F. Kennedy International', city: 'New York', state: 'NY', lat: 40.6413, lng: -73.7781, checkpoints: [
    { id: 'jfk-1', airportCode: 'JFK', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'jfk-4', airportCode: 'JFK', name: 'Terminal 4', terminal: '4', isPrecheck: false },
    { id: 'jfk-5', airportCode: 'JFK', name: 'Terminal 5', terminal: '5', isPrecheck: false },
    { id: 'jfk-8', airportCode: 'JFK', name: 'Terminal 8', terminal: '8', isPrecheck: false },
    { id: 'jfk-pc', airportCode: 'JFK', name: 'PreCheck — Terminal 4', terminal: '4', isPrecheck: true },
  ]},
  { id: 'sfo', code: 'SFO', name: 'San Francisco International', city: 'San Francisco', state: 'CA', lat: 37.6213, lng: -122.3790, checkpoints: [
    { id: 'sfo-1', airportCode: 'SFO', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'sfo-2', airportCode: 'SFO', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'sfo-3', airportCode: 'SFO', name: 'Terminal 3', terminal: '3', isPrecheck: false },
    { id: 'sfo-i', airportCode: 'SFO', name: 'International Terminal', terminal: 'Intl', isPrecheck: false },
    { id: 'sfo-pc', airportCode: 'SFO', name: 'PreCheck — Terminal 2', terminal: '2', isPrecheck: true },
  ]},
  { id: 'sea', code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', state: 'WA', lat: 47.4502, lng: -122.3088, checkpoints: [
    { id: 'sea-n', airportCode: 'SEA', name: 'North Checkpoint', terminal: 'N', isPrecheck: false },
    { id: 'sea-s', airportCode: 'SEA', name: 'South Checkpoint', terminal: 'S', isPrecheck: false },
    { id: 'sea-c', airportCode: 'SEA', name: 'Central Checkpoint', terminal: 'C', isPrecheck: false },
    { id: 'sea-pc', airportCode: 'SEA', name: 'PreCheck — Central', terminal: 'C', isPrecheck: true },
  ]},
  { id: 'las', code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', state: 'NV', lat: 36.0840, lng: -115.1537, checkpoints: [
    { id: 'las-1', airportCode: 'LAS', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'las-3', airportCode: 'LAS', name: 'Terminal 3', terminal: '3', isPrecheck: false },
    { id: 'las-pc', airportCode: 'LAS', name: 'PreCheck — Terminal 1', terminal: '1', isPrecheck: true },
  ]},
  { id: 'mco', code: 'MCO', name: 'Orlando International', city: 'Orlando', state: 'FL', lat: 28.4312, lng: -81.3081, checkpoints: [
    { id: 'mco-a', airportCode: 'MCO', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'mco-b', airportCode: 'MCO', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'mco-c', airportCode: 'MCO', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'mco-pc', airportCode: 'MCO', name: 'PreCheck — Terminal A', terminal: 'A', isPrecheck: true },
  ]},
  { id: 'clt', code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', state: 'NC', lat: 35.2140, lng: -80.9431, checkpoints: [
    { id: 'clt-a', airportCode: 'CLT', name: 'Checkpoint A', terminal: 'Main', isPrecheck: false },
    { id: 'clt-b', airportCode: 'CLT', name: 'Checkpoint B', terminal: 'Main', isPrecheck: false },
    { id: 'clt-pc', airportCode: 'CLT', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'ewr', code: 'EWR', name: 'Newark Liberty International', city: 'Newark', state: 'NJ', lat: 40.6895, lng: -74.1745, checkpoints: [
    { id: 'ewr-a', airportCode: 'EWR', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'ewr-b', airportCode: 'EWR', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'ewr-c', airportCode: 'EWR', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'ewr-pc', airportCode: 'EWR', name: 'PreCheck — Terminal C', terminal: 'C', isPrecheck: true },
  ]},
  { id: 'phx', code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', state: 'AZ', lat: 33.4373, lng: -112.0078, checkpoints: [
    { id: 'phx-3', airportCode: 'PHX', name: 'Terminal 3', terminal: '3', isPrecheck: false },
    { id: 'phx-4', airportCode: 'PHX', name: 'Terminal 4', terminal: '4', isPrecheck: false },
    { id: 'phx-pc', airportCode: 'PHX', name: 'PreCheck — Terminal 4', terminal: '4', isPrecheck: true },
  ]},
  { id: 'iah', code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', state: 'TX', lat: 29.9902, lng: -95.3368, checkpoints: [
    { id: 'iah-a', airportCode: 'IAH', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'iah-b', airportCode: 'IAH', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'iah-c', airportCode: 'IAH', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'iah-d', airportCode: 'IAH', name: 'Terminal D (Intl)', terminal: 'D', isPrecheck: false },
    { id: 'iah-e', airportCode: 'IAH', name: 'Terminal E', terminal: 'E', isPrecheck: false },
    { id: 'iah-pc', airportCode: 'IAH', name: 'PreCheck — Terminal C', terminal: 'C', isPrecheck: true },
  ]},
  { id: 'mia', code: 'MIA', name: 'Miami International', city: 'Miami', state: 'FL', lat: 25.7959, lng: -80.2870, checkpoints: [
    { id: 'mia-n', airportCode: 'MIA', name: 'North Terminal', terminal: 'North', isPrecheck: false },
    { id: 'mia-c', airportCode: 'MIA', name: 'Central Terminal', terminal: 'Central', isPrecheck: false },
    { id: 'mia-s', airportCode: 'MIA', name: 'South Terminal', terminal: 'South', isPrecheck: false },
    { id: 'mia-pc', airportCode: 'MIA', name: 'PreCheck — Central', terminal: 'Central', isPrecheck: true },
  ]},
  { id: 'bos', code: 'BOS', name: 'Boston Logan International', city: 'Boston', state: 'MA', lat: 42.3656, lng: -71.0096, checkpoints: [
    { id: 'bos-a', airportCode: 'BOS', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'bos-b', airportCode: 'BOS', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'bos-c', airportCode: 'BOS', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'bos-e', airportCode: 'BOS', name: 'Terminal E (Intl)', terminal: 'E', isPrecheck: false },
    { id: 'bos-pc', airportCode: 'BOS', name: 'PreCheck — Terminal A', terminal: 'A', isPrecheck: true },
  ]},
  { id: 'msp', code: 'MSP', name: 'Minneapolis-St Paul International', city: 'Minneapolis', state: 'MN', lat: 44.8848, lng: -93.2223, checkpoints: [
    { id: 'msp-1', airportCode: 'MSP', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'msp-2', airportCode: 'MSP', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'msp-pc', airportCode: 'MSP', name: 'PreCheck — Terminal 1', terminal: '1', isPrecheck: true },
  ]},
  { id: 'fll', code: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Fort Lauderdale', state: 'FL', lat: 26.0742, lng: -80.1506, checkpoints: [
    { id: 'fll-1', airportCode: 'FLL', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'fll-2', airportCode: 'FLL', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'fll-3', airportCode: 'FLL', name: 'Terminal 3', terminal: '3', isPrecheck: false },
    { id: 'fll-4', airportCode: 'FLL', name: 'Terminal 4', terminal: '4', isPrecheck: false },
    { id: 'fll-pc', airportCode: 'FLL', name: 'PreCheck — Terminal 1', terminal: '1', isPrecheck: true },
  ]},
  { id: 'dtw', code: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', state: 'MI', lat: 42.2124, lng: -83.3534, checkpoints: [
    { id: 'dtw-m', airportCode: 'DTW', name: 'McNamara Terminal', terminal: 'McNamara', isPrecheck: false },
    { id: 'dtw-n', airportCode: 'DTW', name: 'North Terminal', terminal: 'North', isPrecheck: false },
    { id: 'dtw-pc', airportCode: 'DTW', name: 'PreCheck — McNamara', terminal: 'McNamara', isPrecheck: true },
  ]},
  { id: 'phl', code: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', state: 'PA', lat: 39.8744, lng: -75.2424, checkpoints: [
    { id: 'phl-ab', airportCode: 'PHL', name: 'Terminals A/B', terminal: 'A/B', isPrecheck: false },
    { id: 'phl-cd', airportCode: 'PHL', name: 'Terminals C/D', terminal: 'C/D', isPrecheck: false },
    { id: 'phl-ef', airportCode: 'PHL', name: 'Terminals E/F', terminal: 'E/F', isPrecheck: false },
    { id: 'phl-pc', airportCode: 'PHL', name: 'PreCheck — Terminal D', terminal: 'C/D', isPrecheck: true },
  ]},
  { id: 'lga', code: 'LGA', name: 'LaGuardia', city: 'New York', state: 'NY', lat: 40.7769, lng: -73.8740, checkpoints: [
    { id: 'lga-a', airportCode: 'LGA', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'lga-b', airportCode: 'LGA', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'lga-c', airportCode: 'LGA', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'lga-pc', airportCode: 'LGA', name: 'PreCheck — Terminal B', terminal: 'B', isPrecheck: true },
  ]},
  { id: 'bwi', code: 'BWI', name: 'Baltimore-Washington International', city: 'Baltimore', state: 'MD', lat: 39.1754, lng: -76.6684, checkpoints: [
    { id: 'bwi-m', airportCode: 'BWI', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'bwi-pc', airportCode: 'BWI', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'slc', code: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', state: 'UT', lat: 40.7899, lng: -111.9791, checkpoints: [
    { id: 'slc-m', airportCode: 'SLC', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'slc-pc', airportCode: 'SLC', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'dca', code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington', state: 'DC', lat: 38.8512, lng: -77.0402, checkpoints: [
    { id: 'dca-a', airportCode: 'DCA', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'dca-bc', airportCode: 'DCA', name: 'Terminal B/C', terminal: 'B/C', isPrecheck: false },
    { id: 'dca-pc', airportCode: 'DCA', name: 'PreCheck — Terminal B/C', terminal: 'B/C', isPrecheck: true },
  ]},
  { id: 'san', code: 'SAN', name: 'San Diego International', city: 'San Diego', state: 'CA', lat: 32.7338, lng: -117.1933, checkpoints: [
    { id: 'san-1', airportCode: 'SAN', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'san-2', airportCode: 'SAN', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'san-pc', airportCode: 'SAN', name: 'PreCheck — Terminal 2', terminal: '2', isPrecheck: true },
  ]},
  { id: 'iad', code: 'IAD', name: 'Washington Dulles International', city: 'Washington', state: 'DC', lat: 38.9531, lng: -77.4565, checkpoints: [
    { id: 'iad-m', airportCode: 'IAD', name: 'Main Terminal', terminal: 'Main', isPrecheck: false },
    { id: 'iad-pc', airportCode: 'IAD', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'tpa', code: 'TPA', name: 'Tampa International', city: 'Tampa', state: 'FL', lat: 27.9755, lng: -82.5332, checkpoints: [
    { id: 'tpa-m', airportCode: 'TPA', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'tpa-pc', airportCode: 'TPA', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'aus', code: 'AUS', name: 'Austin-Bergstrom International', city: 'Austin', state: 'TX', lat: 30.1975, lng: -97.6664, checkpoints: [
    { id: 'aus-m', airportCode: 'AUS', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'aus-pc', airportCode: 'AUS', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'hnl', code: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', state: 'HI', lat: 21.3187, lng: -157.9225, checkpoints: [
    { id: 'hnl-1', airportCode: 'HNL', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'hnl-2', airportCode: 'HNL', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'hnl-pc', airportCode: 'HNL', name: 'PreCheck', terminal: '1', isPrecheck: true },
  ]},
  { id: 'mdw', code: 'MDW', name: 'Chicago Midway International', city: 'Chicago', state: 'IL', lat: 41.7868, lng: -87.7522, checkpoints: [
    { id: 'mdw-m', airportCode: 'MDW', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'mdw-pc', airportCode: 'MDW', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'bna', code: 'BNA', name: 'Nashville International', city: 'Nashville', state: 'TN', lat: 36.1263, lng: -86.6774, checkpoints: [
    { id: 'bna-m', airportCode: 'BNA', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'bna-pc', airportCode: 'BNA', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'dal', code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', state: 'TX', lat: 32.8471, lng: -96.8518, checkpoints: [
    { id: 'dal-m', airportCode: 'DAL', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'dal-pc', airportCode: 'DAL', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'stl', code: 'STL', name: 'St. Louis Lambert International', city: 'St. Louis', state: 'MO', lat: 38.7487, lng: -90.3700, checkpoints: [
    { id: 'stl-1', airportCode: 'STL', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'stl-2', airportCode: 'STL', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'stl-pc', airportCode: 'STL', name: 'PreCheck — Terminal 1', terminal: '1', isPrecheck: true },
  ]},
  { id: 'hou', code: 'HOU', name: 'William P. Hobby', city: 'Houston', state: 'TX', lat: 30.0040, lng: -95.3414, checkpoints: [
    { id: 'hou-m', airportCode: 'HOU', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'hou-pc', airportCode: 'HOU', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'rdu', code: 'RDU', name: 'Raleigh-Durham International', city: 'Raleigh', state: 'NC', lat: 35.8776, lng: -78.7875, checkpoints: [
    { id: 'rdu-1', airportCode: 'RDU', name: 'Terminal 1', terminal: '1', isPrecheck: false },
    { id: 'rdu-2', airportCode: 'RDU', name: 'Terminal 2', terminal: '2', isPrecheck: false },
    { id: 'rdu-pc', airportCode: 'RDU', name: 'PreCheck — Terminal 2', terminal: '2', isPrecheck: true },
  ]},
  { id: 'sjc', code: 'SJC', name: 'San Jose International', city: 'San Jose', state: 'CA', lat: 37.3639, lng: -121.9289, checkpoints: [
    { id: 'sjc-a', airportCode: 'SJC', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'sjc-b', airportCode: 'SJC', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'sjc-pc', airportCode: 'SJC', name: 'PreCheck — Terminal B', terminal: 'B', isPrecheck: true },
  ]},
  { id: 'smf', code: 'SMF', name: 'Sacramento International', city: 'Sacramento', state: 'CA', lat: 38.6954, lng: -121.5908, checkpoints: [
    { id: 'smf-a', airportCode: 'SMF', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'smf-b', airportCode: 'SMF', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'smf-pc', airportCode: 'SMF', name: 'PreCheck — Terminal B', terminal: 'B', isPrecheck: true },
  ]},
  { id: 'ind', code: 'IND', name: 'Indianapolis International', city: 'Indianapolis', state: 'IN', lat: 39.7173, lng: -86.2944, checkpoints: [
    { id: 'ind-m', airportCode: 'IND', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'ind-pc', airportCode: 'IND', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'mci', code: 'MCI', name: 'Kansas City International', city: 'Kansas City', state: 'MO', lat: 39.2976, lng: -94.7139, checkpoints: [
    { id: 'mci-m', airportCode: 'MCI', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'mci-pc', airportCode: 'MCI', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'cle', code: 'CLE', name: 'Cleveland Hopkins International', city: 'Cleveland', state: 'OH', lat: 41.4058, lng: -81.8540, checkpoints: [
    { id: 'cle-m', airportCode: 'CLE', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'cle-pc', airportCode: 'CLE', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'sat', code: 'SAT', name: 'San Antonio International', city: 'San Antonio', state: 'TX', lat: 29.5337, lng: -98.4698, checkpoints: [
    { id: 'sat-a', airportCode: 'SAT', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'sat-b', airportCode: 'SAT', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'sat-pc', airportCode: 'SAT', name: 'PreCheck — Terminal A', terminal: 'A', isPrecheck: true },
  ]},
  { id: 'pit', code: 'PIT', name: 'Pittsburgh International', city: 'Pittsburgh', state: 'PA', lat: 40.4915, lng: -80.2329, checkpoints: [
    { id: 'pit-m', airportCode: 'PIT', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'pit-pc', airportCode: 'PIT', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'pdx', code: 'PDX', name: 'Portland International', city: 'Portland', state: 'OR', lat: 45.5898, lng: -122.5951, checkpoints: [
    { id: 'pdx-m', airportCode: 'PDX', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'pdx-pc', airportCode: 'PDX', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'msy', code: 'MSY', name: 'Louis Armstrong New Orleans International', city: 'New Orleans', state: 'LA', lat: 29.9934, lng: -90.2580, checkpoints: [
    { id: 'msy-m', airportCode: 'MSY', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'msy-pc', airportCode: 'MSY', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'rsw', code: 'RSW', name: 'Southwest Florida International', city: 'Fort Myers', state: 'FL', lat: 26.5362, lng: -81.7553, checkpoints: [
    { id: 'rsw-m', airportCode: 'RSW', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'rsw-pc', airportCode: 'RSW', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'cmh', code: 'CMH', name: 'John Glenn Columbus International', city: 'Columbus', state: 'OH', lat: 39.9980, lng: -82.8919, checkpoints: [
    { id: 'cmh-m', airportCode: 'CMH', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'cmh-pc', airportCode: 'CMH', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
  { id: 'sna', code: 'SNA', name: 'John Wayne (Orange County)', city: 'Santa Ana', state: 'CA', lat: 33.6762, lng: -117.8674, checkpoints: [
    { id: 'sna-a', airportCode: 'SNA', name: 'Terminal A', terminal: 'A', isPrecheck: false },
    { id: 'sna-b', airportCode: 'SNA', name: 'Terminal B', terminal: 'B', isPrecheck: false },
    { id: 'sna-c', airportCode: 'SNA', name: 'Terminal C', terminal: 'C', isPrecheck: false },
    { id: 'sna-pc', airportCode: 'SNA', name: 'PreCheck — Terminal B', terminal: 'B', isPrecheck: true },
  ]},
  { id: 'buf', code: 'BUF', name: 'Buffalo Niagara International', city: 'Buffalo', state: 'NY', lat: 42.9405, lng: -78.7322, checkpoints: [
    { id: 'buf-m', airportCode: 'BUF', name: 'Main Checkpoint', terminal: 'Main', isPrecheck: false },
    { id: 'buf-pc', airportCode: 'BUF', name: 'PreCheck', terminal: 'Main', isPrecheck: true },
  ]},
];

export function getAirport(code: string): Airport | undefined {
  return airports.find(a => a.code.toLowerCase() === code.toLowerCase());
}

export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase().trim();
  if (!q) return airports;
  return airports.filter(a =>
    a.code.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.state.toLowerCase().includes(q)
  );
}
