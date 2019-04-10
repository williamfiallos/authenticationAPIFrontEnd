import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditProject from './EditProjects';
import AddTask from '../tasks/AddTasks';

class ProjectDetails extends Component {
  state = {};
  componentDidMount() {
    this.getSingleProject();
  }

  getSingleProject = () => {
    const { params } = this.props.match;
    axios
      .get(`http://localhost:5000/api/projects/${params.id}`, {
        withCredentials: true,
      })
      .then(responseFromApi => {
        const theProject = responseFromApi.data;
        this.setState(theProject); //Same as => this.setState({theProject:theProject})
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteProject = () => {
    const { params } = this.props.match;
    axios
      .delete(`http://localhost:5000/api/projects/${params.id}`, {
        withCredentials: true,
      })
      .then(() => {
        this.props.history.push('/projects'); // !!!
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderEditForm = () => {
    if (!this.state.title) {
      this.getSingleProject();
    } else {
      return (
        <EditProject
          theProject={this.state}
          getTheProject={this.getSingleProject}
          {...this.props}
        />
      );
    }
  };

  renderAddTaskForm = () => {
    if (!this.state.title) {
      this.getSingleProject();
    } else {
      return (
        <AddTask
          theProject={this.state}
          getTheProject={this.getSingleProject}
        />
      );
    }
  };

  ownershipCheck = project => {
    console.log('loggedInUser', this.props.loggedInUser);
    console.log('owner', project.owner);
    //console.log('_id', this.props.loggedInUser._id);

    if (
      this.props.loggedInUser &&
      project.owner == this.props.loggedInUser._id
    ) {
      return (
        <div>
          <div>{this.renderEditForm()} </div>
          <button onClick={() => this.deleteProject(this.state._id)}>
            Delete project
          </button>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <p>{this.state.description}</p>
        {this.state.tasks && <h3>Tasks </h3>}
        {this.state.tasks &&
          this.state.tasks.map((task, index) => {
            return (
              <div key={index}>
                {/* ... make each task's title a link that goes to the task details page */}
                <Link to={`/projects/${this.state._id}/tasks/${task._id}`}>
                  {task.title}
                </Link>
              </div>
            );
          })}
        <div>{this.ownershipCheck(this.state)}</div>
        <div>{this.renderAddTaskForm()} </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Link to={'/projects'}>Back to projects</Link>
      </div>
    );
  }
}
export default ProjectDetails;
