import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseAuth } from './../firebase/credentials'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
const defaultTheme = createTheme();

export default function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    setUser(userData);

    loginWithCredentials(userData, data.get('remember'));
  };


  const loginWithCredentials = async ({ email, password }, rememberUser) => {
    try {
      const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
      console.log('token de usuario', resp.user.accessToken);
      localStorage.setItem('token', resp.user.accessToken);
      navigate('/');

      return resp.user.uid

    } catch (e) {
      alert(e.message)
    }
  }

  // <Grid container>
  //<Grid item xs>
  //<Link href="#" variant="body2">
  // Has olvidado tu contraseña?
  //</Link>
  //</Grid>
  //</Grid>

  return (
    <Box sx={{ backgroundImage: `url("https://img.freepik.com/foto-gratis/fondo-pantalla-negocios-digital-degradado-bokeh_53876-110796.jpg?w=996&t=st=1709559735~exp=1709560335~hmac=496cb705374897d9a2512ee05167cb92b3827e6ae4a6b4c0b828160cee4fae66")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '100vh' }}>
      <ThemeProvider theme={defaultTheme}>

        <Container component="main" maxWidth="xs" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Bienvenidx a REFLEJOS
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Entra
              </Button>

            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
}