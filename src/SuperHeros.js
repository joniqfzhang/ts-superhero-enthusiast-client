import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import ViewSuperHeroDetails from './ViewSuperHeroDetails';
import { Button, Input } from 'semantic-ui-react';
import { useDebounce } from 'use-debounce';

const QUERY_SUPERHERO_BYNAME = gql`
    query GetSuperHerosByName($input: GetSuperHeroNameInput!) {
        getSuperHeroByName(input: $input) {
            id
            name
            powerstats {
                intelligence
                strength
                speed
                durability
                power
                combat
            }
            biography{
                full_name
                alter_egos
                aliases
                place_of_birth
                first_appearance
                publisher
                aliases
            }
            appearance{
                gender
                race
                height
                weight
                eye_color
                hair_color
            }
            connections{
                group_affiliation
            }
            image{
                url
            }
        }
    } 

`;

function SuperHeros() {
    const token = process.env.REACT_APP_ACCESS_TOKEN;
    const [name, setName] = useState("");
    const [searchFucus, setSearchFucus] = useState(true);
    const [value] = useDebounce(name, 1000);
    const [searchSuperHeroName, { called, loading, data, error }] =
        useLazyQuery(QUERY_SUPERHERO_BYNAME, {
            variables: {
                input: {
                    token,
                    name: value
                }
            }
        });


    if (called && loading) {
        return <h1>data is loading...</h1>;
    }
    if (error) {
        console.log('SuperHeros error', error)
        // return `Error! ${error}`;
    }
    if (data) {
        console.log('SuperHeros data', data);
    }

    return (
        <div>
            <h1> SuperHeros by name </h1>

            <Input  icon={{ name: 'search', circular: true, link: true }} 
                focus={searchFucus}
                type="text"
                // onChange={(event) => { setName(value)}}
                onChange={(event) => setName(event.target.value)}
                placeholder="Search superHero name..."
            />

            <p>Actual value: {name}</p>
            <p>Debounce value: {value}</p>
            <Button onClick={() => { searchSuperHeroName(); setSearchFucus(false)}}>Search</Button>

            <div>
                {data && (
                    data?.getSuperHeroByName.map((hero) => {
                        return (
                            <div key={hero.id}>
                                <h2>
                                    hero id: {hero.id} -
                                    hero name: {hero.name}
                                </h2>
                                <div>
                                    <h4>hero porerstates and image </h4>
                                </div>
                                <div>
                                    <ViewSuperHeroDetails hero={hero} />
                                </div>
                            </div>
                        );
                    }))
                }
                {error && (<><h1> {error.message} </h1> <h3>Try to type in valid superHero name, eg: batman</h3></>)}
            </div>
        </div>
    );
}

export default SuperHeros;