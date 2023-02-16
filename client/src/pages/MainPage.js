import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Table,
  DropdownButton,
  Dropdown,
  Button,
  Form,
  FormGroup,
  Tab,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

function MainPage() {
  // sample data for the table
  const data = [
    {
      project: "Project A",
      name: "John",
      description: "XXX",
      strategy: "XXX",
    },
    { project: "Project B", name: "Jane", description: "XXX" },
    { project: "Project C", name: "Jim", description: "XXX" },
    { project: "Project A", name: "J", description: "XXX" },
    { project: "Project A", name: "Y", description: "XXX" },
  ];

  const [projects, setProjects] = useState([
    "Project A",
    "Project B",
    "Project C",
  ]);

  const [selectedProject, setSelectedProject] = useState();
  const [selectedData, setSelectedData] = useState([]);

  // function to filter data by project
  const filterDataByProject = (project) => {
    const filteredData = data.filter((item) => item.project === project);
    setSelectedData(filteredData);
    setSelectedProject(project);
  };

  const handleCreateProject = () => {
    const newProject = prompt("Enter the name of the new project:");
    if (newProject !== null && newProject !== "") {
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      filterDataByProject(newProject);
    }
  };

  const handleDeleteProject = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the project "${selectedProject}"?`
    );
    if (confirmed) {
      setProjects(projects.filter((project) => project !== selectedProject));
      setSelectedProject(projects[0]);
      filterDataByProject(projects[0]);
    }
  };

  // function to update the strategy text box
  const updateStrategy = (row, strategy) => {
    const index = selectedData.indexOf(row);
    if (index >= 0) {
      const newSelectedData = [...selectedData];
      newSelectedData[index] = { ...newSelectedData[index], strategy };
      setSelectedData(newSelectedData);
    }
  };

  // function to remove a row from risk table
  const removeRow = (row) => {
    setSelectedData(
      selectedData.filter((selectedData) => selectedData !== row)
    );
  };

  return (
    <div>
      <NavigationBar loggedIn={true} />
      <div className="container">
        <div className="d-flex">
          <DropdownButton
            variant="secondary"
            title="Select Project"
            onSelect={(eventKey) => filterDataByProject(eventKey)}
            style={{ margin: "20px 20px 0 0" }}
          >
            {projects.map((project) => (
              <Dropdown.Item eventKey={project}>{project}</Dropdown.Item>
            ))}
          </DropdownButton>
          <Button
            type="submit"
            variant="dark"
            onClick={handleCreateProject}
            style={{
              margin: "20px 20px 0 0",
              textAlign: "center",
            }}
          >
            Create Project
          </Button>{" "}
          <Button
            type="submit"
            variant="dark"
            onClick={handleDeleteProject}
            style={{
              margin: "20px 0 0 0",
              textAlign: "center",
            }}
          >
            Delete Project
          </Button>
        </div>
        <h3
          style={{
            margin: "20px 0 20px 0",
          }}
        >
          Risk Table for Project: {selectedProject}
        </h3>
        <Table
          striped
          bordered
          hover
          variant="dark"
          size="sm"
          style={{ maxWidth: "50%" }}
        >
          <thead>
            <tr>
              <th>Project</th>
              <th>Risk Scenario Name</th>
              <th>Risk Scenario Description</th>
              <th>Mitigation Strategy</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedData.map((row) => (
              <tr key={row.name}>
                <td>{row.project}</td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={row.strategy}
                      onChange={(event) =>
                        updateStrategy(row, event.target.value)
                      }
                    />
                  </Form.Group>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-success"
                    style={{ margin: "0 5px 0 0" }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => removeRow(row)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default MainPage;
