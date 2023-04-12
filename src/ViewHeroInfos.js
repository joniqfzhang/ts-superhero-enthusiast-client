import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Item, Button, Accordion, Icon, Message } from 'semantic-ui-react';

const QUERY_HEROINFOS_BY_HEROID = gql`
    query GetHeroinfosByHeroId($heroid: Int!) {
        getHeroinfosByHeroId(heroid: $heroid) { 
            # to list all items that should be in response
            _id
            heroid
            name
            powerstats {
                combat
                strength
                intelligence
                durability
                speed
                power
            }
            image {
                url
            }
        }
    }
`;
const DELETE_HEROINFO_BYID_MUTATION = gql`
    mutation DeleteHeroinfoByHeroid($heroid: Int!) {
        deleteHeroinfoByHeroid(heroid: $heroid) { 
            # to list all items that should be in response
            _id
            heroid
            name
            powerstats {
                combat
                strength
                intelligence
                durability
                speed
                power
            }
            image {
                url
            }
        }
    }
`;

const ViewHeroInfos = ({ hero }) => {
    // console.log('ViewHeroInfos hero.id', hero.id);
    const [toggleActive, setToggleActive] = useState(false);
    const [deleteHeroinfo] = useMutation(DELETE_HEROINFO_BYID_MUTATION);
    const [getHeroinfos, { called, loading, error, data, refetch }] = useLazyQuery(QUERY_HEROINFOS_BY_HEROID, {
        variables: {
            heroid: +hero.id
        },
        // fetchPolicy: 'network-only'
    });

    if (called && loading) return null;
    if (error) return `Error! ${error}`;
    if (data) {
        console.log('ViewHeroInfos data', data);
    }

    const handleAccordionClick = (event) => {
        // console.log('toggleActive', toggleActive);
        setToggleActive(!toggleActive);
        getHeroinfos();
    };

    const handleDeleteHeroInfo = (event) => {
        // console.log('event', event);
        deleteHeroinfo({
            variables: {
                heroid: +hero.id
            },
            onCompleted: (data) => {
                console.log('ViewHeroInfos data', data);
            },
        });
    };

    return (
        <div >
            <Accordion >
                <Accordion.Title
                    index={0}
                    active={toggleActive}
                    onClick={() => handleAccordionClick()}
                >
                    <Icon name='dropdown' />
                    <span><b style={{ fontSize: '1.1rem' }}>View your saved heroinfo of id - name : {hero.id} - {hero.name} </b></span>

                </Accordion.Title>
                <Accordion.Content active={toggleActive}>
                    <Item.Group >
                        {data && data.getHeroinfosByHeroId && data.getHeroinfosByHeroId.image && data.getHeroinfosByHeroId.image.url &&
                            <Item >
                                <Item.Image size='tiny' src={data?.getHeroinfosByHeroId.image.url} />
                                <Item.Content>
                                    <Item.Header as='a'>Hero Image</Item.Header>
                                    {/* <Item.Meta>{data.getHeroinfosByHeroId.powerstats.combat} Hero Image </Item.Meta> */}
                                    <Item.Description>
                                        <p> url : {data?.getHeroinfosByHeroId.image.url}</p>
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        }
                        {data && data.getHeroinfosByHeroId && data.getHeroinfosByHeroId.powerstats &&
                            <Item >
                                {/* <Item.Image size='tiny' src={data?.getHeroinfosByHeroId.image.url} /> */}
                                <Item.Content>
                                    <Item.Header as='a'>Hero Powerstats </Item.Header>
                                    {/* <Item.Meta> Hero Powerstats </Item.Meta> */}
                                    <Item.Description>
                                    <Message compact>
                                            <Message.Header>combat :</Message.Header>
                                            <p>{data.getHeroinfosByHeroId.powerstats.combat}</p>
                                        </Message>
                                        <Message compact>
                                            <Message.Header>durability :</Message.Header>
                                            {data.getHeroinfosByHeroId.powerstats.durability}
                                        </Message>
                                        <Message compact>
                                            <Message.Header>intelligence :</Message.Header>
                                            <p>{data.getHeroinfosByHeroId.powerstats.intelligence}</p>
                                        </Message>
                                        <Message compact>
                                            <Message.Header>power :</Message.Header>
                                            <p>{data.getHeroinfosByHeroId.powerstats.power}</p>
                                        </Message>
                                        <Message compact>
                                            <Message.Header>speed :</Message.Header>
                                            <p>{data.getHeroinfosByHeroId.powerstats.speed}</p>
                                        </Message>
                                        <Message compact>
                                            <Message.Header>strength :</Message.Header>
                                            <p>{data.getHeroinfosByHeroId.powerstats.strength}</p>
                                        </Message>
                                        {/*  */}
                                    </Item.Description>

                                    <Button type='button' style={{ className: 'ui button' }}
                                        onClick={() => handleDeleteHeroInfo()} >Delete Heroinfo</Button>
                                    <Button type='button' style={{ className: 'ui button' }}
                                        onClick={() => refetch()} >Synchronize Heroinfo</Button>

                                    <Item.Extra>Additional Details:
                                        <li>Click Delete Heroinfo button to delete your saved heroinfo</li>
                                        <li>Click Refresh Heroinfo button to syncnize your saved heroinfo</li>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        }
                        {data?.getHeroinfosByHeroId === null &&
                            <Item >
                                <Item.Content>
                                    <Item.Header as='a'>Hero not saved</Item.Header>
                                    {/* <Item.Meta> Hero Image </Item.Meta> */}
                                    <Item.Description>
                                        <p> Save the selected hero if you need.</p>
                                    </Item.Description>
                                    <div>
                                        <Button type='button' onClick={() => refetch()} >Refresh Heroinfo</Button>
                                    </div>
                                    <Item.Extra>Additional Details:
                                        <li>Click Refresh Heroinfo button to syncnize your saved heroinfo</li>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        }
                    </Item.Group>
                </Accordion.Content>
            </Accordion>
            {error && <h1> {error.message}</h1>}
        </div>
    );
};

export default ViewHeroInfos;
