import React from 'react';


import Dashboard from './components/Dashboard';
import './App.css';


const App = () => {
  return (
    <>
      <div className="wrapper">
        <header>
          Jam Vibe App
        </header>
        <article>
          <Dashboard />
        </article>
        <aside>
          <ul>
            <li>Home</li>
          </ul>
        </aside>
        <footer>
          Made with
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          by Jojo
        </footer>
      </div>
    </>
  );
}

export default App;
