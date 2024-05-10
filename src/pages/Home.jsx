import React from 'react';
import { useState, useEffect } from 'react';

//importando los modulos de firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../firebase/credentials";
// material
import SearchIcon from '@mui/icons-material/Search';
import PrimarySearchAppBar from './Toolbar';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: theme.spacing(2),
  width: '200px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '200px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '200px',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Home() {

  const [datosDeportistas, setDatosDeportistas] = useState([]); // Cambiado a plural
  const [deportistasFiltrados, setDeportistasFiltrados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'deportistas'));
        if (!snapshot.empty) {
          const deportistas = snapshot.docs.map((deportista) => ({
            id: deportista.id,
            ...deportista.data(),
          }));
          setDatosDeportistas(deportistas);
          setDeportistasFiltrados(deportistas); // genero copia de deportistas
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez al montar el componente


  const onSubmit = (event) => {
    const filtro = event.target.value;
    if (!filtro) { // si el filtro llega vacio meto todos los deportistas
      setDeportistasFiltrados(datosDeportistas);
    } else { // si llega algo en el filtro lo aplico
      let deportistasFil = [...datosDeportistas];
      deportistasFil = deportistasFiltrados.filter(dep => {
        const nombreCompleto = `${dep.nombre} ${dep.apellido1} ${dep.apellido2} `
        return nombreCompleto.toLowerCase().includes(filtro)
      });
      setDeportistasFiltrados(deportistasFil);
    }
  }

  const goToDetail = (idDeportista) => {
    navigate(`../../deportista/${idDeportista}`)
  }

  return (
    <>
      <PrimarySearchAppBar />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>


        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            onChange={onSubmit}
            placeholder="Busca deportista.."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </Box>

      <div className="container mx-auto mt-5  flex flex-row flex-wrap " style={{ width: '80%' }}>
        {deportistasFiltrados.length > 0 ? (
          deportistasFiltrados.map((deportista) => (
            <div key={deportista.id} className="max-w-sm rounded overflow-hidden shadow-lg mx-2 ">
              <div className="px-6 py-4">

                <React.Fragment>
                  <CardContent>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Avatar
                        alt={deportista.nombre}
                        //src="/static/images/avatar/1.jpg"                   
                        sx={{ width: 120, height: 120, }}
                      />
                    </Stack>
                    <div className="font-bold text-x1 mb-2 underline" style={{ fontSize: '18px', textAlign: 'center', marginTop: '15px' }}>{deportista.nombre} {deportista.apellido1} {deportista.apellido2}</div>
                    <p className="text-gray-700 text-base">
                      <p><strong>ID:</strong> {deportista.id}</p>
                      <p><strong>Club:</strong> {deportista.club}</p>
                      <p><strong>Deporte:</strong> {deportista.deporte}</p>
                      <p><strong>Fecha de Nacimiento:</strong> {new Date(deportista.fechanacimiento.seconds * 1000).toLocaleDateString()}</p>
                    </p>

                  </CardContent>
                  <CardActions>
                    <div key={deportista.id} onClick={() => goToDetail(deportista.id)}>
                      <Button variant="contained">RESULTADOS</Button>
                    </div>
                  </CardActions>
                </React.Fragment>
              </div>
            </div>
          ))
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
    </>
  );
}
