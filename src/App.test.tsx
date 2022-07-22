import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

//components
import Home from './components/Home';
import ParkingSpace from './components/ParkingSpace';

const render = (component: any) => rtlRender(
  <MemoryRouter>
    {component}
  </MemoryRouter>
)

const renderHome = () => render(<Home />);
const renderParkingSpace = () => render(<ParkingSpace />)

test('Home heading', () => {
  let { getByTestId } = renderHome();
  const HomeElement = getByTestId('home-heading')
  expect(HomeElement).toBeInTheDocument();
  expect(HomeElement).toHaveTextContent("Parking App");
});
test('submit-button', () => {
  let { getByTestId } = renderHome();
  const HomeElement = getByTestId('submit-btn')
  expect(HomeElement).toBeInTheDocument();
  expect(HomeElement).toHaveTextContent("Submit");
});

test('Parking heading', () => {
  let { getByTestId } = renderParkingSpace();
  const HomeElement = getByTestId('park-heading')
  expect(HomeElement).toBeInTheDocument();
  expect(HomeElement).toHaveTextContent("Parking Space");
});

test('Parking Register Car', () => {
  let { getByTestId } = renderParkingSpace();
  const HomeElement = getByTestId('reg-btn')
  expect(HomeElement).toBeInTheDocument();
  expect(HomeElement).toHaveTextContent("Car registration");
});