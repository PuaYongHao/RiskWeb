import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Table, DropdownButton, Dropdown, Button, Form } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

function MainPage() {
  const { auth } = useAuth();

  const [projects, setProjects] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedProjectID, setSelectedProjectID] = useState();
  const [selectedRiskTable, setSelectedRiskTable] = useState([]);
  const [selectedProjectManager, setSelectedProjectManager] = useState();

  // Retrive all the projects under this account
  useEffect(() => {
    axios
      .get("/project", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const newProjects = response.data;
        const filteredProjects = newProjects.filter(
          (project) => project.uid === auth?.uid
        );
        setProjects(filteredProjects);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [auth?.uid]);

  // Retrive all the risks from risk scenario database
  useEffect(() => {
    axios
      .get("/scenario", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setScenarios(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Retrive all the users that has project manager role
  useEffect(() => {
    axios
      .get("/user", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        setProjectManagers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // function to display risk table for selected project
  const filterDataByProject = async (projectID) => {
    try {
      const response = await axios.get("/risk", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const newRiskTable = response?.data;
      const project = projects.find((p) => p._id === projectID);
      const filteredRiskTable = newRiskTable
        .filter((risk) => risk.pid === projectID)
        .map((risk) => ({ ...risk, projectName: project.projectName }));
      setSelectedRiskTable(filteredRiskTable);
      setSelectedProject(project?.projectName);
    } catch (err) {
      console.error(err);
    }
  };

  // function to select a project id when user chooses one from dropdownlist
  const clickProjectName = (projectID) => {
    setSelectedProjectID(projectID);
  };

  // Change risk table when there is a change to selected project id
  useEffect(() => {
    filterDataByProject(selectedProjectID);
  }, [selectedProjectID]);

  // function to filter data by project manager
  const filterDataByName = async (uid) => {
    let response;
    let secondresponse;
    let newRiskTable;
    let newProjects;
    let filteredRiskTable;
    setSelectedProject(null);
    try {
      setProjects([]);
      response = await axios.get("/risk", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      secondresponse = await axios.get("/project", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      newRiskTable = response?.data;
      newProjects = secondresponse?.data;
      filteredRiskTable = [];
    } catch (err) {
      console.error(err);
    }

    if (uid === "-1") {
      setSelectedProjectManager("All");
      for (const r of newRiskTable) {
        const project = await newProjects.find((p) => p._id === r.pid);
        if (project) {
          filteredRiskTable.push({
            ...r,
            projectName: project.projectName,
          });
        }
      }
      setSelectedRiskTable(filteredRiskTable);
    } else {
      const projectManager = projectManagers.find((pm) => pm._id === uid);
      setSelectedProjectManager(projectManager.name);
      for (const r of newRiskTable) {
        const project = await newProjects.find(
          (p) => p.uid === uid && p._id === r.pid
        );
        if (project) {
          filteredRiskTable.push({
            ...r,
            projectName: project.projectName,
          });
        }
      }
      const projectList = await newProjects.filter((p) => p.uid === uid);
      setProjects(projectList);
      setSelectedRiskTable(filteredRiskTable);
    }
  };

  // function to delete the selected project and its risk table
  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedProject}"?`
    );
    if (confirmed) {
      try {
        await axios.delete(`/project/${selectedProjectID}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const newProjects = projects.filter(
          (project) => project._id !== selectedProjectID
        );
        setProjects(newProjects);
        setSelectedProjectID(newProjects[0]?._id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // function to create new project
  const handleCreateProject = async () => {
    const newProject = prompt("Enter the name of the new project:");
    if (newProject !== null && newProject !== "") {
      try {
        const response = await axios.post(
          "/project/create",
          JSON.stringify({
            uid: auth?.uid,
            projectName: newProject,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newProjectID = response?.data?._id;
        setProjects([...projects, response?.data]);
        setSelectedProjectID(newProjectID);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // function to allow editing strategy text box
  const allowStrategyEditing = (row, strategy) => {
    console.log(projects);
    const index = selectedRiskTable.indexOf(row);
    if (index >= 0) {
      const newSelectedData = [...selectedRiskTable];
      newSelectedData[index] = { ...newSelectedData[index], strategy };
      setSelectedRiskTable(newSelectedData);
    }
  };

  // function to remove a risk from risk table
  const removeRisk = async (row) => {
    try {
      await axios.delete(`/risk/${row.rid}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setSelectedRiskTable(
        selectedRiskTable.filter((selectedData) => selectedData !== row)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // function to save a risk from risk table into database
  const saveRisk = async (row) => {
    try {
      await axios.patch(
        `/risk/${row.rid}`,
        JSON.stringify({ strategy: row.strategy }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const index = selectedRiskTable.indexOf(row);
      if (index >= 0) {
        const newSelectedData = [...selectedRiskTable];
        newSelectedData[index] = {
          ...newSelectedData[index],
          strategy: row.strategy,
        };
        setSelectedRiskTable(newSelectedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // function to add a risk to the selected project's risk table
  const addRisk = async (row) => {
    if (selectedProject !== null) {
      try {
        const risk = scenarios.find((s) => s._id === row._id);
        const response = await axios.post(
          "/risk/create",
          JSON.stringify({
            pid: selectedProjectID,
            sid: risk._id,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newRow = {
          _id: row._id,
          scenarioName: row.scenarioName,
          scenarioDescription: row.scenarioDescription,
          rid: response?.data?._id,
          pid: selectedProjectID,
          projectName: selectedProject,
        };
        const newSelectedData = [...selectedRiskTable, newRow];
        console.log(newSelectedData);
        setSelectedRiskTable(newSelectedData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <NavigationBar
        loggedIn={true}
        username={auth?.username}
        role={auth?.role}
      />
      <div className="container">
        <div className="d-flex">
          <DropdownButton
            variant="secondary"
            title="Select Project"
            onSelect={(eventKey) => clickProjectName(eventKey)}
            style={{ margin: "20px 20px 0 0" }}
          >
            {projects.map((project) => (
              <Dropdown.Item eventKey={project._id}>
                {project.projectName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          {!auth?.role && (
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
            </Button>
          )}
          {!auth?.role && (
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
          )}
          {auth?.role && (
            <DropdownButton
              variant="secondary"
              title="Select Project Manager"
              onSelect={(eventKey) => filterDataByName(eventKey)}
              style={{ margin: "20px 0 0 0", marginLeft: "auto" }}
            >
              <Dropdown.Item eventKey="-1">All</Dropdown.Item>
              {projectManagers.map((row) => (
                <Dropdown.Item eventKey={row._id}>{row.name}</Dropdown.Item>
              ))}
            </DropdownButton>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {!auth?.role && (
            <h3
              style={{
                margin: "20px 0 20px 0",
                flexBasis: "49%",
              }}
            >
              Risk Table for {selectedProject}
            </h3>
          )}
          {auth?.role && (
            <h3
              style={{
                margin: "20px 0 20px 0",
                flexBasis: "49%",
              }}
            >
              Risk Table of {selectedProjectManager}
            </h3>
          )}
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
              {selectedRiskTable.map((row) => (
                <tr key={row.rid}>
                  <td>{row.projectName}</td>
                  <td>{row.scenarioName}</td>
                  <td>{row.scenarioDescription}</td>
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
                          allowStrategyEditing(row, event.target.value)
                        }
                      />
                    </Form.Group>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => saveRisk(row)}
                      style={{ margin: "0 5px 0 0" }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
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
              {scenarios.map((row) => (
                <tr key={row._id}>
                  <td>{row.scenarioName}</td>
                  <td>{row.scenarioDescription}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
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
