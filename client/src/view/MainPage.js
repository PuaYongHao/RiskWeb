import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown, Button, Form } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

function MainPage() {
  // sample data for the table
  const data = [
    {
      id: 1,
      name: "John",
      description: "XXX",
    },
    { id: 2, name: "Jane", description: "XXX" },
    { id: 3, name: "Jim", description: "XXX" },
    { id: 4, name: "J", description: "XXX" },
    { id: 5, name: "Y", description: "XXX" },
    { id: 6, name: "Jane", description: "XXX" },
  ];

  const projectData = [
    {
      id: 1,
      project: "Project A",
      name: "John",
      description: "XXX",
      strategy: "XXX",
    },
    { id: 2, project: "Project B", name: "Jane", description: "XXX" },
    { id: 3, project: "Project C", name: "Jim", description: "XXX" },
    { id: 4, project: "Project A", name: "J", description: "XXX" },
    { id: 5, project: "Project A", name: "Y", description: "XXX" },
    { id: 6, project: "Project A", name: "Jane", description: "XXX" },
  ];

  const [projects, setProjects] = useState([
    "Project A",
    "Project B",
    "Project C",
  ]);

  const [selectedProject, setSelectedProject] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState([]);

  // function to filter data by project
  const filterDataByProject = (project) => {
    const filteredData = projectData.filter((item) => item.project === project);
    setSelectedData(filteredData);
    setSelectedProject(project);
  };

  // function to filter data by project manager
  const filterDataByName = (name) => {
    if (name === "All") {
      setSelectedData(projectData);
    } else {
      const filteredData = projectData.filter((item) => item.name === name);
      setSelectedData(filteredData);
    }
  };

  // function to create risk table for new project
  const handleCreateProject = () => {
    const newProject = prompt("Enter the name of the new project:");
    if (newProject !== null && newProject !== "") {
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      filterDataByProject(newProject);
    }
  };

  // function to delete risk table of a project
  const handleDeleteProject = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedProject}"?`
    );
    if (confirmed) {
      setProjects(projects.filter((project) => project !== selectedProject));
      setSelectedProject(projects[0]);
      filterDataByProject(projects[0]);
    }
  };

  // function to allow editing strategy text box
  const updateStrategy = (row, strategy) => {
    const index = selectedData.indexOf(row);
    if (index >= 0) {
      const newSelectedData = [...selectedData];
      newSelectedData[index] = { ...newSelectedData[index], strategy };
      setSelectedData(newSelectedData);
    }
  };

  // function to remove a row from risk table
  const removeRisk = (row) => {
    setSelectedData(
      selectedData.filter((selectedData) => selectedData !== row)
    );
  };

  // function to add a risk to the selected risks table
  const addRisk = (row) => {
    const newRow = {
      project: selectedProject,
      name: row.name,
      description: row.description,
    };
    const newSelectedData = [...selectedData, newRow];
    setSelectedData(newSelectedData);
  };

  // To prepare project manager names for drop down list
  const names = [];
  projectData.forEach((row) => {
    const index = names.findIndex((item) => item.name === row.name);
    if (index === -1) {
      names.push(row);
    } else {
      names[index].projectCount += row.projectCount;
    }
  });

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
              margin: "20px 20px 0 0",
              textAlign: "center",
            }}
          >
            Delete Project
          </Button>
          <DropdownButton
            variant="secondary"
            title="Select Project Manager"
            onSelect={(eventKey) => filterDataByName(eventKey)}
            style={{ margin: "20px 0 0 0", marginLeft: "auto" }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            {names.map((row) => (
              <Dropdown.Item eventKey={row.name}>{row.name}</Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3
            style={{
              margin: "20px 0 20px 0",
              flexBasis: "49%",
            }}
          >
            Risk Table for {selectedProject}
          </h3>
          <h3
            style={{
              margin: "20px 0 20px 0",
              flexBasis: "49%",
            }}
          >
            Risk Scenario Database
          </h3>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Table
            striped
            bordered
            hover
            variant="dark"
            size="sm"
            style={{ maxWidth: "49%", height: "100px" }}
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
                <tr key={row.id}>
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
                      onClick={() => removeRisk(row)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table
            striped
            bordered
            hover
            variant="dark"
            size="sm"
            style={{ maxWidth: "49%", height: "100px" }}
          >
            <thead>
              <tr>
                <th>Risk Scenario Name</th>
                <th>Risk Scenario Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => addRisk(row)}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
