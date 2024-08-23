import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
} from "reactstrap";
import { Alert, Button, Checkbox, Paper, TextField } from "@mui/material";

function CustomModal({ item, onSubmit, setShowModal, errors, setErrors}) {
    const placeholderItem = {
      title: '',
      description: '',
      completed: false,
    }
    const [currentItem, setCurrentItem] = useState(item || placeholderItem);
  
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }

        setCurrentItem(prevItem => ({
          ...prevItem,
          [name]: value
      }));
    };

    return (
      <Paper >
        <Modal isOpen={true}>
          <ModalHeader>Todo Item</ModalHeader>
          {errors["general"] && <Alert severity="error">{errors["general"].join(' ')}</Alert>}
          <ModalBody>
            <Form>
              <FormGroup>
                <TextField
                  type="text"
                  name="title"
                  label="Title"
                  value={currentItem.title}
                  onChange={handleChange}
                  error={errors["title"] && errors["title"].length > 0}
                  helperText={errors["title"] ? errors["title"].join(' ') : ""}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  type="text"
                  name="description"
                  label="Description"
                  value={currentItem.description}
                  onChange={handleChange}
                  error={errors["description"] && errors["description"].length > 0}
                  helperText={errors["description"] ? errors["description"].join(' ') : ""}
                  />
              </FormGroup>
              <Checkbox
                name="completed"
                label="Completed"
                checked={currentItem.completed}
                onChange={handleChange}
                error={errors["completed"] && errors["completed"].length > 0}
                helperText={errors["completed"] ? errors["completed"].join(' ') : ""}
              />
              Completed
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="contained"
              color="error"
                onClick={() => setShowModal(false, setErrors([]))}
              >
                Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => onSubmit(currentItem)}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </Paper>
    );
}

export default CustomModal;