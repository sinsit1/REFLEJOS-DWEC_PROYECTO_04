import React, { useEffect, useState } from 'react';
//importando los modulos de firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/credentials";
import { useParams } from 'react-router-dom';
import PrimarySearchAppBar from './Toolbar';
import { hydrate } from './helper';
import { cloneDeep } from 'lodash'

import PublishedWithChangesTwoToneIcon from '@mui/icons-material/PublishedWithChangesTwoTone';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import AddTaskTwoToneIcon from '@mui/icons-material/AddTaskTwoTone';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import RepeatIcon from '@mui/icons-material/Repeat';

import DirectionsRunTwoToneIcon from '@mui/icons-material/DirectionsRunTwoTone';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { blue } from '@mui/material/colors';

/*para la fecha y hora*/
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

/*barra separacion*/
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

//mas informacion programa
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Detail() {

  let { sportsmanId } = useParams();
  const [resultados, setResultados] = useState([]);
  const [deportista, setDeportista] = useState();

  const getDocFromReference = async (ref) => {
    const snapshot = await getDoc(ref);
    return snapshot.data();
  }

  const getDocument = async (uid, coleccion, isHydrated = false, referencesToHydrate = []) => {
    const ref = doc(db, coleccion, uid);
    const result = await getDocFromReference(ref)

    if (isHydrated) {
      hydrate(result, referencesToHydrate, {})
      return result;
    } else {
      const snapshot = await getDoc(ref);
      return snapshot.data()
    }
  }

  useEffect(() => {
    if (deportista) {
      const promises = deportista.resultados.map(async (resul) => {
        const snp = await getDoc(resul);
        return snp.data();
      });
      Promise.all(promises).then((resultados) => {
        // aqui hidratamos los resultados con los datos de idprograma y tipoejercicio
        // hago una copia con cambio de puntero
        const deepCopy = cloneDeep(resultados);
        // devuelve promesas. Hidratamos con los datos de idPrograma y tipoEjercicio (pidiendo los doc reference)
        const ps = resultados.map((el, i) => hydrate(el, deepCopy[i], ['idprograma', 'tipoejercicio']));
        // seteamos sin el hidrate
        setResultados(resultados);
        // hidrata los resultados con sus hijos, cambiando la referencia para que el front se entere
        Promise.all(ps).then(() => setResultados(deepCopy))
      });
    }
  }, [deportista]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const deportista = await getDocument(sportsmanId, 'deportistas');
        setDeportista(deportista);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, []); // El array vacío como segundo argumento asegura que useEffect se ejecute solo una vez al montar el componente


  return <div>
    <PrimarySearchAppBar />

    <h2 className='ml-6 mt-4 mx-auto'>Deportista: {deportista?.nombre} {deportista?.apellido1} {deportista?.apellido2}</h2>

    <div className="container mx-auto mt-5  flex flex-row flex-wrap " style={{ width: '80%' }}>
      {resultados.length > 0 ? (
        resultados.map((res, i) => (
          <div key={i} className="max-w-sm rounded overflow-hidden shadow-lg mx-2 ">
            <div className="px-6 py-4">

              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >

                  <Typography ><strong>PROGRAMA: </strong>{res.idprograma.descripcion}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component="div">
                    <Divider >
                      <Chip label="detalles" size="small" /></Divider>
                    Tiempo ejercicio: {res.idprograma.tejercicio}<br />
                    Tiempo descanso: {res.idprograma.tejercicio}<br />
                    Distancia: {res.idprograma.tejercicio}<br />
                    Numero de ciclos: {res.idprograma.nciclos}<br />
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <br></br>

              <strong><Divider>RESULTADOS</Divider></strong>

              <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DemoContainer
                  components={[
                    'DateTimePicker',
                    'MobileDateTimePicker',
                    'DesktopDateTimePicker',
                    'StaticDateTimePicker',
                  ]}
                >
                  <DemoItem>
                    <div style={{ textAlign: 'center' }}>
                      <DesktopDateTimePicker
                        readOnly
                        disabled
                        format="DD-MMMM-YYYY HH:mm"
                        // Utiliza el valor de fecha completa res?.fecha como defaultValue
                        defaultValue={res?.fecha && dayjs(res?.fecha.seconds * 1000)}
                      />
                    </div>
                  </DemoItem>

                </DemoContainer>
              </LocalizationProvider>

              <Timeline position="alternate">

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.distanciaaldispositivo}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot>
                      <DirectionsRunTwoToneIcon />
                      <RepeatIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Distancia
                    </Typography>
                    <Typography variant="body2">dispositivo</Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.numerodispositivosapagados} dispositivos
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot color="success">
                      <AddTaskTwoToneIcon sx={{ fontSize: 30 }} />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Apagados
                    </Typography>
                    <Typography variant="body2">cantidad correctos</Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.numerofallos}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot variant="primary" sx={{ color: red[500] }}>
                      <WarningIcon sx={{ fontSize: 30 }} />
                    </TimelineDot>

                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Fallos
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.tiempototalempleado}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                    <TimelineDot variant="sharp" sx={{ color: blue[500] }}>
                      <PublishedWithChangesTwoToneIcon sx={{ color: blue[500], fontSize: 30 }} />
                    </TimelineDot>


                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Reaccion
                    </Typography>
                    <Typography variant="body2">media de tiempo </Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.tiempototalejercicio}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />

                    <TimelineDot color="secondary">
                      <HistoryTwoToneIcon sx={{ fontSize: 30 }} />
                    </TimelineDot>

                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Total
                    </Typography>
                    <Typography variant="body2">tiempo del ejercicio</Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {res?.tiempototalempleado}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />

                    <TimelineDot variant="primary" sx={{ color: grey[700] }}>
                      <HourglassBottomOutlinedIcon sx={{ fontSize: 30 }} />
                    </TimelineDot>

                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      Ejecucion
                    </Typography>
                    <Typography variant="body2">tiempo total empleado</Typography>
                  </TimelineContent>
                </TimelineItem>

              </Timeline>

            </div>

          </div>
        ))
      ) : (
        <p>Cargando datos...</p>
      )}

    </div>
  </div>;
}
