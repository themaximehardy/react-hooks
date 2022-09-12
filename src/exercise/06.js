// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon';
import {ErrorBoundary} from 'react-error-boundary';

// class ErrorBoundary extends React.Component {
//   state = {error: null};
//   static getDerivedStateFromError(error) {
//     return {error};
//   }
//   render() {
//     const {error} = this.state;
//     if (error) {
//       return <this.props.FallbackComponent error={error} />;
//     }

//     return this.props.children;
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: pokemonName ? 'pending' : 'idle',
    error: null,
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({pokemon: null, status: 'pending', error: null});
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon: pokemon, status: 'resolved'});
      })
      .catch(error => {
        setState({status: 'rejected', error: error});
      });
  }, [pokemonName]);

  const {pokemon, status, error} = state;

  const Error = (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error && error.message}</pre>
    </div>
  );

  switch (status) {
    case 'idle':
      return 'Submit a pokemon';
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />;
    case 'rejected':
      // return Error;
      throw error;
    default:
      break;
  }

  throw new Error('This should be impossible');
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
