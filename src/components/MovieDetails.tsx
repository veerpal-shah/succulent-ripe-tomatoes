import Grid from '@mui/material/Grid2';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import PlayArrow from '@mui/icons-material/PlayArrow';
import {Fragment} from 'react';

export default function MovieDetails({movie} : {movie:any | null}) {
    console.log(movie);

    return (
        <Fragment>
        {movie && (
            <Grid className="movieDetails" container spacing={5.3} sx={{
                "h1": {
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '2.33vw',
                    lineHeight: '2.33vw',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                "h4": {
                    color: '#ffffff',
                    fontSize: '0.9vw',
                    fontWeight: '700',
                    lineHeight: '0.9vw',
                    marginBottom: '2vw',
                  }
            }}>
                <Grid size={2}>
                    <img className="movieDetailsPoster" src={"https://image.tmdb.org/t/p/w185" + movie.details.poster_path} />
                </Grid> 
                <Grid size={10} className="movieTitleInfo">
                    <h1>{movie.details.title}</h1>
                    <ul className="genres">
                    {movie.details.genres.map((genre:any, index:number) => (
                        <ListItem key={index} sx={{
                            display: 'inline-flex',
                            width: 'fit-content',
                            paddingLeft: '0',
                            paddingRight: '.6vw'
                        }}>
                            <Chip
                            label={genre.name}
                            variant="outlined"
                            className="categoryChip"
                            sx={{
                                borderColor: '#293146',
                                color: '#727ba1',
                                fontWeight: '600',
                                fontSize: '.8vw',
                                textTransform: 'uppercase'
                            }}
                            />
                        </ListItem>
                    ))}
                    </ul>
                    <Chip className="trailerBtn" icon={<PlayArrow />} label="WATCH TRAILER" sx={{
                        "svg": {
                            color: "#FFFFFF!important",
                            fontSize: "1.3vw",
                            position: 'relative',
                            left: '-1.6vw'
                        },
                        "span": {
                            color: '#FFFFFF',
                            fontWeight: '600',
                            fontSize: '0.9vw',
                            paddingLeft: '0'
                        },
                        backgroundColor: '#5179ff',
                        padding: '1vw',
                        height: '3.9vw',
                        borderRadius: '2vw',
                        width: '14vw',
                        position: 'absolute',
                        bottom: '0',
                    }}/>
                </Grid> 
                <Grid size={2} className="relaseInfo" sx={{
                    "h3": {
                        paddingBottom: '0.8vw'
                    }
                }}>
                    <h3>{(new Date(movie.details.release_date)).getFullYear()}</h3>
                    <h3>{(movie.details.runtime > 60 ? Math.floor(movie.details.runtime / 60) + "H" : "")} {movie.details.runtime % 60}MIN</h3>
                    {movie.releaseDates.results.find((release:any) => release.iso_3166_1 == "US") && (
                        <h3>{movie.releaseDates.results.find((release:any) => release.iso_3166_1 == "US").release_dates.find((release:any) => release.certification.length > 0).certification}</h3>
                    )}
                </Grid> 
                <Grid size={6}>
                    <h4>STORYLINE</h4>
                    <p>{movie.details.overview}</p>
                </Grid> 
                <Grid size={4} className="cast">
                    <h4>CAST</h4>
                    <ul>
                    {movie.cast.cast.map((person:any, index:number) => (
                        <ListItem alignItems="flex-start" className="castMember" key={index}>
                            <Avatar
                                alt={person.name}
                                src={"https://image.tmdb.org/t/p/w45" + person.profile_path}
                                sx={{ width: 45, height: 45 }}
                            />
                            <div className="personCharacter">
                                <p className="personName">{person.name}</p>
                                <p className="characterName">{person.character}</p> 
                            </div>
                        </ListItem>
                    ))}
                    </ul>
                </Grid> 
            </Grid>
        )}
        </Fragment>
    );
}