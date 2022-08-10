import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField,} from "@material-ui/core";
import { Edit, Delete, Create } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const baseUrl = "http://laptop-idm5aj3g:8080/mp-tech-test-web-1.0.0/v1";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

function App() {

  const styles = useStyles();

  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedHeadquarter, setSelectedHeadquarter] = useState({
    name: "",
    location: "",
    noTel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedHeadquarter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const petitionGet = async () => {
    await axios.get(`${baseUrl}/prosecutions-list`).then((response) => {
      setData(response.data);
    });
  };

  const petitionPost = async () => {
    await axios
      .post(`${baseUrl}/register-prosecution`, selectedHeadquarter)
      .then((response) => {
        petitionGet();
        openCloseModalInsert();
      });
  };

  const petitionPut = async () => {
    await axios
      .put(`${baseUrl}/prosecution`, selectedHeadquarter)
      .then((response) => {
        petitionGet();
        openCloseModalEdit();
      });
  };

  const petitionDelete = async () => {
    await axios
      .put(`${baseUrl}/prosecution-disable`, selectedHeadquarter)
      .then((response) => {
        petitionGet();
        openCloseModalEdit();
      });
  };

  const openCloseModalInsert = () => {
    setModalInsert(!modalInsert);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const selectHeadquarter = (headquarter, caso) => {
    setSelectedHeadquarter(headquarter);
    caso === "Editar" ? openCloseModalEdit() : openCloseModalDelete();
  };

  useEffect(() => {
    async function fetchData() {
      const response = await petitionGet();
    }
    fetchData();
  }, []);

  const bodyInsert = (
    <div className={styles.modal}>
      <h3>Agregar Nueva Sede</h3>
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="location"
        className={styles.inputMaterial}
        label="Ubicación"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="noTel"
        className={styles.inputMaterial}
        label="Telefono"
        onChange={handleChange}
      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => petitionPost()}>
          Insertar
        </Button>
        <Button onClick={() => openCloseModalInsert()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEdit = (
    <div className={styles.modal}>
      <h3>Editar Sede</h3>
      <TextField
        name="name"
        className={styles.inputMaterial}
        label="Nombre"
        onChange={handleChange}
        value={selectedHeadquarter && selectedHeadquarter.name}
      />
      <br />
      <TextField
        name="location"
        className={styles.inputMaterial}
        label="Ubicación"
        onChange={handleChange}
        value={selectedHeadquarter && selectedHeadquarter.location}
      />
      <br />
      <TextField
        name="noTel"
        className={styles.inputMaterial}
        label="Telefono"
        onChange={handleChange}
        value={selectedHeadquarter && selectedHeadquarter.noTel}
      />
      <br />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => petitionPut()}>
          Editar
        </Button>
        <Button onClick={() => openCloseModalEdit()}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyDelete = (
    <div className={styles.modal}>
      <h3>
        Esta seguro que deseas eliminar la sede{" "}
        {selectedHeadquarter && selectedHeadquarter.name}{" "}
      </h3>
      <div align="right">
        <Button color="secondary" onClick={() => petitionDelete()}>
          SI
        </Button>
        <Button onClick={() => openCloseModalDelete()}>NO</Button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <br />
      <Button onClick={() => openCloseModalInsert()}> Insertar</Button>
      <br />
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Sede </TableCell>
              <TableCell> Ubicacion </TableCell>
              <TableCell> Telefono </TableCell>
              <TableCell> Acciones </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((headquarter) => (
              <TableRow>
                <TableCell>{headquarter.name}</TableCell>
                <TableCell>{headquarter.location}</TableCell>
                <TableCell>{headquarter.noTel}</TableCell>
                <TableCell>
                  {" "}
                  <Edit classMame={styles.iconos} onClick={() => selectHeadquarter(headquarter, "Editar")}/>{" "}
                  &nbsp;&nbsp;&nbsp;
                  <Delete classMame={styles.iconos} onClick={() => selectHeadquarter(headquarter, "Eliminar")}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsert} onClose={openCloseModalInsert}>
        {bodyInsert}
      </Modal>

      <Modal open={modalEdit} onClose={openCloseModalEdit}>
        {bodyEdit}
      </Modal>

      <Modal open={modalDelete} onClose={openCloseModalDelete}>
        {bodyDelete}
      </Modal>
    </div>
  );
}

export default App;
