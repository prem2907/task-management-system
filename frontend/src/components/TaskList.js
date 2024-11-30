import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateTask from "./CreateTask.js"; // Ensure this component is defined properly
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faPlus } from "@fortawesome/free-solid-svg-icons"; // Import necessary icons

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [collapseOngoing, setCollapseOngoing] = useState(true);
  const [collapseCompleted, setCollapseCompleted] = useState(true);
  const [collapseCancelled, setCollapseCancelled] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setTasks(res.data); // Update state with fetched tasks
    } catch (err) {
      console.error(err.response.data); // Handle error
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component mounts
  }, []);

  const handleTaskCreated = () => {
    fetchTasks(); // Refresh tasks after creating a new one
    setShowCreateTask(false); // Hide form after task creation
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status },
        {
          headers: { "x-auth-token": localStorage.getItem("token") }
        }
      );
      fetchTasks(); // Refresh tasks after updating status
    } catch (err) {
      console.error(err.response.data); // Handle error
    }
  };

  // Separate tasks into categories
  const ongoingTasks = tasks.filter((task) => task.status === "ongoing");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const cancelledTasks = tasks.filter((task) => task.status === "cancelled");

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Tasks</h2>
      <div className="row">
        {/* Task Creation Form */}
        <div className="col-md-3 mb-2">
        <button
            className="btn btn-primary mb-3"
            onClick={() => setShowCreateTask(!showCreateTask)}
          >
            {showCreateTask ? (
              <FontAwesomeIcon icon={faTimesCircle} /> // Show only closing icon when form is open
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} /> New Task {/* Show plus icon and text when form is closed */}
              </>
            )}
          </button>
          {showCreateTask && (
            <div className="border p-3" style={{ maxWidth: '300px' }}>
              <CreateTask onTaskCreated={handleTaskCreated} />
            </div>
          )}
        </div>

        {/* Task Lists Section */}
        <div className="col-md-9">
          {/* Task Categories Section */}
          <div className="d-flex justify-content-around mb-3">
            <button
              className="btn btn-primary dropdown-toggle"
              onClick={() => setCollapseOngoing(!collapseOngoing)}
              aria-expanded={!collapseOngoing}
            >
              Ongoing Tasks
            </button>
            <button
              className="btn btn-success dropdown-toggle"
              onClick={() => setCollapseCompleted(!collapseCompleted)}
              aria-expanded={!collapseCompleted}
            >
              Completed Tasks
            </button>
            <button
              className="btn btn-danger dropdown-toggle"
              onClick={() => setCollapseCancelled(!collapseCancelled)}
              aria-expanded={!collapseCancelled}
            >
              Cancelled Tasks
            </button>
          </div>

          {/* Task Lists Section */}
          <div className="row">
            {/* Ongoing Tasks List */}
            <div className={`col-md-4`}>
              <div className={`collapse ${collapseOngoing ? "" : "show"}`}>
                <div className="mt-2">
                  {ongoingTasks.length === 0 ? (
                    <div className="text-center">
                      <h4>No Ongoing Tasks</h4>
                    </div>
                  ) : (
                    <ul className="list-group">
                      {ongoingTasks.map((task) => (
                        <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{task.title}</strong>
                            <br />
                            <small>{task.description}</small>
                          </div>
                          <div>
                            <button
                              className="btn btn-success mr-2"
                              onClick={() => updateTaskStatus(task._id, "completed")}
                            >
                              <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => updateTaskStatus(task._id, "cancelled")}
                            >
                              <FontAwesomeIcon icon={faTimesCircle} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Completed Tasks List */}
            <div className={`col-md-4`}>
              <div className={`collapse ${collapseCompleted ? "" : "show"}`}>
                <div className="mt-2">
                  {completedTasks.length === 0 ? (
                    <div className="text-center">
                      <h4>No Completed Tasks</h4>
                    </div>
                  ) : (
                    <ul className="list-group">
                      {completedTasks.map((task) => (
                        <li key={task._id} className="list-group-item bg-success text-white">
                          <strong>{task.title}</strong>
                          <br />
                          <small>{task.description}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Cancelled Tasks List */}
            <div className={`col-md-4`}>
              <div className={`collapse ${collapseCancelled ? "" : "show"}`}>
                <div className="mt-2">
                  {cancelledTasks.length === 0 ? (
                    <div className="text-center">
                      <h4>No Cancelled Tasks</h4>
                    </div>
                  ) : (
                    <ul className="list-group">
                      {cancelledTasks.map((task) => (
                        <li key={task._id} className="list-group-item bg-danger text-white">
                          <strong>{task.title}</strong>
                          <br />
                          <small>{task.description}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;