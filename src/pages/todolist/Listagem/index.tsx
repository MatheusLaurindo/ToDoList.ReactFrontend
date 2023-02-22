import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  Button,
  Modal,
  Fade,
  Box,
  Backdrop,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

function Listagem() {
  /*constante com a url da api, chamando o GET e trazendo a listagem de tarefas*/
  const baseUrl = "https://localhost:7027/api/Activity";
  /*constante que recebe a listagem de tarefas vindas da api*/
  const [data, setData] = useState([
    {
      id: "",
      name: "",
      description: "",
      executionDate: "",
      executionTime: "",
      isFinished: false,
    },
  ]);
  /*constante que recebe a listagem de tarefas concluídas da api*/
  const [finishedData, setFinishedData] = useState([
    {
      id: "",
      name: "",
      description: "",
      executionDate: "",
      executionTime: "",
      isFinished: false,
    },
  ]);
  /*constante que recebe os valores dos inputs selecionados*/
  const [selected, setSelected] = useState({
    id: "",
    name: "",
    description: "",
    executionDate: "",
    executionTime: "",
    isFinished: false,
  });
  /*inicio da área de modal*/
  const [deleteModal, setDeleteModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  /*fim da área de modal*/

  // handle de modal
  const handleOnDeleteModalOpen = () => {
    setDeleteModal(!deleteModal);
  };

  const handleOnFinishModalOpen = () => {
    setFinishModal(!finishModal);
  };

  const handleOnHistoryModalOpen = () => {
    setHistoryModal(!historyModal);
  };

  const handleOnAddModalOpen = () => {
    setAddModal(!addModal);
  };

  const handleOnEditModalOpen = () => {
    setEditModal(!editModal);
  };

  // handle que associa os valores digitados no input ao objeto
  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setSelected({
      ...selected,
      [name]: value,
    });
  };

  // método para abrir os modais das açoes concluir, editar ou excluir
  const selectTask = (task: any, option: any) => {
    setSelected(task);
    if (option === "Delete") handleOnDeleteModalOpen();
    if (option === "Finish") handleOnFinishModalOpen();
    if (option === "Edit") handleOnEditModalOpen();
  };

  // aqui se inicia as chamadas dos endpoints da API

  // httpGET que retorna um array de objetos e os objetos alimentam a tabela de tarefas
  const getList = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // httpGET que retorna array de objetos com apenas as tarefas marcadas como concluidas
  const getFinishedList = async () => {
    await axios
      .get(baseUrl + "/Finished")
      .then((response) => {
        setFinishedData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // httpPOST para criar uma nova tarefa e adicionar no banco
  const postTask = async () => {
    selected.id = "0";
    await axios
      .post(baseUrl, selected)
      .then((response) => {
        setData(data.concat(response.data));
        getList();
        getFinishedList();
        handleOnAddModalOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // httpPUT para editar uma tarefa
  const putTask = async () => {
    await axios
      .put(baseUrl + "/?id=" + selected.id, selected)
      .then((response) => {
        var resp = response.data;
        var auxData = data;
        auxData.map((task) => {
          if (task.id === selected.id) {
            task.name = resp.name;
            task.description = resp.description;
            task.executionDate = resp.executionDate;
            task.executionTime = resp.executionTime;
          }
          return null;
        });
        getList();
        handleOnEditModalOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // httpDELETE para deletar uma tarefa
  const deleteTask = async () => {
    await axios
      .delete(baseUrl + "/?id=" + selected.id)
      .then((response) => {
        setData(data.filter((task) => task.id !== response.data));
        getList();
        handleOnDeleteModalOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // httpPUT para marcar tarefa como concluida
  const finishTask = async () => {
    await axios
      .put(baseUrl + "/SetFinished?id=" + selected.id)
      .then((response) => {
        setData(data.filter((task) => task.id !== response.data));
        getList();
        getFinishedList();
        handleOnFinishModalOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getList();
    getFinishedList();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <Grid container mt={1} justifyContent="space-evenly">
          <Grid item sm={11}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleOnAddModalOpen}
            >
              <Typography>Adicionar tarefa</Typography>
            </Button>
          </Grid>
          <Grid item sm={1}>
            <Button variant="outlined" onClick={handleOnHistoryModalOpen}>
              <Typography>Histórico</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sm={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Atividade</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Descrição</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Data</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Hora</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold" align="center">
                    Ações
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {task.name}
                  </TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.executionDate}</TableCell>
                  <TableCell>{task.executionTime}</TableCell>
                  <TableCell align="center">
                    <Grid container>
                      <Grid item sm={12}>
                        <Tooltip title="Concluir atividade">
                          <IconButton
                            color="success"
                            onClick={() => selectTask(task, "Finish")}
                          >
                            <CheckCircleIcon></CheckCircleIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar atividade">
                          <IconButton
                            color="primary"
                            onClick={() => selectTask(task, "Edit")}
                          >
                            <EditIcon></EditIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir atividade">
                          <IconButton
                            color="error"
                            onClick={() => selectTask(task, "Delete")}
                          >
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/*MODAL AREA*/}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deleteModal}
        onClose={handleOnDeleteModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deleteModal}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item sm={12} mb={3}>
                <Typography
                  color="#fff"
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Deseja excluir a atividade:{" "}
                  <strong style={{ color: "#ffa726" }}>{selected.name}</strong>?
                </Typography>
              </Grid>
              <Grid container gap={2} justifyContent="end">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteTask()}
                >
                  Excluir
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOnDeleteModalOpen}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={finishModal}
        onClose={handleOnFinishModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={finishModal}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item sm={12} mb={3}>
                <Typography
                  color="#fff"
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Concluir atividade: {"  "}
                  <strong style={{ color: "#ffa726" }}>{selected.name}</strong>?
                </Typography>
              </Grid>
              <Grid container gap={2} justifyContent="end">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => finishTask()}
                >
                  Concluir
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOnFinishModalOpen}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={historyModal}
        onClose={handleOnHistoryModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={historyModal}>
          <Box sx={historyFinished}>
            <Typography variant="h5" mb={2} color="#fff">
              Histórico de atividades
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Atividade</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Descrição</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Data</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Hora</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {finishedData.map((finishedTask) => (
                    <TableRow
                      key={finishedTask.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {finishedTask.name}
                      </TableCell>
                      <TableCell>{finishedTask.description}</TableCell>
                      <TableCell>{finishedTask.executionDate}</TableCell>
                      <TableCell>{finishedTask.executionTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addModal}
        onClose={handleOnAddModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={addModal}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item sm={12} mb={2}>
                <Typography variant="h5" color="#fff">
                  Adicionar atividade
                </Typography>
              </Grid>
              <Grid item sm={12} mb={3}>
                <Grid container gap={2}>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Nome da atividade
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="name"
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Descrição
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="description"
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Data
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      name="executionDate"
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Horário
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      name="executionTime"
                      onChange={handleOnChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container gap={2} justifyContent="end">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => postTask()}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOnAddModalOpen}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={editModal}
        onClose={handleOnEditModalOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={editModal}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item sm={12} mb={2}>
                <Typography variant="h5" color="#fff">
                  Editar atividade
                </Typography>
              </Grid>
              <Grid item sm={12} mb={3}>
                <Grid container gap={2}>
                  <Grid item sm={12} display="none">
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="id"
                      value={selected && selected.id}
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Nome da atividade
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="name"
                      value={selected && selected.name}
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Descrição
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="description"
                      value={selected && selected.description}
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Data
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="executionDate"
                      value={selected && selected.executionDate}
                      onChange={handleOnChange}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography mb={1} color="#ffa726" letterSpacing={1}>
                      Horário
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="time"
                      name="executionTime"
                      value={selected && selected.executionTime}
                      onChange={handleOnChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container gap={2} justifyContent="end">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => putTask()}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOnEditModalOpen}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </Grid>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#2b2b2b",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const historyFinished = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "#2b2b2b",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Listagem;
