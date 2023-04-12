import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Form, Button, Image, Segment } from 'semantic-ui-react';
import ViewHeroInfos from './ViewHeroInfos';

const UPSERT_HEROINFO_MUTATION = gql`
    mutation UpsertHeroinfoByheroid($input: CreateHeroinfoInput!) {
        # upsertHeroinfoByheroid should match back-end
        upsertHeroinfoByheroid(input: $input) { 
            # to list all items that should be in response
            _id
            heroid
            token
            name
            powerstats {
                intelligence
                strength
                speed
                durability
                power
                combat
            }
            image {
                url
            }
        }
    }
`;

const ViewSuperHeroDetails = ({ hero }) => {
    const token = process.env.REACT_APP_ACCESS_TOKEN;
    const [toggleView, setToggleView] = useState(true);
    const [imageSize, setImageSize] = useState('small');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [upsertHeroinfo] = useMutation(UPSERT_HEROINFO_MUTATION);
    // const [upsertHeroinfo, { loading, data, error }] = useMutation(UPSERT_HEROINFO_MUTATION);

    // if (loading) {
    //     return <h1>data is loading...</h1>;
    // }
    // if (error) {
    //     console.log('error', error);
    // }
    // if (data) {
    //     console.log('ViewSuperHeroDetails data', data);
    // }

    const viewDetailshandler = (hero) => {
        setToggleView(!toggleView);
        // console.log(toggleView, hero);
    };

    const changeImageSize = () => {
        if (imageSize === 'small') {
            setImageSize('medium');
        } else {
            setImageSize('small');
        }
    };

    const onSubmit = (data) => {
        // console.log(data);
        const powerstats = { ...data };
        delete powerstats.image;

        const heroSaved = {
            heroid: hero.id,
            token,
            name: hero.name,
            powerstats,
            // image: data.image -> error:
            // Variable "$input" got invalid value 
            // "https://www.superherodb.com/pictures2/portraits/10/100/637.jpg" at "input.image"; 
            // Expected type "imageInput" to be an object.
            image: {
                url: data.image
            },
        };

        upsertHeroinfo({
            variables: {
                input: heroSaved
            },
            onCompleted: (data) => {
                console.log('upsertHeroinfo onCompleted', data);
            },
        });

    };

    if (toggleView) {
        return (
            <Button key={hero.id} onClick={(event) => viewDetailshandler(hero)}>
                On view powerstats and image for {hero.name}
            </Button>
        );
    }
    if (!toggleView) {
        return (
            <>
                <Button onClick={(event) => viewDetailshandler(hero)}>
                    Off view powerstats and image for {hero.name}
                </Button>
                <div>
                    <Segment inverted>
                        <Form onSubmit={handleSubmit(onSubmit)} inverted>
                            <Form.Group widths='equal'>
                                {hero.powerstats.combat && (
                                    <Form.Field>
                                        <label htmlFor="combat">combat</label>
                                        <input type="number" id="combat" name="combat"
                                            defaultValue={hero.powerstats.combat === 'null' ? 0 : +hero.powerstats.combat}
                                            {...register("combat", { required: true, maxLength: 10 })}
                                        />
                                        {errors?.combat && <p>Please check the combat</p>}
                                    </Form.Field>)
                                }
                                {hero.powerstats.durability && (
                                    <Form.Field>
                                        <label htmlFor="durability">durability</label>
                                        <input type="number" id="durability" name="durability"
                                            defaultValue={hero.powerstats.durability === 'null' ? 0 : +hero.powerstats.durability}
                                            {...register('durability', { required: true, maxLength: 10 })}
                                        />
                                        {errors.durability && <p>Please check the durability</p>}
                                    </Form.Field>)
                                }
                                {hero.powerstats.intelligence && (
                                    <Form.Field>
                                        <label htmlFor="intelligence">intelligence</label>
                                        <input type="number" id="intelligence" name="intelligence"
                                            defaultValue={hero.powerstats.intelligence === 'null' ? 0 : +hero.powerstats.intelligence}
                                            {...register('intelligence', { required: true, maxLength: 10 })}
                                        />
                                        {errors.intelligence && <p>Please check the intelligence</p>}
                                    </Form.Field>)
                                }
                                {hero.powerstats.power && (
                                    <Form.Field >
                                        <label htmlFor="power">power</label>
                                        <input type="number" id="power" name="power"
                                            defaultValue={hero.powerstats.power === 'null' ? 0 : +hero.powerstats.power}
                                            {...register('power', { required: true, maxLength: 10 })}
                                        />
                                        {errors.power && <p>Please check the power</p>}
                                    </Form.Field>)
                                }
                                {hero.powerstats.speed && (
                                    <Form.Field >
                                        <label htmlFor="speed">speed </label>
                                        <input type="number" id="speed" name="speed"
                                            defaultValue={hero.powerstats.speed === 'null' ? 0 : +hero.powerstats.speed}
                                            {...register('speed', { required: true, maxLength: 10 })}
                                        />
                                        {errors.speed && <p>Please check the speed</p>}
                                    </Form.Field>)
                                }
                                {hero.powerstats.strength && (
                                    <Form.Field>
                                        <label htmlFor="strength">strength</label>
                                        <input type="number" id="strength" name="strength"
                                            defaultValue={hero.powerstats.strength === 'null' ? 0 : +hero.powerstats.strength}
                                            {...register('strength', { required: true })}
                                        />
                                        {errors.strength && <p>Please check the strength</p>}
                                    </Form.Field>)
                                }
                            </Form.Group>
                            {hero.image.url && (
                                <Form.Group inline style={{ backgroundColor: 'grey', padding: '1rem' }}>
                                    <Image style={{ cursor: 'pointer' }} onClick={changeImageSize} alt='hero-image' src={hero.image.url} size={imageSize} circular />
                                    <label style={{ marginLeft: '30px' }} htmlFor="image"> image url update :
                                        <input type="text" id="image" name="image" label='update image' defaultValue={hero.image.url} size="70"
                                            {...register('image', { required: true })}
                                        /></label>
                                </Form.Group>)
                            }
                            {/* <Form.Group > */}
                                <Button type='submit' >Save Heroinfo</Button>
                                {/* Below button reset is sending remote db submition beside reset form data when clicked, not as expected */}
                                {/* <button onClick={() => reset()}>Reset Superhero</button> */}
                                {/* <Button onClick={() => reset()}>Reset Superhero</Button> */}

                                {/* Below button reset is only reset UI form data as default values, without submit action */}
                                <Button type='button' onClick={() => reset()} >Reset Superhero</Button>
                            {/* </Form.Group> */}
                        </Form>
                        <div className="ui divider"></div>
                        <Segment >
                            <ViewHeroInfos hero={hero}></ViewHeroInfos>
                        </Segment>
                    </Segment>
                </div>
            </>
        );
    }
};

export default ViewSuperHeroDetails;
