import {Flex} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import List from "../components/List";
import Map from "../components/Map";
import { getPlacesData } from "./api/hello";
import Nav from "../components/Nav"

import styles from '../styles/Home.module.css'
import { useLoadScript } from "@react-google-maps/api";

// const places = [
//   {name: "sample place1"},
//   {name: "sample place2"},
//   {name: "sample place3"},
//   {name: "sample place4"},
//   {name: "sample place5"},
//   {name: "sample place6"},
// ]


const Home = () => {

  const [places, setPlaces]=useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  // Para controlar los límites del mapa cuando se mueve el mapa
  const [bounds, setBounds] = useState(null)
  const [coordinates, setCoordinates]=useState({});
  const [type, setType]=useState('restaurants');
  const [ratings, setRatings]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [libraries] = useState(['places']);
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: "AIzaSyBt9Pngo_T7wBsDUld1GX81xry2YtWqr9E", libraries });
  

  useEffect(() => {

    // get the users current location on intial login

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log({ latitude, longitude });
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filteredData = places.filter((place) => place.rating > ratings);
    setFilteredPlaces(filteredData);
    console.log({ ratings });
    console.log(filteredData, "FILTEREDDATA")
  }, [ratings]);

  useEffect(() => {
    setIsLoading(true);
    getPlacesData(type, bounds?.ne, bounds?.sw).then((data) => {
      console.log(data);
      setPlaces(data);
      setIsLoading(false);
    });
  }, [type, coordinates, bounds]);

  return (
    <>
    <Nav />
    <Flex 
    justifyContent={"center"}
    alignItems={"center"}
    width={"100vw"}
    height={"100vh"}
    maxWidth={"100vw"}
    maxHeight={"100vh"}
    position={"relative"}
    // bg={"blue.400"}
    >
      
      {/* <Script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key="/> */}
      <Header setType={setType} setCoordinates={setCoordinates} setRatings={setRatings} isLoaded={isLoaded}/>
      <List places={filteredPlaces.length ? filteredPlaces : places} isLoading={isLoading} />
      <Map isLoaded={isLoaded} setCoordinates={setCoordinates} coordinates={coordinates} setBounds={setBounds} places={filteredPlaces.length ? filteredPlaces : places} />
    </Flex>
    </>
  )
}

export default Home;
