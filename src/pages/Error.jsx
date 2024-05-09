import React from 'react';
import { Link } from 'react-router-dom'; // Asumiendo que estás utilizando React Router

const Error = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Error 404</h1>
      <p style={styles.text}>Lo sentimos, la página que buscas no se encuentra.</p>
      <Link to="/" style={styles.link}>Volver a la página de inicio</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
};

export default Error;