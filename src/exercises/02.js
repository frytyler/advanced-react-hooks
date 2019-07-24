// useReducer: HTTP requests

import React from 'react'
import fetchPokemon from '../fetch-pokemon'

const TYPES = {
  LOADING: 'LOADING',
  FETCHED: 'FETCHED',
  ERROR: 'ERROR',
}

// 🐨 define your pokemonReducer here.
// 💰 Might I suggest the following action types:
//   LOADING
//   LOADED
//   ERROR
// 🦉 it's a good idea to add a default case handler that throws an error if
// an unsupported action type is supplied. That way you avoid typo issues!

// function useAsync(asyncCallback, dependencies = []) {
//   React.useEffect(() => {
//     const result = async function() {
//       return await asyncCallback()
//     }
//     result()
//   }, dependencies)
// }

function reducer(previousState, action) {
  switch (action.type) {
    case TYPES.LOADING:
      return {
        ...previousState,
        loading: true,
        errror: null,
        pokemon: null,
      }
    case TYPES.FETCHED:
      return {
        ...previousState,
        loading: false,
        errror: null,
        pokemon: action.payload.pokemon,
      }
    case TYPES.ERROR:
      return {
        ...previousState,
        loading: false,
        errror: action.payload.error,
        pokemon: null,
      }
    default:
      throw new Error(`This type is not supported: ${action.type}`)
  }
}

function PokemonInfo({pokemonName}) {
  const [{loading, error, pokemon}, dispatch] = React.useReducer(reducer, {
    loading: false,
    pokemon: null,
    error: null,
  })
  // 🐨 add a React.useReducer right here.
  // 💰 your initial state could be something like: {pokemon: null, loading: false, error: null}

  // 💣 destroy all three of these useStates
  // const [pokemon, setPokemon] = React.useState(null)
  // const [loading, setLoading] = React.useState(false)
  // const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    // 🐨 dispatch a LOADING action here
    // 💣 remove all these sets
    dispatch({type: TYPES.LOADING})
    // setLoading(true)
    // setError(null)
    // setPokemon(null)

    // const pokemon = useAsync(() => {
    //   if (!pokemonName) return Promise.resolve(null)
    //   return fetchPokemon(pokemonName)
    // }, [pokemonName])

    fetchPokemon(pokemonName).then(
      pokemon => {
        // 🐨 dispatch a LOADED action here
        // 💰 you can pass the pokemon as part of the action you dispatch: dispatch({type: 'LOADED', pokemon})
        // 💣 remove all these sets
        dispatch({type: TYPES.FETCHED, payload: {pokemon}})
        // setLoading(false)
        // setError(null)
        // setPokemon(pokemon)
      },
      error => {
        dispatch({type: TYPES.ERROR, payload: {error}})
        // 🐨 dispatch an ERROR action here
        // 💣 remove all these sets
        // setLoading(false)
        // setError(error)
        // setPokemon(null)
      },
    )
  }, [pokemonName])

  return (
    <div
      style={{
        height: 300,
        width: 300,
        overflow: 'scroll',
        backgroundColor: '#eee',
        borderRadius: 4,
        padding: 10,
      }}
    >
      {loading ? (
        '...'
      ) : error ? (
        'ERROR (check your developer tools network tab)'
      ) : pokemonName ? (
        <pre>{JSON.stringify(pokemon || 'Unknown', null, 2)}</pre>
      ) : (
        'Submit a pokemon'
      )}
    </div>
  )
}

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function InvisibleButton(props) {
  return (
    <button
      type="button"
      style={{
        border: 'none',
        padding: 'inherit',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        cursor: 'pointer',
        fontWeight: 'inherit',
      }}
      {...props}
    />
  )
}

function Usage() {
  const [{submittedPokemon, pokemonName}, setState] = React.useReducer(
    (state, action) => ({...state, ...action}),
    {submittedPokemon: '', pokemonName: ''},
  )

  function handleChange(e) {
    setState({pokemonName: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault()
    setState({submittedPokemon: pokemonName.toLowerCase()})
  }

  function handleSelect(pokemonName) {
    setState({pokemonName, submittedPokemon: pokemonName})
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <label htmlFor="pokemonName-input">Pokemon Name</label>
        <small>
          Try{' '}
          <InvisibleButton onClick={() => handleSelect('pikachu')}>
            "pikachu"
          </InvisibleButton>
          {', '}
          <InvisibleButton onClick={() => handleSelect('charizard')}>
            "charizard"
          </InvisibleButton>
          {', or '}
          <InvisibleButton onClick={() => handleSelect('mew')}>
            "mew"
          </InvisibleButton>
        </small>
        <div>
          <input
            id="pokemonName-input"
            name="pokemonName"
            value={pokemonName}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </div>
      </form>
      <hr />
      <div style={{display: 'flex'}}>
        <div style={{marginLeft: 10}} data-testid="pokemon-display">
          <PokemonInfo pokemonName={submittedPokemon} />
        </div>
      </div>
    </div>
  )
}
Usage.title = 'useReducer: HTTP requests'

export default Usage
