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
            <Grid className="movieDetails" container spacing={5.3}>
                <Grid size={2}>
                    <img className="movieDetailsPoster" src={"https://image.tmdb.org/t/p/w185" + movie.details.poster_path} />
                </Grid> 
                <Grid size={10} className="movieTitleInfo">
                    <h1>{movie.details.title}</h1>
                    <ul className="genres">
                    {movie.details.genres.map((genre:any, index:number) => (
                        <ListItem key={index}>
                            <Chip
                            label={genre.name}
                            variant="outlined"
                            className="categoryChip"
                            />
                        </ListItem>
                    ))}
                    </ul>
                    <Chip className="trailerBtn" icon={<PlayArrow />} label="WATCH TRAILER" />
                </Grid> 
                <Grid size={2} className="relaseInfo">
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