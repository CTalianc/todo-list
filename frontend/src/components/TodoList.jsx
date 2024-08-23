import React, { useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import Modal from './Modal';
import { Alert, Button } from "@mui/material";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import '../App.css';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.css';

function TodoList() {
  const csrftoken = Cookies.get('csrftoken');

  const [todoList, setTodoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentTab, setCurrentTab] = useState("completed");
  const [errors, setErrors] = useState({});
  const [indexError, setIndexError] = useState(null);

  const refreshList = () => {
    axios
      .get("/api/todos/", { headers: { 'X-CSRFToken': csrftoken } })
      .then((res) => setTodoList(res.data, setIndexError(null)))
      .catch((err) => setIndexError("Failed to fetch todo list items."));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const getItem = (itemId) => {
    return todoList.find(
      (item) => item.id === itemId
    );
  };

  const showAddModal = () => {
    setActiveItem(
      null, 
      setShowModal(true)
    );
  };

  const showEditModal = (e) => {
    setActiveItem(
      getItem(parseInt(e.target.getAttribute('data-id'))), 
      setShowModal(true)
    );
  };

  const handleRequest = (request) => {
    request
        .then((response) => {
            refreshList();
            setShowModal(false, setErrors([]));
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                const { data } = error.response;
                
                if (data) {
                    let errorHash = {};
                    Object.entries(data).forEach(([key, value]) => {
                        if (errorHash[key]) {
                          errorHash[key].push(value);
                        } else {
                          errorHash[key] = [value];
                        }
                      }
                    );
                    setErrors(errorHash);
                } else {
                  setErrors({"general": ["An unexpected error occurred. Please try again."]})
                }
            } else {
              setErrors({"general": ["Failed to submit the item. Please check your network connection."]})
              console.error("Failed to submit the item. Please check your network connection.");
            }
        });
  };

  const handleSubmit = (item) => {
    let request = null;
    if (item.id) {
      request = axios.put(`/api/todos/${item.id}/`, item, { headers: { 'X-CSRFToken': csrftoken } })
    } else {
      request = axios.post(`/api/todos/`, item, { headers: { 'X-CSRFToken': csrftoken } })
    }

    handleRequest(request);
  };

  const handleDelete = (e) => {
    const itemId = e.target.getAttribute('data-id');
    let request = axios.delete(`/api/todos/${itemId}/`, { headers: { 'X-CSRFToken': csrftoken } });
    handleRequest(request);

  };

  const handleTabChange = (e, value) => {
    setCurrentTab(value);
  };

  let completedItemContent = [];
  let incompleteItemContent = [];

  todoList.forEach(
    (item) => {
      var todoItem = (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${item.completed ? "completed-todo" : ""}`}
            title={item.description}
          >
            {item.title}
          </span>
          <span>
            <Button
              variant="contained"
              data-id={item.id}
              onClick={showEditModal}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              data-id={item.id}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </span>
          <br />
        </li>
      );
      if (item.completed) {
        completedItemContent.push(todoItem);
        completedItemContent.push(<br />);
      } else {
        incompleteItemContent.push(todoItem);
        incompleteItemContent.push(<br />);

      }
    }
  );

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          {indexError && <Alert severity="error">{indexError}</Alert>}
          <div className="card p-3">
            <div className="mb-4">
              <Button
                variant="contained"
                color="success"
                onClick={showAddModal}
              >
                Add task
              </Button>
            </div>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={currentTab}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="basic tabs example">
                      <Tab label="Completed" value="completed" key="completed" />
                      <Tab label="Incomplete" value="incomplete" key="incomplete" />
                    </TabList>
                  </Box>
                  <TabPanel value={'completed'}> 
                    {completedItemContent}
                  </TabPanel>
                  <TabPanel value={'incomplete'}> 
                    {incompleteItemContent}
                  </TabPanel>
                </TabContext>
              </Box>
          </div>
        </div>
      </div>
      {showModal && <Modal item={activeItem} setShowModal={setShowModal} onSubmit={handleSubmit} errors={errors} setErrors={setErrors} />}
    </main>
  );
}

export default TodoList;
